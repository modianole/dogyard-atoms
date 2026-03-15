import { useState, useEffect } from "react";
import { Download, Smartphone, Share2, MoreVertical, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    if (isStandalone) setIsInstalled(true);

    const ua = navigator.userAgent;
    setIsIOS(/iPad|iPhone|iPod/.test(ua));

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setIsInstalled(true);
    setDeferredPrompt(null);
  };

  if (isInstalled) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-8 pb-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground">האפליקציה מותקנת! 🎉</h1>
            <p className="text-muted-foreground">דוג פארק כבר מותקנת במכשיר שלך.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="max-w-md w-full">
        <CardContent className="pt-8 pb-8 space-y-6">
          <div className="text-center space-y-3">
            <img src="/pwa-icon-192.png" alt="דוג פארק" className="w-20 h-20 mx-auto rounded-2xl shadow-medium" />
            <h1 className="text-2xl font-display font-bold text-foreground">התקן את דוג פארק</h1>
            <p className="text-muted-foreground">קבל גישה מהירה מהמסך הראשי — בלי חנות אפליקציות</p>
          </div>

          {deferredPrompt ? (
            <Button onClick={handleInstall} size="lg" className="w-full gap-2">
              <Download className="w-5 h-5" />
              התקן עכשיו
            </Button>
          ) : isIOS ? (
            <div className="space-y-4 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground text-center">באייפון, עקוב אחרי השלבים:</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Share2 className="w-4 h-4 text-primary" />
                  </div>
                  <span>לחץ על כפתור ה-<strong>שיתוף</strong> (Share) בסרגל הדפדפן</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Smartphone className="w-4 h-4 text-primary" />
                  </div>
                  <span>בחר <strong>"הוסף למסך הבית"</strong> (Add to Home Screen)</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground text-center">באנדרואיד, עקוב אחרי השלבים:</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <MoreVertical className="w-4 h-4 text-primary" />
                  </div>
                  <span>לחץ על <strong>שלוש הנקודות</strong> בפינה העליונה</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Download className="w-4 h-4 text-primary" />
                  </div>
                  <span>בחר <strong>"התקן אפליקציה"</strong> (Install app)</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Install;
