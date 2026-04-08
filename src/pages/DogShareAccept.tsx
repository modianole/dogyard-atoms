import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle, LogIn } from "lucide-react";
const DogShareAccept = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [acceptedDogName, setAcceptedDogName] = useState<string | null>(null);
  useEffect(() => {
    const acceptInvite = async () => {
      if (!token) {
        setError("קישור השיתוף לא תקין");
        setLoading(false);
        return;
      }
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        setLoading(false);
        return;
      }
      const { data, error: acceptError } = await supabase.rpc("accept_dog_share_invite", {
        p_token: token,
      });
      if (acceptError) {
        setError("לא הצלחנו לאשר את ההזמנה. ייתכן שהקישור פג תוקף.");
        setLoading(false);
        return;
      }
      const inviteData = (data || {}) as { dog_name?: string };
      setAcceptedDogName(inviteData.dog_name || null);
      setLoading(false);
    };
    acceptInvite();
  }, [token]);
  const goToLogin = () => {
    const currentUrl = `${window.location.pathname}${window.location.search}`;
    navigate(`/auth?next=${encodeURIComponent(currentUrl)}`);
  };
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">טוען הזמנה...</div>;
  }
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4" dir="rtl">
      <Card className="w-full max-w-lg">
        <CardContent className="p-6 space-y-4 text-center">
          {!token && (
            <>
              <AlertTriangle className="w-10 h-10 mx-auto text-destructive" />
              <h1 className="text-xl font-bold">קישור לא תקין</h1>
              <p className="text-muted-foreground">לא מצאנו טוקן הזמנה בקישור שקיבלת.</p>
              <Button onClick={() => navigate("/")}>חזרה לדף הבית</Button>
            </>
          )}
          {token && !acceptedDogName && !error && (
            <>
              <LogIn className="w-10 h-10 mx-auto text-primary" />
              <h1 className="text-xl font-bold">נדרש להתחבר לפני אישור ההזמנה</h1>
              <p className="text-muted-foreground">התחבר כדי להצטרף לפרופיל הכלב המשותף.</p>
              <Button onClick={goToLogin}>התחבר והמשך</Button>
            </>
          )}
          {error && (
            <>
              <AlertTriangle className="w-10 h-10 mx-auto text-destructive" />
              <h1 className="text-xl font-bold">לא ניתן לאשר את ההזמנה</h1>
              <p className="text-muted-foreground">{error}</p>
              <Button variant="outline" onClick={() => navigate("/")}>חזרה לדף הבית</Button>
            </>
          )}
          {acceptedDogName && (
            <>
              <CheckCircle2 className="w-10 h-10 mx-auto text-green-600" />
              <h1 className="text-xl font-bold">ההזמנה אושרה בהצלחה</h1>
              <p className="text-muted-foreground">
                הצטרפת לפרופיל של <span className="font-bold text-foreground">{acceptedDogName}</span>.
              </p>
              <Button onClick={() => navigate("/profile")}>עבור לפרופיל</Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
export default DogShareAccept;
