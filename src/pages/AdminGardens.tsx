
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Check, X, MapPin, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface Garden {
  id: string;
  name: string;
  location: string;
  status: string;
  created_at: string;
}

const AdminGardens = () => {
  const [gardens, setGardens] = useState<Garden[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchPendingGardens = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("gardens")
        .select("id, name, location, status, created_at")
        .neq("status", "approved")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setGardens(data || []);
    } catch (error: any) {
      toast.error("שגיאה בטעינת גינות: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const approveGarden = async (id: string) => {
    setProcessingId(id);
    try {
      const { error } = await supabase
        .from("gardens")
        .update({ status: "approved" })
        .eq("id", id);

      if (error) throw error;

      toast.success("הגינה אושרה בהצלחה!");
      setGardens(gardens.filter(g => g.id !== id));
    } catch (error: any) {
      toast.error("שגיאה באישור הגינה: " + error.message);
    } finally {
      setProcessingId(null);
    }
  };

  useEffect(() => {
    fetchPendingGardens();
  }, []);

  return (
    <div className="container mx-auto p-4 pt-8 pb-24">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-primary/10 rounded-2xl">
          <ShieldCheck className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-black">ניהול גינות</h1>
          <p className="text-muted-foreground text-sm">אישור גינות חדשות במערכת</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : gardens.length === 0 ? (
        <div className="text-center py-20 bg-muted/30 rounded-3xl border-2 border-dashed">
          <p className="text-muted-foreground font-bold">אין גינות הממתינות לאישור</p>
          <Button variant="link" onClick={() => navigate("/map")} className="mt-2">
            חזרה למפה
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {gardens.map((garden) => (
            <div
              key={garden.id}
              className="bg-card border border-border p-5 rounded-3xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    {garden.name}
                    <span className="text-[10px] px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full font-black uppercase">
                      {garden.status || 'Pending'}
                    </span>
                  </h3>
                  <div className="flex items-center gap-1 text-muted-foreground mt-1 text-sm">
                    <MapPin className="w-3 h-3" />
                    <span>{garden.location}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2">
                    נוצר בתאריך: {new Date(garden.created_at).toLocaleDateString('he-IL')}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    className="rounded-2xl border-red-200 text-red-500 hover:bg-red-50"
                    onClick={() => toast.info("אופציית מחיקה תתווסף בקרוב")}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                  <Button
                    onClick={() => approveGarden(garden.id)}
                    disabled={processingId === garden.id}
                    className="rounded-2xl bg-green-600 hover:bg-green-700 text-white px-6 font-bold"
                  >
                    {processingId === garden.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Check className="w-4 h-4 ml-2" />
                        אשר
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminGardens;
