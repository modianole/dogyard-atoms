
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import { Bell, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Notifications = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 pt-24 space-y-6 text-right" dir="rtl">
        <h1 className="text-2xl font-bold flex items-center gap-2 justify-end">
          התראות
          <Bell className="w-6 h-6 text-primary" />
        </h1>

        <div className="space-y-4">
          <Card className="border-dashed border-2 bg-muted/20">
            <CardContent className="p-12 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <Info className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-medium">אין התראות חדשות</p>
              <p className="text-xs text-muted-foreground mt-1">כאן יופיעו עדכונים על חברים שמגיעים לגינה או דיווחים בסביבה.</p>
            </CardContent>
          </Card>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Notifications;
