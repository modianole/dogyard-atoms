export const resolveSafeNextPath = (candidate?: string | null): string => {
  if (!candidate || !candidate.startsWith("/")) return "/";
  if (candidate.startsWith("/auth")) return "/";
  return candidate;
};

