import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Check, Loader2, Footprints } from "lucide-react";
import { useCheckIn } from "@/hooks/useCheckIn";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";

interface Props {
  gardenId: string;
}

const CheckInToggle = ({ gardenId }: Props) => {
  const { currentCheckIn, isLoading, checkIn, checkOut, isPending } = useCheckIn(gardenId);
  const { t, isRTL } = useLanguage();
  const [isPressing, setIsPressing] = useState(false);
  const pressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isActive = !!currentCheckIn;
  const isOnWay = currentCheckIn?.status === "on_way";

  // Handle Long Press (15 mins on way)
  const handlePressStart = () => {
    setIsPressing(true);
    pressTimerRef.current = setTimeout(() => {
      handleLongPress();
      setIsPressing(false);
      if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }, 800); // 800ms for long press
  };

  const handlePressEnd = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
      if (isPressing) handleShortClick();
    }
    setIsPressing(false);
  };

  const handleShortClick = () => {
    if (isActive) {
      checkOut();
      toast.info(isRTL ? "יצאת מהגינה" : "Left the garden");
    } else {
      checkIn({ status: "arrived", delayMins: 0 });
      toast.success(isRTL ? "נכנסת לגינה! 🐾" : "Checked-in! 🐾");
    }
  };

  const handleLongPress = () => {
    if (!isActive) {
      checkIn({ status: "on_way", delayMins: 15 });
      toast.info(isRTL ? "סימנת שתגיע עוד 15 דקות! 🐕" : "Coming in 15 mins! 🐕");
    }
  };

  // Re-check logic (40 mins prompt placeholder)
  useEffect(() => {
    if (isActive && !isOnWay) {
      const checkTimer = setTimeout(() => {
        toast("עדיין בגינה?", {
          description: isRTL ? "עברו 40 דקות, האם להמשיך את השהות?" : "40 mins passed, stay checked-in?",
          action: {
            label: isRTL ? "כן, אני פה" : "Yes, still here",
            onClick: () => checkIn({ status: "arrived", delayMins: 0 }),
          },
        });
      }, 40 * 60 * 1000);
      return () => clearTimeout(checkTimer);
    }
  }, [isActive, isOnWay]);

  if (isLoading) return <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />;

  return (
    <div className="relative flex flex-col items-center gap-2">
      <motion.button
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={() => { if (pressTimerRef.current) clearTimeout(pressTimerRef.current); setIsPressing(false); }}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        whileTap={{ scale: 0.95 }}
        className={`
          relative flex items-center justify-between w-48 h-12 rounded-full px-2 transition-all duration-500 shadow-lg
          ${isActive
            ? (isOnWay ? "bg-amber-500/10 border-2 border-amber-500/50" : "bg-primary/10 border-2 border-primary")
            : "bg-muted/30 border-2 border-border/50 hover:border-primary/50"}
        `}
      >
        {/* Sliding indicator */}
        <motion.div
          animate={{ x: isActive ? (isRTL ? -128 : 128) : 0 }}
          className={`absolute w-10 h-10 rounded-full flex items-center justify-center shadow-md
            ${isActive
              ? (isOnWay ? "bg-amber-500" : "bg-primary")
              : "bg-muted-foreground/20"}`}
        >
          {isPending ? (
            <Loader2 className="w-5 h-5 animate-spin text-white" />
          ) : isActive ? (
            isOnWay ? <Footprints className="w-5 h-5 text-white" /> : <Check className="w-5 h-5 text-white" />
          ) : (
            <MapPin className="w-5 h-5 text-muted-foreground" />
          )}
        </motion.div>

        {/* Text Area */}
        <div className={`flex-1 flex justify-center text-xs font-black tracking-tight uppercase px-12 ${isRTL ? "order-1" : ""}`}>
          <AnimatePresence mode="wait">
            {isActive ? (
              <motion.span
                key="active"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className={isOnWay ? "text-amber-600" : "text-primary"}
              >
                {isOnWay
                  ? (isRTL ? "מגיע בקרוב" : "ON MY WAY")
                  : (isRTL ? "אני בגינה" : "AT GARDEN")}
              </motion.span>
            ) : (
              <motion.span
                key="idle"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-muted-foreground"
              >
                {isRTL ? "סמן הגעה" : "CHECK IN"}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Long press indicator */}
        {isPressing && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            className="absolute bottom-0 left-0 h-1 bg-primary/40 rounded-full w-full origin-left"
            transition={{ duration: 0.8 }}
          />
        )}
      </motion.button>

      {/* Helper text for long press */}
      {!isActive && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          className="text-[10px] text-muted-foreground font-medium"
        >
          {isRTL ? "לחיצה ארוכה: מגיע עוד 15 דק׳" : "Long press: 15 mins away"}
        </motion.span>
      )}
    </div>
  );
};

export default CheckInToggle;
