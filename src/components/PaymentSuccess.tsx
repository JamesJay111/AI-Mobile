import { Check } from 'lucide-react';
import { motion } from 'motion/react';

interface PaymentSuccessProps {
  isOpen: boolean;
  onBackToHome: () => void;
  amount: number;
}

export function PaymentSuccess({ isOpen, onBackToHome, amount }: PaymentSuccessProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#050505] z-50 flex flex-col items-center justify-center px-6">
      {/* Animated Confetti Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: i % 3 === 0 ? '#00E585' : i % 3 === 1 ? '#FFFFFF' : '#A1A1AA',
              left: `${Math.random() * 100}%`,
              top: '-10%',
            }}
            animate={{
              y: ['0vh', '120vh'],
              x: [0, (Math.random() - 0.5) * 100],
              rotate: [0, 360],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Success Icon with Glow */}
      <motion.div
        className="relative mb-8"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 15,
          duration: 0.6,
        }}
      >
        {/* Glowing Background */}
        <div className="absolute inset-0 w-32 h-32 -left-4 -top-4 bg-[#00E585] rounded-full opacity-30 blur-3xl"></div>
        
        {/* Badge Shape with Check */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
            {/* Badge Shape */}
            <path
              d="M48 4C48 4 38 8 28 8C18 8 8 4 8 4C8 4 4 14 4 24C4 34 4 48 4 48C4 48 8 62 18 72C28 82 48 92 48 92C48 92 68 82 78 72C88 62 92 48 92 48C92 48 92 34 92 24C92 14 88 4 88 4C88 4 78 8 68 8C58 8 48 4 48 4Z"
              fill="url(#gradient)"
            />
            <defs>
              <linearGradient id="gradient" x1="48" y1="4" x2="48" y2="92">
                <stop offset="0%" stopColor="#00E585" />
                <stop offset="100%" stopColor="#00b86b" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Check Icon */}
          <motion.div
            className="absolute"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
          >
            <Check className="w-12 h-12 text-black" strokeWidth={4} />
          </motion.div>
        </div>
      </motion.div>

      {/* Title */}
      <motion.h1
        className="text-[32px] font-bold text-white mb-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        Payment Successful
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="text-[15px] text-[#A1A1AA] mb-12 text-center max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        Successfully Paid ${amount}
      </motion.p>

      {/* Description */}
      <motion.p
        className="text-[14px] text-[#A1A1AA] leading-relaxed text-center max-w-sm mb-12 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        Your order is complete, and we're already working for you. If you have any questions, feel free to reach out to us—our support team is here to help!
      </motion.p>

      {/* Back to Home Button */}
      <motion.button
        onClick={onBackToHome}
        className="w-full max-w-sm h-14 bg-[#00E585] text-black rounded-full font-semibold text-[17px] hover:bg-[#00d078] transition-colors shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        whileTap={{ scale: 0.98 }}
      >
        Back to Home
      </motion.button>
    </div>
  );
}