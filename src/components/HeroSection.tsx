import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { useRef, useCallback, useState, useEffect, lazy, Suspense } from "react";
import { useLanguage } from "@/context/LanguageContext";

const NearbyGardenMap = lazy(() => import("./NearbyGardenMap"));

const VIDEOS = ["/hero-video.mp4", "/hero-video-2.mp4", "/hero-video-3.mp4"];

const HeroSection = () => {
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);
  const [activeSlot, setActiveSlot] = useState<"A" | "B">("A");
  const [mapOpen, setMapOpen] = useState(false);
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
    <section className="relative overflow-hidden">
      <div className="relative h-[520px] md:h-[600px]">
        <video ref={videoARef} autoPlay muted playsInline onEnded={activeSlot === "A" ? handleEnded : undefined} className="absolute inset-0 w-full h-full object-cover" style={{ zIndex: activeSlot === "A" ? 1 : 0 }} src={VIDEOS[0]} />
        <video ref={videoBRef} muted playsInline onEnded={activeSlot === "B" ? handleEnded : undefined} className="absolute inset-0 w-full h-full object-cover" style={{ zIndex: activeSlot === "B" ? 1 : 0 }} />
        
        {/* Futuristic overlay with gradient mesh */}
        <div className="absolute inset-0" style={{ zIndex: 2, background: `linear-gradient(${isRTL ? '270deg' : '90deg'}, hsla(220,20%,4%,0.85) 0%, hsla(220,20%,4%,0.5) 40%, transparent 70%)` }} />
        <div className="absolute inset-0" style={{ zIndex: 2, background: 'linear-gradient(180deg, transparent 60%, hsla(220,20%,4%,0.9) 100%)' }} />
        
        {/* Glow orbs */}
        <div className="absolute w-[300px] h-[300px] rounded-full opacity-20 blur-[100px]" style={{ zIndex: 2, background: 'hsl(24, 95%, 53%)', bottom: '-100px', right: '20%' }} />
        <div className="absolute w-[200px] h-[200px] rounded-full opacity-10 blur-[80px]" style={{ zIndex: 2, background: 'hsl(142, 70%, 45%)', top: '20%', left: '10%' }} />

        <div className={`relative container mx-auto h-full flex items-center ${isRTL ? "justify-start" : "justify-end"} px-4`} style={{ zIndex: 3 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
            className={`max-w-lg ${isRTL ? "text-right" : "text-left"}`}
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-1.5 mb-4 rounded-full text-xs font-bold glass text-foreground border-none animate-pulse-glow"
            >
              {t.hero.badge}
            </motion.span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black leading-tight text-foreground mb-4">
              {t.hero.title1}
              <br />
              <span className="text-gradient-primary">{t.hero.titleHighlight}</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground mb-6 leading-relaxed">
              {t.hero.subtitle}
            </p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className={`flex items-center ${isRTL ? "justify-end" : "justify-start"} gap-3 mb-6`}
            >
              <div className="w-2 h-2 rounded-full bg-accent animate-glow-pulse" />
              <span className="text-sm text-muted-foreground font-medium">{t.hero.mappedGardens}</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`flex ${isRTL ? "justify-end" : "justify-start"}`}
            >
              <button
                onClick={() => setMapOpen(true)}
                className="h-14 px-10 rounded-2xl bg-primary text-primary-foreground font-bold text-lg md:h-12 md:px-8 md:text-base btn-futuristic glow-primary flex items-center gap-3"
              >
                <MapPin className="w-5 h-5" />
                {t.hero.cta}
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
      <Suspense fallback={null}>
        <NearbyGardenMap open={mapOpen} onClose={() => setMapOpen(false)} />
      </Suspense>
    </section>
  );
};

export default HeroSection;
