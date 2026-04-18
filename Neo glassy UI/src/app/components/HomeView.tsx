import { Sparkles, MapPin, Leaf, TrendingUp } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { motion } from 'motion/react';

export function HomeView() {
  const featuredGardens = [
    {
      name: 'Sarona Gardens',
      distance: '0.8 km',
      image: 'https://images.unsplash.com/photo-1599727545192-c70e86f92684?w=400&q=80',
      type: 'Botanical Garden'
    },
    {
      name: 'Rooftop Oasis',
      distance: '1.2 km',
      image: 'https://images.unsplash.com/photo-1721170627991-78447ce43637?w=400&q=80',
      type: 'Urban Garden'
    },
    {
      name: 'Tropical Paradise',
      distance: '2.1 km',
      image: 'https://images.unsplash.com/photo-1721640715397-b8717aaeb6a4?w=400&q=80',
      type: 'Conservation Area'
    },
  ];

  const stats = [
    { icon: Leaf, value: '24', label: 'Gardens Visited' },
    { icon: MapPin, value: '156', label: 'Species Found' },
    { icon: TrendingUp, value: '89%', label: 'Discovery Rate' },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Hero Section */}
      <div className="relative h-[65vh] flex items-center justify-center px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 z-0" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative z-10 max-w-2xl text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-6 py-3 mb-6"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-white/90 text-sm font-medium">AR Experience Ready</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-6xl font-bold text-white mb-4 leading-tight"
          >
            Discover Hidden
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Gardens
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-white/70 text-lg mb-10 max-w-lg mx-auto"
          >
            Explore Tel Aviv's secret green spaces through augmented reality
          </motion.p>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="group relative px-10 py-5 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl font-semibold text-white text-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative flex items-center gap-3">
              <Sparkles className="w-5 h-5" />
              To the Garden
            </span>
          </motion.button>
        </motion.div>
      </div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="relative z-10 px-6 -mt-20 mb-12"
      >
        <GlassCard intensity="medium" className="p-6">
          <div className="grid grid-cols-3 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/20 mb-3">
                    <Icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-white/60 text-sm">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </motion.div>

      {/* Featured Gardens */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.1 }}
        className="relative z-10 px-6 pb-12"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Nearby Gardens</h2>
          <button className="text-emerald-400 text-sm font-medium hover:text-emerald-300 transition-colors">
            View All
          </button>
        </div>

        <div className="grid gap-4">
          {featuredGardens.map((garden, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.3 + index * 0.1 }}
            >
              <GlassCard
              intensity="light"
              glow
              className="p-4 hover:bg-white/15 cursor-pointer transition-all duration-300 group"
            >
              <div className="flex gap-4">
                <div
                  className="w-24 h-24 rounded-xl bg-cover bg-center flex-shrink-0 overflow-hidden"
                  style={{ backgroundImage: `url(${garden.image})` }}
                >
                  <div className="w-full h-full bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-emerald-300 transition-colors">
                    {garden.name}
                  </h3>
                  <p className="text-white/50 text-sm mb-2">{garden.type}</p>
                  <div className="flex items-center gap-1 text-emerald-400 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{garden.distance}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                    <span className="text-emerald-400">→</span>
                  </div>
                </div>
              </div>
            </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
