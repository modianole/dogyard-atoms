-- Dog profile sharing MVP: owner can invite family / partner / dog walker.

DO $$ BEGIN
  CREATE TYPE public.dog_share_role AS ENUM ('owner', 'editor', 'viewer');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.dog_profile_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dog_id UUID NOT NULL CONSTRAINT dog_profile_members_dog_id_fkey REFERENCES public.dogs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL CONSTRAINT dog_profile_members_user_id_fkey REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.dog_share_role NOT NULL DEFAULT 'viewer',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked')),
  created_by UUID CONSTRAINT dog_profile_members_created_by_fkey REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT dog_profile_members_unique UNIQUE (dog_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.dog_share_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dog_id UUID NOT NULL CONSTRAINT dog_share_invites_dog_id_fkey REFERENCES public.dogs(id) ON DELETE CASCADE,
  invited_by UUID NOT NULL CONSTRAINT dog_share_invites_invited_by_fkey REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.dog_share_role NOT NULL DEFAULT 'viewer',
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  accepted_by UUID CONSTRAINT dog_share_invites_accepted_by_fkey REFERENCES auth.users(id) ON DELETE SET NULL,
  accepted_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dog_profile_members_user_status ON public.dog_profile_members (user_id, status);
CREATE INDEX IF NOT EXISTS idx_dog_profile_members_dog_status ON public.dog_profile_members (dog_id, status);
CREATE INDEX IF NOT EXISTS idx_dog_share_invites_dog ON public.dog_share_invites (dog_id);
CREATE INDEX IF NOT EXISTS idx_dog_share_invites_expires ON public.dog_share_invites (expires_at);

-- Keep owner membership in sync for existing dogs.
INSERT INTO public.dog_profile_members (dog_id, user_id, role, status, created_by)
SELECT d.id, d.owner_id, 'owner'::public.dog_share_role, 'active', d.owner_id
FROM public.dogs d
ON CONFLICT (dog_id, user_id)
DO UPDATE SET
  role = 'owner'::public.dog_share_role,
  status = 'active',
  updated_at = now();

CREATE OR REPLACE FUNCTION public.sync_dog_owner_membership()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.dog_profile_members (dog_id, user_id, role, status, created_by)
  VALUES (NEW.id, NEW.owner_id, 'owner'::public.dog_share_role, 'active', NEW.owner_id)
  ON CONFLICT (dog_id, user_id)
  DO UPDATE SET
    role = 'owner'::public.dog_share_role,
    status = 'active',
    updated_at = now();

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_dog_owner_membership ON public.dogs;
CREATE TRIGGER trg_sync_dog_owner_membership
AFTER INSERT OR UPDATE OF owner_id ON public.dogs
FOR EACH ROW
EXECUTE FUNCTION public.sync_dog_owner_membership();

DROP TRIGGER IF EXISTS update_dog_profile_members_updated_at ON public.dog_profile_members;
CREATE TRIGGER update_dog_profile_members_updated_at
BEFORE UPDATE ON public.dog_profile_members
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.dog_profile_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dog_share_invites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Members can read memberships" ON public.dog_profile_members;
CREATE POLICY "Members can read memberships"
ON public.dog_profile_members
FOR SELECT
USING (
  auth.uid() = user_id
  OR EXISTS (
    SELECT 1
    FROM public.dogs d
    WHERE d.id = dog_id
      AND d.owner_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Owners manage memberships" ON public.dog_profile_members;
CREATE POLICY "Owners manage memberships"
ON public.dog_profile_members
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.dogs d
    WHERE d.id = dog_id
      AND d.owner_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.dogs d
    WHERE d.id = dog_id
      AND d.owner_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Owners manage invites" ON public.dog_share_invites;
CREATE POLICY "Owners manage invites"
ON public.dog_share_invites
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.dogs d
    WHERE d.id = dog_id
      AND d.owner_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.dogs d
    WHERE d.id = dog_id
      AND d.owner_id = auth.uid()
  )
);

CREATE OR REPLACE FUNCTION public.create_dog_share_invite(
  p_dog_id UUID,
  p_role public.dog_share_role DEFAULT 'viewer',
  p_expires_in_hours INTEGER DEFAULT 48
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_token TEXT;
  v_token_hash TEXT;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.dogs d
    WHERE d.id = p_dog_id
      AND d.owner_id = v_uid
  ) THEN
    RAISE EXCEPTION 'Only dog owner can invite members';
  END IF;

  v_token := encode(gen_random_bytes(24), 'hex');
  v_token_hash := encode(digest(v_token, 'sha256'), 'hex');

  INSERT INTO public.dog_share_invites (dog_id, invited_by, role, token_hash, expires_at)
  VALUES (
    p_dog_id,
    v_uid,
    p_role,
    v_token_hash,
    now() + make_interval(hours => GREATEST(p_expires_in_hours, 1))
  );

  RETURN v_token;
END;
$$;

CREATE OR REPLACE FUNCTION public.accept_dog_share_invite(
  p_token TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_token_hash TEXT;
  v_invite RECORD;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  IF p_token IS NULL OR length(trim(p_token)) = 0 THEN
    RAISE EXCEPTION 'Invalid invite token';
  END IF;

  v_token_hash := encode(digest(trim(p_token), 'sha256'), 'hex');

  SELECT i.id, i.dog_id, i.role, i.invited_by, d.name AS dog_name
  INTO v_invite
  FROM public.dog_share_invites i
  JOIN public.dogs d ON d.id = i.dog_id
  WHERE i.token_hash = v_token_hash
    AND i.accepted_at IS NULL
    AND i.revoked_at IS NULL
    AND i.expires_at > now()
  LIMIT 1;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invite not found or expired';
  END IF;

  IF v_invite.invited_by = v_uid THEN
    RAISE EXCEPTION 'Cannot accept your own invite';
  END IF;

  INSERT INTO public.dog_profile_members (dog_id, user_id, role, status, created_by)
  VALUES (v_invite.dog_id, v_uid, v_invite.role, 'active', v_invite.invited_by)
  ON CONFLICT (dog_id, user_id)
  DO UPDATE SET
    role = EXCLUDED.role,
    status = 'active',
    updated_at = now();

  UPDATE public.dog_share_invites
  SET accepted_by = v_uid,
      accepted_at = now()
  WHERE id = v_invite.id;

  RETURN jsonb_build_object(
    'dog_id', v_invite.dog_id,
    'dog_name', v_invite.dog_name,
    'role', v_invite.role
  );
END;
$$;

REVOKE ALL ON FUNCTION public.create_dog_share_invite(UUID, public.dog_share_role, INTEGER) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.accept_dog_share_invite(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_dog_share_invite(UUID, public.dog_share_role, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.accept_dog_share_invite(TEXT) TO authenticated;

