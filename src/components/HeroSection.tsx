import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { useRef, useCallback, useState, useEffect } from "react";

const VIDEOS = ["/hero-video.mp4", "/hero-video-2.mp4", "/hero-video-3.mp4"];

const HeroSection = () => {
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);
  const [activeSlot, setActiveSlot] = useState<"A" | "B">("A");
  const [blinkPhase, setBlinkPhase] = useState<"open" | "closing" | "closed" | "opening">("open");
  const currentIndexRef = useRef(0);

  const preloadNext = useCallback((nextIndex: number, targetRef: React.RefObject<HTMLVideoElement>) => {
    if (targetRef.current) {
      targetRef.current.src = VIDEOS[nextIndex];
      targetRef.current.load();
    }
  }, []);

  useEffect(() => {
    preloadNext(1, videoBRef);
  }, [preloadNext]);

  const handleEnded = useCallback(() => {
    // Start blink
    setBlinking(true);

    setTimeout(() => {
      const nextIndex = (currentIndexRef.current + 1) % VIDEOS.length;
      currentIndexRef.current = nextIndex;

      if (activeSlot === "A") {
        videoBRef.current?.play();
        setActiveSlot("B");
        const preloadIndex = (nextIndex + 1) % VIDEOS.length;
        preloadNext(preloadIndex, videoARef);
      } else {
        videoARef.current?.play();
        setActiveSlot("A");
        const preloadIndex = (nextIndex + 1) % VIDEOS.length;
        preloadNext(preloadIndex, videoBRef);
      }

      // End blink
      setTimeout(() => setBlinking(false), 150);
    }, 150);
  }, [activeSlot, preloadNext]);

  return (
    <section className="relative overflow-hidden">
      {/* Hero Video */}
      <div className="relative h-[520px] md:h-[600px]">
        <video
          ref={videoARef}
          autoPlay
          muted
          playsInline
          onEnded={activeSlot === "A" ? handleEnded : undefined}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
          style={{ opacity: activeSlot === "A" ? 1 : 0 }}
          src={VIDEOS[0]}
        />
        <video
          ref={videoBRef}
          muted
          playsInline
          onEnded={activeSlot === "B" ? handleEnded : undefined}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
          style={{ opacity: activeSlot === "B" ? 1 : 0 }}
        />
        {/* Blink overlay */}
        <div
          className="absolute inset-0 bg-foreground pointer-events-none transition-opacity duration-150 z-10"
          style={{ opacity: blinking ? 1 : 0 }}
        />
        <div className="absolute inset-0 bg-gradient-to-l from-foreground/80 via-foreground/50 to-foreground/20" />

        {/* Content overlay */}
        <div className="relative container mx-auto h-full flex items-end pb-16 md:pb-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
            className="max-w-lg mr-auto text-right"
          >
            <span className="inline-block px-3 py-1 mb-4 rounded-full text-xs font-medium bg-card/20 backdrop-blur-sm text-primary-foreground border border-primary-foreground/20">
              הרשות החברתית לבעלי כלבים
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight text-primary-foreground mb-4">
              מה קורה בגינה שלכם
              <br />
              <span className="text-gradient-primary" style={{ WebkitTextFillColor: "unset", color: "hsl(var(--primary))" }}>עכשיו?</span>
            </h1>
            <p className="text-base md:text-lg text-primary-foreground/80 mb-6 leading-relaxed">
              מעל 100 גינות כלבים בתל אביב-יפו. בדקו דירוגים, דווחו על פקחים ותיאמו
              מפגשים עם החבר׳ה מהגינה
            </p>

            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-4 h-4 text-accent" />
              <span className="text-sm text-primary-foreground/70 font-medium">
                100+ גינות כלבים ממופות בתל אביב
              </span>
            </div>

            <button className="h-12 px-8 rounded-lg bg-primary text-primary-foreground font-bold text-base btn-spring hover:opacity-90 transition-opacity flex items-center gap-3">
              <MapPin className="w-5 h-5" />
              לגינה שלי
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
