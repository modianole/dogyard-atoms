import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import BrandLogo from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let isMounted = true;
    const finishAuth = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const providerError = params.get("error_description") || params.get("error");
      const nextPath = sessionStorage.getItem("auth:next") || "/";
      if (providerError) {
        if (isMounted) {
          setError(providerError);
        }
        return;
      }
      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          if (isMounted) {
            setError(exchangeError.message);
          }
          return;
        }
      }
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        sessionStorage.removeItem("auth:next");
        navigate(nextPath, { replace: true });
        return;
      }
      if (isMounted) {
        setError("לא נוצר סשן לאחר ההתחברות עם Google.");
      }
    };
    finishAuth();
    return () => {
      isMounted = false;
    };
  }, [navigate]);
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4" dir="rtl">
        <div className="max-w-md text-center space-y-4">
          <BrandLogo className="w-20 h-20 mx-auto" />
          <h1 className="text-2xl font-black">ההתחברות עם Google נכשלה</h1>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => navigate("/auth", { replace: true })}>חזרה להתחברות</Button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4" dir="rtl">
      <div className="max-w-md text-center space-y-4">
        <BrandLogo className="w-20 h-20 mx-auto animate-pulse" />
        <h1 className="text-2xl font-black">מסיים התחברות...</h1>
        <p className="text-muted-foreground">אנחנו מחברים אותך לחשבון ומחזירים אותך לאפליקציה.</p>
      </div>
    </div>
  );
};
export default AuthCallback;
