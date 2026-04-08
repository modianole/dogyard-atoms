import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/context/LanguageContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Capacitor } from "@capacitor/core";
import { Browser } from "@capacitor/browser";
import { useSearchParams } from "react-router-dom";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const { t } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const nextPath = searchParams.get("next") || "/";

  useEffect(() => {
    if (!authLoading && user) {
      window.location.assign(nextPath);
    }
  }, [user, authLoading, nextPath]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (forgotPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success(t.auth.resetSent);
        setForgotPassword(false);
      } else if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success(t.auth.loginSuccess);
        window.location.assign(nextPath);
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: name },
          },
        });
        if (error) throw error;
        toast.success(t.auth.signupSuccess);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const isApp = Capacitor.isNativePlatform();
      // Use the custom scheme for mobile, or the web origin for browser
      const redirectUri = isApp
        ? "com.dogyard.app://auth-callback"
        : window.location.origin;


      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUri,
          skipBrowserRedirect: isApp,
        },
      });

      if (error) throw error;

      if (isApp && data?.url) {
        await Browser.open({ url: data.url });
      }
    } catch (error: any) {
      toast.error(error.message || "שגיאה בהתחברות עם גוגל");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <BrandLogo className="w-20 h-20 animate-pulse" />
      </div>
    );
  }

  if (forgotPassword) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4" dir="rtl">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <BrandLogo className="w-20 h-20 mx-auto" />
            <h1 className="text-2xl font-bold text-foreground">{t.auth.forgotTitle}</h1>
            <p className="text-muted-foreground text-sm">{t.auth.forgotSubtitle}</p>
          </div>
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="relative">
              <Mail className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input type="email" placeholder={t.auth.email} value={email} onChange={e => setEmail(e.target.value)} className="pr-10" required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "..." : t.auth.sendReset}
            </Button>
            <button type="button" onClick={() => setForgotPassword(false)} className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t.auth.backToLogin}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <BrandLogo className="w-20 h-20 mx-auto" />
          <h1 className="text-2xl font-bold text-foreground">
            {isLogin ? t.auth.loginTitle : t.auth.signupTitle}
          </h1>
          <p className="text-muted-foreground text-sm">
            {isLogin ? t.auth.loginSubtitle : t.auth.signupSubtitle}
          </p>
        </div>

        <Button variant="outline" className="w-full gap-2" onClick={handleGoogleLogin}>
          <svg viewBox="0 0 24 24" className="w-5 h-5"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          {t.auth.google}
        </Button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">{t.auth.or}</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input placeholder={t.auth.name} value={name} onChange={e => setName(e.target.value)} className="pr-10" required />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input type="email" placeholder={t.auth.email} value={email} onChange={e => setEmail(e.target.value)} className="pr-10" required />
          </div>
          <div className="relative">
            <Lock className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input type="password" placeholder={t.auth.password} value={password} onChange={e => setPassword(e.target.value)} className="pr-10" required minLength={6} />
          </div>

          {isLogin && (
            <button type="button" onClick={() => setForgotPassword(true)} className="text-xs text-primary hover:underline">
              {t.auth.forgot}
            </button>
          )}

          <Button type="submit" className="w-full gap-2" disabled={loading}>
            {loading ? "..." : isLogin ? t.auth.loginBtn : t.auth.signupBtn}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {isLogin ? t.auth.noAccount : t.auth.hasAccount}{" "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-primary font-medium hover:underline">
            {isLogin ? t.auth.signupLink : t.auth.loginLink}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
