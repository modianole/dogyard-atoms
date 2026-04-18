import { Home, Compass, BookmarkIcon, User, Settings, X } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: string;
  onNavigate: (view: string) => void;
}

const menuItems = [
  { icon: Home, label: 'Home', id: 'home' },
  { icon: Compass, label: 'Explore', id: 'explore' },
  { icon: BookmarkIcon, label: 'Saved Gardens', id: 'saved' },
  { icon: User, label: 'Profile', id: 'profile' },
  { icon: Settings, label: 'Settings', id: 'settings' },
];

export function Sidebar({ isOpen, onClose, currentView, onNavigate }: SidebarProps) {
  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed top-0 left-0 h-full w-80 z-50"
      >
        <GlassCard intensity="strong" className="h-full rounded-none rounded-r-[2rem] p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-2xl font-bold text-white">Luminous Bark</h2>
              <p className="text-sm text-white/60 mt-1">AR Garden Discovery</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/10 transition-colors"
            >
              <X className="w-6 h-6 text-white/80" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    onClose();
                  }}
                  className={`
                    w-full flex items-center gap-4 px-5 py-4 rounded-xl
                    transition-all duration-300
                    ${isActive
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Info */}
          <div className="absolute bottom-8 left-8 right-8">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600" />
                <div>
                  <p className="text-white font-medium">Garden Explorer</p>
                  <p className="text-white/50 text-sm">Level 12</p>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </>
  );
}
