import BrandLogo from "@/components/BrandLogo";
import { useDeveloperAccess } from "@/hooks/useDeveloperAccess";
import { Navigate, useLocation } from "react-router-dom";

type DeveloperRouteProps = {
  children: React.ReactNode;
};

const DeveloperRoute = ({ children }: DeveloperRouteProps) => {
  const location = useLocation();
  const { user, loading, isDeveloper } = useDeveloperAccess();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <BrandLogo className="w-20 h-20 animate-pulse" />
      </div>
    );
  }

  if (!user) {
    const nextPath = `${location.pathname}${location.search}`;
    return <Navigate to={`/auth?next=${encodeURIComponent(nextPath)}`} replace />;
  }

  if (!isDeveloper) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-md text-center space-y-4">
          <BrandLogo className="w-20 h-20 mx-auto" />
          <h1 className="text-2xl font-black">גישה חסומה</h1>
          <p className="text-muted-foreground">
            עמוד זה זמין רק לחשבון הבעלים שהוגדר במערכת.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default DeveloperRoute;
