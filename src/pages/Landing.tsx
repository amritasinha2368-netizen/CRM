import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, Phone, Eye, Clock, AlertTriangle, Copy, PhoneOff, Megaphone,
} from 'lucide-react';

// ─── FLOWING WAVE BACKGROUND ──────────────────────────────
function FlowingWaves() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base gradient - LeetCode Dark #1A1A1A */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A] via-[#282828] to-[#121212]" />

      {/* Animated wave layers */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="none">
        <defs>
          <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffa116" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#e08800" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ffa116" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffb800" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#ffa116" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#ffb800" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="wave3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#b86a00" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#fcc252" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#b86a00" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Wave 1 - back */}
        <motion.path
          d="M0,500 C200,420 400,550 600,480 C800,410 1000,520 1200,460 C1300,430 1400,480 1440,470 L1440,900 L0,900 Z"
          fill="url(#wave1)"
          animate={{
            d: [
              "M0,500 C200,420 400,550 600,480 C800,410 1000,520 1200,460 C1300,430 1400,480 1440,470 L1440,900 L0,900 Z",
              "M0,480 C200,530 400,440 600,500 C800,560 1000,430 1200,490 C1300,520 1400,450 1440,480 L1440,900 L0,900 Z",
              "M0,500 C200,420 400,550 600,480 C800,410 1000,520 1200,460 C1300,430 1400,480 1440,470 L1440,900 L0,900 Z",
            ]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Wave 2 - mid */}
        <motion.path
          d="M0,550 C300,480 500,580 700,520 C900,460 1100,560 1300,510 C1380,490 1420,520 1440,510 L1440,900 L0,900 Z"
          fill="url(#wave2)"
          animate={{
            d: [
              "M0,550 C300,480 500,580 700,520 C900,460 1100,560 1300,510 C1380,490 1420,520 1440,510 L1440,900 L0,900 Z",
              "M0,530 C300,590 500,470 700,540 C900,610 1100,480 1300,540 C1380,570 1420,500 1440,530 L1440,900 L0,900 Z",
              "M0,550 C300,480 500,580 700,520 C900,460 1100,560 1300,510 C1380,490 1420,520 1440,510 L1440,900 L0,900 Z",
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Wave 3 - front */}
        <motion.path
          d="M0,600 C250,540 450,620 650,570 C850,520 1050,610 1250,560 C1350,540 1410,570 1440,560 L1440,900 L0,900 Z"
          fill="url(#wave3)"
          animate={{
            d: [
              "M0,600 C250,540 450,620 650,570 C850,520 1050,610 1250,560 C1350,540 1410,570 1440,560 L1440,900 L0,900 Z",
              "M0,580 C250,640 450,550 650,600 C850,650 1050,540 1250,590 C1350,620 1410,560 1440,580 L1440,900 L0,900 Z",
              "M0,600 C250,540 450,620 650,570 C850,520 1050,610 1250,560 C1350,540 1410,570 1440,560 L1440,900 L0,900 Z",
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>

      {/* Floating ambient glow orbs */}
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -15, 0], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute top-[20%] right-[15%] w-64 h-64 rounded-full blur-[80px]"
        style={{ background: 'radial-gradient(circle, rgba(255,161,22,0.25) 0%, transparent 70%)' }}
      />
    </div>
  );
}

// ─── CRM LOOPING VIDEO ────────────────────────────
function CRMVideo() {
  return (
    <div className="absolute inset-0 hidden lg:block overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-80"
      >
        <source src="/gog-video.mp4" type="video/mp4" />
      </video>

      {/* Fade edges */}
      <div className="absolute top-0 left-0 bottom-0 w-64 z-20 pointer-events-none bg-gradient-to-r from-[#1A1A1A] via-[#1A1A1A]/80 to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-24 z-20 pointer-events-none bg-gradient-to-b from-[#1A1A1A] to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-24 z-20 pointer-events-none bg-gradient-to-t from-[#1A1A1A] to-transparent" />
    </div>
  );
}

// ─── SECTION WRAPPER ──────────────────────────────────────
function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────
function Navbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#282828]/95 backdrop-blur-md border-b border-[#3E3E3E] shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Discover GoG Button */}
        <div className="hidden md:flex items-center gap-1">
          <motion.a
            href="https://www.geeksofgurukul.com/"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setHoveredItem('discover')}
            onMouseLeave={() => setHoveredItem(null)}
            whileHover={{ y: -1 }}
            className="relative px-4 py-2 text-xs font-bold text-[#FFA116] bg-[#282828] border border-[#3E3E3E] rounded-lg shadow-sm hover:bg-[#383838] hover:text-white transition-all duration-200 cursor-pointer"
          >
            <span className="flex items-center gap-1.5 font-bold">
              Discover GoG
              <motion.span
                className="inline-block"
                animate={hoveredItem === 'discover' ? { x: [0, 3, 0] } : {}}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              >
                ↗
              </motion.span>
            </span>
          </motion.a>
        </div>

        {/* Auth buttons */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/login')}
            className="rounded-lg border border-[#3E3E3E] bg-[#282828] px-4 py-2 text-xs font-bold text-white transition-all hover:bg-[#383838] shadow-xs cursor-pointer"
          >
            Login
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/login')}
            className="rounded-lg bg-[#FFA116] hover:bg-[#E08800] px-4 py-2 text-xs font-black text-[#1A1A1A] shadow-md transition-all cursor-pointer"
          >
            Sign Up
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}

// ─── HERO ─────────────────────────────────────────────────
function Hero() {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <FlowingWaves />
      <CRMVideo />

      <div className="relative z-10 max-w-7xl mx-auto px-8 py-24 w-full">
        <div className="max-w-xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <div className="h-px w-8 bg-[#FFA116]" />
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#FFA116] animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#FFA116]">
                Geeksofgurukul Applications
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] tracking-tight mt-4"
          >
            Academy
            <br />
            <span className="text-[#FFA116]">
              Lead CRM
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-sm text-slate-300 font-medium leading-relaxed max-w-md"
          >
            An intelligent platform for tracking every student<br />enquiry, automating counsellor follow-ups, managing admissions pipeline and converting leads into enrollments — all from a single dashboard.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/login')}
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#FFA116] hover:bg-[#E08800] px-7 py-3 text-sm font-black text-[#1A1A1A] shadow-lg transition-all cursor-pointer"
          >
            Get started
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-[#3E3E3E] bg-[#1A1A1A]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-8 py-3.5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Design, develop and run any business software you need.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Scroll to explore
            </span>
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-[#FFA116]" />
              <div className="h-1.5 w-1.5 rounded-full bg-slate-600" />
              <div className="h-1.5 w-1.5 rounded-full bg-slate-700" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── PLATFORM CAPABILITIES STRIP ──────────────────────────
function CapabilitiesStrip() {
  const items = ['Lead Capture', 'AI Calling', 'Follow-ups', 'Pipeline', 'Applications', 'Payments', 'Analytics', 'Automations'];
  return (
    <Section className="py-6 border-y border-[#3E3E3E] bg-[#282828] overflow-hidden">
      <div className="flex items-center gap-12 animate-[scroll_30s_linear_infinite] whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="flex items-center gap-3 text-xs font-bold text-[#FFA116] uppercase tracking-wider">
            <div className="h-2 w-2 rounded-full bg-[#FFA116]" />
            {item}
          </span>
        ))}
      </div>
    </Section>
  );
}

// ─── PROBLEM SECTION ──────────────────────────────────────
function ProblemSection() {
  const problems = [
    { icon: Copy, title: 'Duplicate Leads', desc: 'Same student tracked in Excel, WhatsApp, and notes — no single source of truth.' },
    { icon: PhoneOff, title: 'Missed Follow-ups', desc: 'Promising leads go cold because no one called back on time.' },
    { icon: AlertTriangle, title: 'Lost Enquiries', desc: 'Walk-ins and referral leads disappear without a trace.' },
    { icon: Eye, title: 'Poor Visibility', desc: 'Management has no idea which counsellor is performing or which lead is stuck.' },
    { icon: Clock, title: 'Manual Tracking', desc: 'Admission fees, documents, and installments tracked in spreadsheets.' },
    { icon: Megaphone, title: 'No Campaign Data', desc: 'Spending on ads but have no idea which campaign brought which lead.' },
  ];

  return (
    <Section className="py-20 px-8 bg-[#1A1A1A]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FFA116] px-3.5 py-1 bg-[#282828] rounded-md border border-[#3E3E3E]">
            The Admission Challenge
          </span>
          <h2 className="mt-5 text-3xl font-extrabold text-white">
            Why Traditional Spreadsheets Fail Your Academy
          </h2>
          <p className="mt-2 text-xs font-medium text-slate-400">
            Education admissions are fast-paced. Relying on manual tracking leads to lost revenue and missed student enrollments.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {problems.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={i}
                whileHover={{ y: -3 }}
                className="p-6 rounded-xl bg-[#282828] border border-[#3E3E3E] hover:border-[#FFA116] shadow-lg transition-all"
              >
                <div className="h-10 w-10 rounded-lg bg-[#303030] border border-[#3E3E3E] text-[#FFA116] flex items-center justify-center font-bold">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-bold text-white">{p.title}</h3>
                <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">{p.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

// ─── MAIN LANDING COMPONENT ──────────────────────────────
export default function Landing() {
  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white font-sans">
      <Navbar />
      <Hero />
      <CapabilitiesStrip />
      <ProblemSection />
    </div>
  );
}
