import { useLanguage } from "@/context/LanguageContext";
import { Shield, ArrowRight } from "lucide-react";

const effectiveDate = "04/04/2026";

const Privacy = () => {
  const { isRTL } = useLanguage();

  const sections = isRTL
    ? [
        {
          title: "1. איזה מידע נאסף",
          body: [
            "מידע חשבון בסיסי שתבחרו למסור, כמו שם תצוגה, אימייל, תמונת פרופיל ופרטי הכלב.",
            "מידע מיקום כאשר אתם מפעילים פיצ'רים מבוססי GPS, כדי להציג גינות כלבים, משתמשים ותוכן רלוונטי בקרבתכם.",
            "מידע טכני על המכשיר והשימוש באפליקציה, כולל גרסת אפליקציה, מערכת הפעלה, ביצועים ותקלות.",
            "מידע הקשור לחיבורי Bluetooth רק אם תבחרו להשתמש בפיצ'רים הדורשים זאת."
          ]
        },
        {
          title: "2. למה המידע משמש",
          body: [
            "להפעלת השירותים המרכזיים של DogYard, כולל איתור גינות, פרופיל משתמש, קהילה ותוכן מותאם אזור.",
            "לשיפור יציבות, אבטחה וחוויית שימוש באמצעות ניטור שגיאות ואנליטיקה בסיסית.",
            "למניעת שימוש לרעה, תיקון תקלות ושמירה על בטיחות השירות והקהילה."
          ]
        },
        {
          title: "3. שירותי צד שלישי",
          body: [
            "Supabase משמש לאחסון נתונים, אימות משתמשים וסנכרון נתונים.",
            "Firebase עשוי לשמש לדיווח קריסות, ניטור יציבות ואנליטיקה תפעולית.",
            "Google Maps ושירותי מיקום עשויים לשמש להצגת מפות, חיפוש מיקומים והצגת נקודות עניין."
          ]
        },
        {
          title: "4. הרשאות רגישות",
          body: [
            "מיקום: נדרש כדי להציג גינות כלבים ושירותים קרובים. ניתן לבטל דרך הגדרות המכשיר.",
            "Bluetooth: נדרש רק לפיצ'רים שתלויים בזיהוי/חיבור התקנים. אם לא תשתמשו בהם, אין חובה להפעיל הרשאה זו.",
            "אינטרנט: נדרש לטעינת נתונים, סנכרון פרופיל ושירותי מפה."
          ]
        },
        {
          title: "5. שמירה, אבטחה וזכויות משתמש",
          body: [
            "המידע מועבר באמצעות חיבורים מאובטחים ונשמר באמצעות ספקי תשתית חיצוניים של השירות.",
            "איננו מוכרים מידע אישי לצדדים שלישיים.",
            "באפשרותכם לבקש עיון, תיקון או מחיקה של נתוני החשבון שלכם בכפוף לדרישות החוק וליכולות המוצר הקיימות.",
            "אנו שומרים נתונים כל עוד הם נדרשים לתפעול השירות, אבטחה, מניעת הונאה ועמידה בדרישות חוקיות."
          ]
        }
      ]
    : [
        {
          title: "1. What information we collect",
          body: [
            "Basic account information that you choose to provide, such as display name, email, profile image, and dog details.",
            "Location data when you enable GPS-based features so we can show nearby dog parks, users, and relevant local content.",
            "Technical and usage information such as app version, operating system, crash reports, and performance signals.",
            "Bluetooth-related information only when you choose to use features that require nearby device discovery or connection."
          ]
        },
        {
          title: "2. How we use information",
          body: [
            "To operate DogYard core services, including park discovery, user profiles, community features, and localized content.",
            "To improve stability, security, and usability through crash monitoring and limited analytics.",
            "To prevent abuse, troubleshoot failures, and maintain service integrity for the community."
          ]
        },
        {
          title: "3. Third-party services",
          body: [
            "Supabase may be used for data storage, authentication, and synchronization.",
            "Firebase may be used for crash reporting, operational analytics, and service reliability monitoring.",
            "Google Maps and related location services may be used to display maps, search places, and show nearby points of interest."
          ]
        },
        {
          title: "4. Sensitive permissions",
          body: [
            "Location: used to display nearby dog parks and local features. You can revoke it in device settings.",
            "Bluetooth: required only for features that depend on nearby device discovery or connection.",
            "Internet access: required to load app data, sync your profile, and serve map content."
          ]
        },
        {
          title: "5. Retention, security, and your rights",
          body: [
            "Data is transmitted through secured connections and stored using third-party infrastructure providers that support the service.",
            "We do not sell your personal data.",
            "You may request access, correction, or deletion of your account data, subject to applicable law and current product capabilities.",
            "We retain data only as long as needed for service delivery, fraud prevention, security, and legal compliance."
          ]
        }
      ];

  return (
    <div className="min-h-screen bg-background py-12 px-4" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-3xl mx-auto glass p-8 rounded-2xl border-gradient">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-display font-black text-foreground">
            {isRTL ? "מדיניות פרטיות" : "Privacy Policy"}
          </h1>
        </div>

        <div className="mb-8 rounded-2xl border border-border/60 bg-card/40 p-4 text-sm text-muted-foreground">
          <p>{isRTL ? `תוקף המדיניות: ${effectiveDate}` : `Effective date: ${effectiveDate}`}</p>
          <p className="mt-2">
            {isRTL
              ? "מסמך זה נועד להסביר באופן ברור אילו נתונים נאספים, מדוע הם נדרשים, וכיצד ניתן לשלוט בהם בתוך האפליקציה ובמערכת ההפעלה."
              : "This notice explains which data categories may be collected, why they are needed, and how you can control them in the app and your device settings."}
          </p>
        </div>

        <div className="space-y-6 text-muted-foreground leading-relaxed">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-bold text-foreground mb-2">{section.title}</h2>
              <ul className="space-y-2 list-disc pr-5 pl-5">
                {section.body.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}

          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">
              {isRTL ? "6. יצירת קשר" : "6. Contact"}
            </h2>
            <p>
              {isRTL
                ? "לשאלות בנושא פרטיות, נתונים או בקשות משתמש, יש לפנות דרך ערוץ התמיכה הרשמי של DogYard או פרטי הקשר שמופיעים בדף החנות/באתר הרשמי."
                : "For privacy, data, or account requests, please use DogYard's official support channel or the contact details published on the store listing or official website."}
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
