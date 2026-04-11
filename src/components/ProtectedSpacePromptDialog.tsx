import { useMemo, useState } from "react";
import { Loader2, MapPin, Navigation, ShieldAlert } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useGardens } from "@/hooks/useGardens";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loading: boolean;
  onTurnOn: () => void;
  onManualAddress: (address: string) => Promise<boolean>;
  onGarden: (lat: number, lng: number) => Promise<boolean>;
}

const ProtectedSpacePromptDialog = ({
  open,
  onOpenChange,
  loading,
  onTurnOn,
  onManualAddress,
  onGarden,
}: Props) => {
  const { isRTL, language } = useLanguage();
  const { data: gardens = [] } = useGardens();
  const [manualAddress, setManualAddress] = useState("");
  const [selectedGardenId, setSelectedGardenId] = useState("");

  const selectedGarden = useMemo(
    () => gardens.find((g) => g.id === selectedGardenId),
    [gardens, selectedGardenId],
  );

  const handleManual = async () => {
    const ok = await onManualAddress(manualAddress);
    if (ok) onOpenChange(false);
  };

  const handleGarden = async () => {
    if (!selectedGarden) return;
    const ok = await onGarden(Number(selectedGarden.lat), Number(selectedGarden.lng));
    if (ok) onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent dir={isRTL ? "rtl" : "ltr"} className="max-w-md rounded-3xl">
        <AlertDialogHeader className="text-right">
          <AlertDialogTitle className="text-xl font-black text-foreground flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-blue-500" />
            {isRTL ? "כדי להמשיך, הפעילו GPS" : "Turn on GPS to continue"}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm leading-relaxed">
            {isRTL
              ? "אפשר להפעיל GPS, או לבחור נקודת מוצא ידנית לניווט אוטומטי למרחב המוגן הקרוב."
              : "Enable GPS, or choose a manual starting point to navigate automatically to the nearest protected space."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border p-3 bg-muted/30">
            <p className="text-xs font-semibold mb-2 text-muted-foreground">
              {isRTL ? "אפשרות 1: הפעלת GPS" : "Option 1: Enable GPS"}
            </p>
            <div className="flex gap-2">
              <AlertDialogCancel className="flex-1 rounded-full mt-0">
                {isRTL ? "לא תודה" : "No thanks"}
              </AlertDialogCancel>
              <AlertDialogAction
                className="flex-1 rounded-full bg-blue-600 hover:bg-blue-700"
                onClick={(e) => {
                  e.preventDefault();
                  onTurnOn();
                }}
              >
                {isRTL ? "Turn On" : "Turn On"}
              </AlertDialogAction>
            </div>
          </div>

          <div className="rounded-2xl border border-border p-3 bg-muted/20 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {isRTL ? "אפשרות 2: הזנת מיקום ידני" : "Option 2: Manual location"}
            </p>
            <Input
              value={manualAddress}
              onChange={(e) => setManualAddress(e.target.value)}
              placeholder={isRTL ? "לדוגמה: דיזנגוף 100 תל אביב" : "e.g. Dizengoff 100, Tel Aviv"}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleManual}
              disabled={loading || manualAddress.trim().length < 3}
              className="w-full rounded-xl"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
              <span className="ms-2">{isRTL ? "נווט מהמיקום שהוזן" : "Navigate from typed location"}</span>
            </Button>
          </div>

          <div className="rounded-2xl border border-border p-3 bg-muted/20 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <Navigation className="w-3.5 h-3.5" />
              {isRTL ? "אפשרות 3: בחירת גינה כנקודת מוצא" : "Option 3: Start from a garden"}
            </p>
            <select
              value={selectedGardenId}
              onChange={(e) => setSelectedGardenId(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">{isRTL ? "בחר גינה" : "Select garden"}</option>
              {gardens.map((g) => (
                <option key={g.id} value={g.id}>
                  {language === "en" ? (g.name_en || g.name) : g.name}
                </option>
              ))}
            </select>
            <Button
              type="button"
              variant="outline"
              onClick={handleGarden}
              disabled={loading || !selectedGardenId}
              className="w-full rounded-xl"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
              <span className="ms-2">{isRTL ? "נווט מהגינה שנבחרה" : "Navigate from selected garden"}</span>
            </Button>
          </div>
        </div>

        <AlertDialogFooter className="hidden" />
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ProtectedSpacePromptDialog;

