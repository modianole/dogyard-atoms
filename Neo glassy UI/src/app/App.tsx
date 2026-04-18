import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { HomeView } from './components/HomeView';
import { ExploreView } from './components/ExploreView';
import { LoadingScreen } from './components/LoadingScreen';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [isLoading, setIsLoading] = useState(true);

  const backgroundImages = {
    home: 'https://images.unsplash.com/photo-1684329986410-8c0771cd57ac?w=1600&q=80',
    explore: 'https://images.unsplash.com/photo-1684329986410-8c0771cd57ac?w=1600&q=80',
  };

  const currentBg = backgroundImages[currentView as keyof typeof backgroundImages] || backgroundImages.home;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0a0f0d]">
      {/* Loading Screen */}
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center transition-all duration-1000"
          style={{ backgroundImage: `url(${currentBg})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 via-black/50 to-teal-900/40" />
        </div>
      </div>

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentView={currentView}
        onNavigate={setCurrentView}
      />

      {/* Main Content */}
      <div className="relative z-10 h-full overflow-y-auto">
        {/* Top Bar */}
        <div className="fixed top-0 left-0 right-0 z-30 p-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-3 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-xl hover:bg-white/15 transition-all duration-300"
            >
              <Menu className="w-6 h-6 text-white" />
            </button>

            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-full">
                <span className="text-white/90 text-sm font-medium">Tel Aviv</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 border-2 border-white/30" />
            </div>
          </div>
        </div>

        {/* View Content */}
        <div className="pt-24">
          {currentView === 'home' && <HomeView />}
          {currentView === 'explore' && <ExploreView />}
          {currentView !== 'home' && currentView !== 'explore' && (
            <div className="flex items-center justify-center h-[80vh]">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Coming Soon</h2>
                <p className="text-white/60">This view is under development</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ambient Effects */}
      <div className="fixed inset-0 pointer-events-none z-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
    </div>
  );
}