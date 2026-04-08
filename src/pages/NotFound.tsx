import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import BrandLogo from "@/components/BrandLogo";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background" dir="rtl">
      <div className="text-center space-y-6">
        <BrandLogo className="w-24 h-24 mx-auto" />
        <h1 className="text-6xl font-black text-foreground">404</h1>
        <p className="text-xl text-muted-foreground">הדף שחיפשת לא נמצא</p>
        <a href="/" className="inline-block px-6 py-3 rounded-2xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors">
          חזרה לדף הבית
        </a>
      </div>
    </div>
  );
};

export default NotFound;
