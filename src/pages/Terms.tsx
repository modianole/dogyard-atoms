import { useLanguage } from "@/context/LanguageContext";
import { FileText, ArrowRight } from "lucide-react";

const effectiveDate = "04/04/2026";

const Terms = () => {
  const { isRTL } = useLanguage();

  const sections = isRTL
    ? [
        {
          title: "1. קבלת התנאים",
          body: [
            "השימוש באפליקציית DogYard כפוף לתנאים אלה.",
            "המשך שימוש באפליקציה מהווה הסכמה לתנאים ולמדיניות הפרטיות."
          ]
        },
        {
          title: "2. מטרת השירות",
          body: [
            "האפליקציה מיועדת לסייע באיתור גינות כלבים, חיבור לקהילה ושימוש בפיצ'רים משלימים הקשורים לעולם בעלי הכלבים.",
            "חלק מהשירותים עשויים להשתנות, להתעדכן או להיות מוסרים ללא הודעה מוקדמת."
          ]
        },
        {
          title: "3. שימוש מותר ואסור",
          body: [
            "מותר להשתמש באפליקציה לשימוש אישי וחוקי בלבד.",
            "אסור לבצע הנדסה לאחור, לשבש את השירות, לגרד נתונים באופן אוטומטי, להעלות תוכן פוגעני או להשתמש באפליקציה בניגוד לדין."
          ]
        },
        {
          title: "4. תוכן משתמש וקהילה",
          body: [
            "אתם אחראים למידע, לטקסטים, לתמונות ולדיווחים שתבחרו לפרסם.",
            "בפרסום תוכן באפליקציה אתם מעניקים ל-DogYard הרשאה להציג, לעבד ולאחסן אותו לצורך הפעלת השירות."
          ]
        },
        {
          title: "5. זמינות, אחריות והגבלת אחריות",
          body: [
            "האפליקציה מסופקת כפי שהיא (AS IS) ללא התחייבות לזמינות רציפה, דיוק מלא או התאמה לכל מטרה מסוימת.",
            "DogYard לא תישא באחריות לנזקים עקיפים, לאובדן נתונים, להסתמכות על מידע מיקומי או להשבתות שירות, ככל שהדבר מותר לפי דין."
          ]
        },
        {
          title: "6. סיום שימוש ושינויים",
          body: [
            "אנו רשאים להגביל או להפסיק גישה במקרה של שימוש לרעה, הפרת תנאים או דרישת דין.",
            "אנו רשאים לעדכן תנאים אלה מעת לעת, והמשך שימוש לאחר עדכון מהווה הסכמה לנוסח המעודכן."
          ]
        }
      ]
    : [
        {
          title: "1. Acceptance of terms",
          body: [
            "Your use of DogYard is subject to these terms.",
            "Continuing to use the app means you accept these terms together with the privacy policy."
          ]
        },
        {
          title: "2. Purpose of the service",
          body: [
            "The app is intended to help users discover dog parks, connect with the community, and use related dog-owner features.",
            "Some services may change, be updated, or be removed without prior notice."
          ]
        },
        {
          title: "3. Permitted and prohibited use",
          body: [
            "You may use the app only for lawful personal use.",
            "You may not reverse engineer the app, disrupt the service, scrape data, upload abusive content, or use the service unlawfully."
          ]
        },
        {
          title: "4. User content and community",
          body: [
            "You remain responsible for any information, text, images, reports, or other content that you publish.",
            "By publishing content through the app, you grant DogYard permission to display, process, and store it for operating the service."
          ]
        },
        {
          title: "5. Availability, disclaimer, and limitation of liability",
          body: [
            "The app is provided on an AS IS basis, without guarantees of uninterrupted availability, complete accuracy, or fitness for a specific purpose.",
            "To the maximum extent permitted by law, DogYard is not liable for indirect damages, data loss, reliance on location information, or service interruptions."
          ]
        },
        {
          title: "6. Suspension and changes",
          body: [
            "We may suspend or terminate access in cases of misuse, policy violations, or legal necessity.",
            "We may update these terms from time to time, and continued use after an update means you accept the revised version."
          ]
        }
      ];

  return (
    <div className="min-h-screen bg-background py-12 px-4" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-3xl mx-auto glass p-8 rounded-2xl border-gradient">
        <div className="flex items-center gap-3 mb-8">
          <FileText className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-display font-black text-foreground">
            {isRTL ? "תנאי שימוש" : "Terms of Service"}
          </h1>
        </div>

        <div className="mb-8 rounded-2xl border border-border/60 bg-card/40 p-4 text-sm text-muted-foreground">
          <p>{isRTL ? `תוקף התנאים: ${effectiveDate}` : `Effective date: ${effectiveDate}`}</p>
          <p className="mt-2">
            {isRTL
              ? "לפני שימוש באפליקציה מומלץ לקרוא מסמך זה במלואו. במקרה של סתירה בין דרישות הדין המקומי לבין נוסח זה, דרישות הדין יגברו."
              : "Please review this document before using the app. If local law imposes stricter requirements, those legal requirements will prevail."}
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
              {isRTL ? "7. יצירת קשר" : "7. Contact"}
            </h2>
            <p>
              {isRTL
                ? "לשאלות משפטיות או בקשות הקשורות לשימוש באפליקציה, יש להשתמש בערוץ התמיכה הרשמי של DogYard או בפרטי הקשר שיופיעו בדף החנות/באתר הרשמי."
                : "For legal questions or requests related to app usage, please use DogYard's official support channel or the contact details published on the store listing or official website."}
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

export default Terms;


