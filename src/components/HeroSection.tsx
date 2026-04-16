import { MapPin } from "lucide-react";

import { GlassCard } from "@/components/ui/GlassCard";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  onOpenMap: () => void;
}

const HeroSection = ({ onOpenMap }: HeroSectionProps) => {
  const { t, isRTL } = useLanguage();

  return (
	<section id="top" className="relative overflow-hidden rounded-[2rem] md:rounded-[2.4rem]">
	  <div className="absolute inset-0">
		<img
		  src="https://images.unsplash.com/photo-1560743641-3914f2c45636?auto=format&fit=crop&w=1800&q=80"
		  alt="DogYard hero"
		  className="h-full w-full object-cover"
		/>
		<div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(7,17,13,0.74),rgba(7,17,13,0.35),rgba(7,17,13,0.82))]" />
	  </div>

	  <div className="relative z-10 px-5 py-12 md:px-10 md:py-16 lg:px-16 lg:py-20">
		<GlassCard
		  intensity="light"
		  className={cn(
			"mx-auto max-w-4xl p-6 md:p-10",
			isRTL ? "text-right" : "text-left",
		  )}
		>
		  <p className="mb-4 text-sm font-semibold tracking-wide text-white/80 md:text-lg">{t.hero.badge}</p>

		  <h1 className="font-display text-4xl font-black leading-tight text-white md:text-6xl">
			{t.hero.title1}
			<br />
			<span className="text-emerald-300">{t.hero.titleHighlight}</span>
		  </h1>

		  <p className="mt-5 max-w-2xl text-base text-white/85 md:text-2xl">{t.hero.subtitle}</p>

		  <div className={cn("mt-8 flex", isRTL ? "justify-start" : "justify-end")}>
			<button
			  onClick={onOpenMap}
			  className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-4 text-xl font-black text-white shadow-[0_16px_40px_rgba(16,185,129,0.35)] transition hover:brightness-110 active:scale-95"
			>
			  <MapPin className="h-6 w-6" />
			  {t.hero.cta}
			</button>
		  </div>
		</GlassCard>
	  </div>
	</section>
  );
};

export default HeroSection;
