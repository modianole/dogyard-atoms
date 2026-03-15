import { useState, useEffect } from "react";
import { Download, Monitor, Check, Chrome, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DownloadDesktop = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    if (isStandalone) setIsInstalled(true);

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
        <Card className="max-w-lg w-full text-center">
          <CardContent className="pt-10 pb-10 space-y-5">
            <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
              <Check className="w-10 h-10 text-accent" />
            </div>
            <h1 className="text-3xl font-display font-bold text-foreground">האפליקציה מותקנת! 🎉</h1>
            <p className="text-muted-foreground text-lg">דוג פארק כבר מותקנת על המחשב שלך. חפש אותה בתפריט ההתחלה או בשולחן העבודה.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="max-w-lg w-full">
        <CardContent className="pt-10 pb-10 space-y-8">
          <div className="text-center space-y-4">
            <div className="w-24 h-24 mx-auto rounded-2xl shadow-lg overflow-hidden">
              <img src="/pwa-icon-192.png" alt="דוג פארק" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-3xl font-display font-bold text-foreground">התקן את דוג פארק למחשב</h1>
            <p className="text-muted-foreground text-lg">גישה מהירה מהשולחן עבודה — בלי דפדפן, בלי חנות</p>
          </div>

          {deferredPrompt ? (
            <Button onClick={handleInstall} size="lg" className="w-full gap-3 text-lg py-6">
              <Download className="w-6 h-6" />
              התקן עכשיו
            </Button>
          ) : (
            <div className="space-y-6">
              <p className="font-semibold text-foreground text-center text-lg">התקנה ידנית מהדפדפן:</p>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/50">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Chrome className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Chrome / Edge</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      לחץ על אייקון ההתקנה <Monitor className="w-4 h-4 inline mx-1" /> בשורת הכתובת, או פתח את התפריט (⋮) ובחר <strong>"התקן אפליקציה"</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/50">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Globe className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">דפדפנים אחרים</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      ודא שאתה משתמש בדפדפן מבוסס Chromium (Chrome, Edge, Brave) — Firefox ו-Safari אינם תומכים בהתקנת אפליקציות למחשב.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="text-center">
            <a href="/install" className="text-sm text-primary hover:underline">
              מחפש להתקין בנייד? לחץ כאן
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DownloadDesktop;
