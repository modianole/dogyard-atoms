import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const configuredAdminUserId = (import.meta.env.VITE_ADMIN_USER_ID || "").trim();
const configuredAdminEmail = (import.meta.env.VITE_ADMIN_EMAIL || "").trim().toLowerCase();

// Legacy support so existing env keys still work if already configured.
const legacyDeveloperEmails = (import.meta.env.VITE_DEVELOPER_EMAILS || import.meta.env.VITE_DEVELOPER_EMAIL || "")
  .split(",")
  .map((value: string) => value.trim().toLowerCase())
  .filter(Boolean);

const hasStrictConfig = Boolean(configuredAdminUserId || configuredAdminEmail || legacyDeveloperEmails.length > 0);

export const useDeveloperAccess = () => {
  const { user, loading: authLoading } = useAuth();
  const [hasDeveloperAccess, setHasDeveloperAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const normalizedEmail = useMemo(() => user?.email?.trim().toLowerCase() || "", [user?.email]);

  useEffect(() => {
    let isMounted = true;

    const checkAccess = async () => {
      if (authLoading) return;

      if (!user) {
        if (isMounted) {
          setHasDeveloperAccess(false);
          setLoading(false);
        }
        return;
      }

      // Deny by default when no explicit admin account is configured.
      if (!hasStrictConfig) {
        if (isMounted) {
          setHasDeveloperAccess(false);
          setLoading(false);
        }
        return;
      }

      const matchesAdminUserId = !!configuredAdminUserId && user.id === configuredAdminUserId;
      const matchesAdminEmail = !!configuredAdminEmail && normalizedEmail === configuredAdminEmail;
      const matchesLegacyEmail = legacyDeveloperEmails.length > 0 && legacyDeveloperEmails.includes(normalizedEmail);

      if (isMounted) {
        setHasDeveloperAccess(matchesAdminUserId || matchesAdminEmail || matchesLegacyEmail);
        setLoading(false);
      }
    };

    checkAccess();

    return () => {
      isMounted = false;
    };
  }, [authLoading, normalizedEmail, user]);

  return {
    user,
    loading: authLoading || loading,
    isDeveloper: !!user && hasDeveloperAccess,
  };
};
