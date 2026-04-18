import { Search, MapPin, Navigation, Filter, Layers, Camera } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { ARScanner } from './ARScanner';
import { useState } from 'react';

export function ExploreView() {
  const [activeFilter, setActiveFilter] = useState('all');

  const gardenMarkers = [
    { x: 25, y: 30, name: 'Sarona Park', type: 'botanical' },
    { x: 60, y: 45, name: 'Rooftop Garden', type: 'urban' },
    { x: 40, y: 60, name: 'Secret Grove', type: 'wild' },
    { x: 75, y: 35, name: 'Palm Garden', type: 'tropical' },
    { x: 30, y: 75, name: 'Herb Haven', type: 'culinary' },
  ];

  const filters = [
    { id: 'all', label: 'All', color: 'emerald' },
    { id: 'botanical', label: 'Botanical', color: 'green' },
    { id: 'urban', label: 'Urban', color: 'blue' },
    { id: 'wild', label: 'Wild', color: 'amber' },
  ];

  const nearbyObjects = [
    {
      name: 'Ancient Olive Tree',
      distance: '45m',
      rarity: 'Rare',
      image: 'https://images.unsplash.com/photo-1584089116869-2da6cf904c5c?w=200&q=80'
    },
    {
      name: 'Desert Succulent',
      distance: '120m',
      rarity: 'Common',
      image: 'https://images.unsplash.com/photo-1684314430970-835186101ae5?w=200&q=80'
    },
    {
      name: 'Tropical Fern',
      distance: '200m',
      rarity: 'Uncommon',
      image: 'https://images.unsplash.com/photo-1602298674761-700e96568f5f?w=200&q=80'
    },
  ];

  return (
    <div className="relative min-h-screen">
      {/* AR Scanner Overlay */}
      <ARScanner />

      {/* Map Background Layer */}
      <div className="absolute inset-0">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1684329986410-8c0771cd57ac?w=1600&q=80)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        </div>
      </div>

      {/* Floating UI Elements */}
      <div className="relative z-10 p-6 space-y-4">
        {/* Search Bar */}
        <GlassCard intensity="strong" className="p-4">
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-white/60" />
            <input
              type="text"
              placeholder="Search gardens, plants, locations..."
              className="flex-1 bg-transparent text-white placeholder:text-white/40 outline-none"
            />
            <button className="p-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 transition-colors">
              <Filter className="w-5 h-5 text-emerald-400" />
            </button>
          </div>
        </GlassCard>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`
                px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap
                transition-all duration-300
                ${activeFilter === filter.id
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                  : 'bg-white/10 backdrop-blur-xl border border-white/20 text-white/70 hover:bg-white/15'
                }
              `}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Map Controls */}
        <div className="absolute top-6 right-6 space-y-3">
          <GlassCard intensity="medium" className="p-3">
            <button className="block p-2 rounded-lg hover:bg-white/10 transition-colors">
              <Navigation className="w-5 h-5 text-white" />
            </button>
          </GlassCard>
          <GlassCard intensity="medium" className="p-3">
            <button className="block p-2 rounded-lg hover:bg-white/10 transition-colors">
              <Layers className="w-5 h-5 text-white" />
            </button>
          </GlassCard>
        </div>

        {/* Interactive Map with Garden Markers */}
        <div className="relative h-[50vh] mt-8">
          <GlassCard intensity="light" border={false} className="w-full h-full overflow-hidden">
            <div className="relative w-full h-full">
              {/* Simplified map visualization */}
              <div className="absolute inset-0 opacity-20">
                <svg width="100%" height="100%" className="text-emerald-400">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              {/* Garden Markers */}
              {gardenMarkers.map((marker, index) => (
                <div
                  key={index}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
                  style={{
                    left: `${marker.x}%`,
                    top: `${marker.y}%`,
                    animationDelay: `${index * 0.2}s`
                  }}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/30 backdrop-blur-xl border-2 border-emerald-400 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                      <MapPin className="w-6 h-6 text-emerald-300" />
                    </div>
                    {/* Pulse Ring */}
                    <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping" />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Nearby Objects Panel */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold text-lg">Nearby Objects</h3>
            <span className="text-emerald-400 text-sm">{nearbyObjects.length} detected</span>
          </div>

          <div className="space-y-3">
            {nearbyObjects.map((object, index) => (
              <GlassCard
                key={index}
                intensity="medium"
                glow
                className="p-4 hover:bg-white/18 cursor-pointer transition-all duration-300 group"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-xl bg-cover bg-center flex-shrink-0"
                    style={{ backgroundImage: `url(${object.image})` }}
                  />
                  <div className="flex-1">
                    <h4 className="text-white font-medium mb-1 group-hover:text-emerald-300 transition-colors">
                      {object.name}
                    </h4>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-white/60">{object.distance}</span>
                      <span className={`
                        px-2 py-0.5 rounded-full text-xs font-medium
                        ${object.rarity === 'Rare' ? 'bg-amber-500/20 text-amber-300' : ''}
                        ${object.rarity === 'Uncommon' ? 'bg-blue-500/20 text-blue-300' : ''}
                        ${object.rarity === 'Common' ? 'bg-gray-500/20 text-gray-300' : ''}
                      `}>
                        {object.rarity}
                      </span>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Navigation className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Floating AR Camera Button */}
        <div className="fixed bottom-8 right-8">
          <button className="group relative w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full shadow-2xl shadow-emerald-500/40 hover:scale-110 transition-all duration-300 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Camera className="w-7 h-7 text-white relative z-10" />
            <div className="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping" />
          </button>
        </div>
      </div>
    </div>
  );
}
