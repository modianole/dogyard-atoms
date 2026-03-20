import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { useRef, useCallback, useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface HeroSectionProps {
  onOpenMap: () => void;
}

const VIDEOS = ["/hero-video.mp4", "/hero-video-2.mp4", "/hero-video-3.mp4"];

const HeroSection = ({ onOpenMap }: HeroSectionProps) => {
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);
  const [activeSlot, setActiveSlot] = useState<"A" | "B">("A");
  const currentIndexRef = useRef(0);
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    if (videoBRef.current) {
      videoBRef.current.src = VIDEOS[1];
      videoBRef.current.load();
    }
  }, []);

  const handleEnded = useCallback(() => {
    const nextIndex = (currentIndexRef.current + 1) % VIDEOS.length;
    currentIndexRef.current = nextIndex;
    const preloadIndex = (nextIndex + 1) % VIDEOS.length;

    if (activeSlot === "A") {
      videoBRef.current?.play();
      setActiveSlot("B");
      if (videoARef.current) {
        videoARef.current.src = VIDEOS[preloadIndex];
        videoARef.current.load();
      }
    } else {
      videoARef.current?.play();
      setActiveSlot("A");
      if (videoBRef.current) {
        videoBRef.current.src = VIDEOS[preloadIndex];
        videoBRef.current.load();
      }
    }
  }, [activeSlot]);

  return (
    <section className="relative overflow-hidden min-h-[600px] md:min-h-[700px]" id="top">
      <div className="absolute inset-0">
        <video ref={videoARef} autoPlay muted playsInline onEnded={activeSlot === "A" ? handleEnded : undefined} className="absolute inset-0 w-full h-full object-cover" style={{ zIndex: activeSlot === "A" ? 1 : 0 }} src={VIDEOS[0]} />
        <video ref={videoBRef} muted playsInline onEnded={activeSlot === "B" ? handleEnded : undefined} className="absolute inset-0 w-full h-full object-cover" style={{ zIndex: activeSlot === "B" ? 1 : 0 }} />
        
        <div className="absolute inset-0 z-[2] bg-black/30" />
        <div className="absolute inset-0 z-[2]" style={{ background: `linear-gradient(${isRTL ? '270deg' : '90deg'}, hsla(220,20%,4%,0.8) 0%, hsla(220,20%,4%,0.2) 50%, transparent 100%)` }} />
        <div className="absolute inset-0 z-[2]" style={{ background: 'linear-gradient(180deg, transparent 50%, hsla(220,20%,4%,0.9) 100%)' }} />
      </div>

      <div className={`relative container mx-auto min-h-[600px] md:min-h-[700px] flex items-center ${isRTL ? "justify-start" : "justify-end"} px-6 z-[10]`}>
        <motion.div
          initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
          className={`max-w-[95%] md:max-w-2xl ${isRTL ? "text-right" : "text-left"}`}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full text-xs font-black bg-black/40 backdrop-blur-md text-primary border border-primary/20"
          >
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="uppercase tracking-widest">{t.hero.badge}</span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black leading-[1.1] text-white mb-6 tracking-tighter drop-shadow-2xl text-balance">
            {t.hero.title1}
            <br />
            <span className="text-gradient-primary">
              {t.hero.titleHighlight}
            </span>
          </h1>

          <p className="text-lg md:text-2xl text-white/90 font-medium mb-10 leading-relaxed max-w-lg drop-shadow-lg">
            {t.hero.subtitle}
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`flex ${isRTL ? "justify-start" : "justify-end"}`}
          >
            <button
              onClick={onOpenMap}
              className="group relative h-16 md:h-20 px-10 md:px-14 rounded-2xl bg-primary text-primary-foreground font-black text-xl md:text-2xl btn-futuristic glow-primary flex items-center gap-4 shadow-2xl transition-all duration-500 hover:scale-105 active:scale-95"
            >
              <MapPin className="w-7 h-7" />
              {t.hero.cta}
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
