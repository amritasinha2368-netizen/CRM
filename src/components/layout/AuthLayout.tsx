import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

export function AuthLayout() {
  return (
    <div className="flex min-h-screen bg-[#0a0615]">
      {/* Left: Video */}
      <div className="relative hidden lg:flex w-[55%] items-center justify-center overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/login-bg.mp4" type="video/mp4" />
        </video>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Right edge fade into form */}
        <div className="absolute top-0 right-0 bottom-0 w-40 z-10 pointer-events-none bg-gradient-to-l from-[#0a0615] via-[#0a0615]/60 to-transparent" />

        {/* Top fade */}
        <div className="absolute top-0 left-0 right-0 h-20 z-10 pointer-events-none bg-gradient-to-b from-[#0a0615]/60 to-transparent" />

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 z-10 pointer-events-none bg-gradient-to-t from-[#0a0615]/60 to-transparent" />
      </div>

      {/* Right: Form */}
      <div className="relative flex flex-1 items-center justify-center px-6 py-12">
        {/* Purple orbs */}
        <div className="absolute top-[15%] right-[10%] w-64 h-64 rounded-full blur-[100px] bg-purple-600/8" />
        <div className="absolute bottom-[20%] left-[5%] w-48 h-48 rounded-full blur-[80px] bg-purple-500/6" />

        <motion.div
          initial={{ opacity: 0, x: 30, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-lg"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}
