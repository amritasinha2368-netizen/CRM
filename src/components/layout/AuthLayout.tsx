import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GOGLogo } from '@/components/ui/GOGLogo';

export function AuthLayout() {
  return (
    <div className="relative min-h-screen w-full overflow-y-auto bg-[#1A1A1A] text-white flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Subtle LeetCode orange ambient glow */}
      <div className="absolute top-1/3 left-1/3 h-96 w-96 rounded-full bg-[#FFA116]/5 blur-[120px] pointer-events-none" />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255, 161, 22, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 161, 22, 0.2) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <div className="relative z-10 w-full max-w-lg space-y-6 my-auto">
        {/* Logo Header Container */}
        <div className="flex justify-center py-2">
          <GOGLogo size="xl" />
        </div>

        {/* Auth Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}
