import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { SmoothMouseGlow } from '@/components/ui/MouseGlow';

export function AppLayout() {
  const { sidebarCollapsed, toggleSidebar } = useAppStore();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setMobileMenuOpen(false);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMenuToggle = () => {
    if (isMobile) setMobileMenuOpen(!mobileMenuOpen);
    else toggleSidebar();
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#1A1A1A] text-[#EFF2F6]">
      {/* Subtle LeetCode orange glow effect */}
      <SmoothMouseGlow color="rgba(255, 161, 22, 0.03)" size={600} />

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <Sidebar collapsed={false} isMobile onClose={() => setMobileMenuOpen(false)} />
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNav onMenuToggle={handleMenuToggle} />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="h-full w-full max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
