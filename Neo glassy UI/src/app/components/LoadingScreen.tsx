import { motion } from 'motion/react';
import { Leaf } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.8, delay: 2 }}
      onAnimationComplete={onComplete}
      className="fixed inset-0 bg-gradient-to-br from-emerald-900 via-black to-teal-900 z-[100] flex items-center justify-center"
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-8"
        >
          <div className="relative">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
              <Leaf className="w-12 h-12 text-white" />
            </div>
            <div className="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl font-bold text-white mb-3"
        >
          Luminous Bark
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-white/60 text-lg"
        >
          Initializing AR Experience...
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.2, delay: 1 }}
          className="w-64 h-1 mx-auto mt-8 bg-white/10 rounded-full overflow-hidden"
        >
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.5, delay: 1.2 }}
            className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
