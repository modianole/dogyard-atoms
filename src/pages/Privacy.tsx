import { useLanguage } from "@/context/LanguageContext";
import { Shield, ArrowRight } from "lucide-react";

const Privacy = () => {
  const { isRTL } = useLanguage();

  return (
    <div className="min-h-screen bg-background py-12 px-4" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-3xl mx-auto glass p-8 rounded-2xl border-gradient">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-display font-black text-foreground">
            {isRTL ? "מדיניות פרטיות" : "Privacy Policy"}
          </h1>
        </div>

        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">
              {isRTL ? "1. איסוף מידע" : "1. Information Collection"}
            </h2>
            <p>
              {isRTL
                ? "אנו אוספים מידע שאתה מספק ישירות, כגון שם, כתובת אימייל ופרטי הכלב שלך בעת ההרשמה. בנוסף, האפליקציה משתמשת במיקום ה-GPS שלך כדי להציג גינות כלבים קרובות אליך."
                : "We collect information you provide directly, such as your name, email address, and dog details when you register. Additionally, the app uses your GPS location to show nearby dog gardens."}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">
              {isRTL ? "2. שימוש במידע" : "2. Information Usage"}
            </h2>
            <p>
              {isRTL
                ? "המידע משמש לשיפור השירות, הצגת תוכן רלוונטי מבוסס מיקום, וניהול קהילת בעלי הכלבים."
                : "The information is used to improve the service, display location-based content, and manage the dog owner community."}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">
              {isRTL ? "3. אבטחת מידע" : "3. Data Security"}
            </h2>
            <p>
              {isRTL
                ? "אנו משתמשים בשירותי ענן מאובטחים (Supabase) כדי להגן על המידע שלך. איננו משתפים מידע אישי עם צדדים שלישיים ללא הסכמתך."
                : "We use secure cloud services (Supabase) to protect your information. We do not share personal information with third parties without your consent."}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">
              {isRTL ? "4. צור קשר" : "4. Contact Us"}
            </h2>
            <p>
              {isRTL
                ? "לכל שאלה בנושא פרטיות, ניתן ליצור קשר דרך האפליקציה."
                : "For any privacy-related questions, you can contact us through the app."}
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <a href="/" className="inline-flex items-center gap-2 text-primary font-bold hover:underline">
            {isRTL ? "חזרה לדף הבית" : "Back to Home"}
            <ArrowRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
