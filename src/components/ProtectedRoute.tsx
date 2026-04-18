import { useAuth } from "@/hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    const nextPath = `${location.pathname}${location.search}${location.hash}`;
    sessionStorage.setItem("auth:next", nextPath || "/");
    return <Navigate to={`/auth?next=${encodeURIComponent(nextPath || "/")}`} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
