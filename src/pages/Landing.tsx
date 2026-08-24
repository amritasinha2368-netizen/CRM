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
      {/* Base gradient - Golden & Black Luxury Obsidian */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F17] via-[#0F172A] to-[#020617]" />

      {/* Animated wave layers */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="none">
        <defs>
          <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#d4af37" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#d4af37" stopOpacity="0.25" />
          </linearGradient>
          <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ca8a04" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ca8a04" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="wave3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#854d0e" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#fef08a" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#854d0e" stopOpacity="0.15" />
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

      {/* Floating light orbs — Golden tones */}
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -20, 0], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute top-[20%] right-[15%] w-64 h-64 rounded-full blur-[80px]"
        style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.3) 0%, transparent 70%)' }}
      />
      <motion.div
        animate={{ x: [0, -30, 0], y: [0, 25, 0], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 18, repeat: Infinity }}
        className="absolute top-[40%] left-[10%] w-48 h-48 rounded-full blur-[60px]"
        style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.25) 0%, transparent 70%)' }}
      />

      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(212,175,55,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.3) 1px, transparent 1px)',
        backgroundSize: '80px 80px',
      }} />
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

      {/* Left edge — fade into golden content */}
      <div className="absolute top-0 left-0 bottom-0 w-64 z-20 pointer-events-none bg-gradient-to-r from-[#0B0F17] via-[#0B0F17]/80 to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-24 z-20 pointer-events-none bg-gradient-to-b from-[#0B0F17] to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-24 z-20 pointer-events-none bg-gradient-to-t from-[#0B0F17] to-transparent" />
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
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
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
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#0B0F17]/90 backdrop-blur-xl border-b-2 border-[#D4AF37]/40 shadow-xl'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Discover GoG Button (High Visibility Pill) */}
        <div className="hidden md:flex items-center gap-1">
          <motion.a
            href="https://www.geeksofgurukul.com/"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setHoveredItem('discover')}
            onMouseLeave={() => setHoveredItem(null)}
            whileHover={{ y: -2 }}
            className="relative px-5 py-2.5 text-xs font-black text-[#FBBF24] bg-[#161E2E]/90 backdrop-blur-md rounded-full border-2 border-[#D4AF37]/50 shadow-lg hover:bg-[#D4AF37] hover:text-slate-950 transition-all duration-300 cursor-pointer"
          >
            <span className="flex items-center gap-1.5 font-black drop-shadow-sm">
              Discover GoG
              <motion.span
                className="inline-block"
                animate={hoveredItem === 'discover' ? { x: [0, 3, 0] } : {}}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              >
                ↗
              </motion.span>
            </span>
          </motion.a>
        </div>

        {/* Auth buttons */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/login')}
            className="rounded-full border-2 border-[#D4AF37]/50 bg-[#161E2E]/90 backdrop-blur-md px-6 py-2.5 text-[13px] font-black text-white transition-all hover:bg-[#D4AF37] hover:text-slate-950 shadow-sm cursor-pointer"
          >
            Login
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 4px 20px rgba(212, 175, 55, 0.4)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/login')}
            className="rounded-full bg-gradient-to-r from-[#D4AF37] via-[#FBBF24] to-[#D4AF37] hover:brightness-110 px-6 py-2.5 text-[13px] font-black text-slate-950 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
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
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3"
          >
            <div className="h-px w-8 bg-[#D4AF37]" />
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#FBBF24] animate-pulse" />
              <span className="text-xs font-black uppercase tracking-widest text-[#FBBF24]">
                Geeksofgurukul Applications
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-6xl sm:text-7xl lg:text-8xl font-black text-white leading-[0.95] tracking-tight mt-3"
          >
            Academy
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FEF08A] via-[#D4AF37] to-[#F59E0B]">
              Lead CRM
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-base text-amber-100/90 font-medium leading-relaxed max-w-md"
          >
            An intelligent platform for tracking every student<br />enquiry, automating counsellor follow-ups, managing admissions pipeline and converting leads into enrollments — all from a single dashboard.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.03, boxShadow: '0 8px 30px rgba(212, 175, 55, 0.4)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/login')}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#FBBF24] to-[#D4AF37] hover:brightness-110 px-8 py-3.5 text-sm font-black text-slate-950 shadow-xl shadow-amber-500/30 transition-all cursor-pointer"
          >
            Get started
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-[#D4AF37]/30 bg-[#0B0F17]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#FBBF24]/70">
              Design, develop and run any
            </p>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#FBBF24]/70">
              business software you need.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="text-[10px] font-black uppercase tracking-widest text-amber-300 hover:text-white transition-colors"
            >
              Scroll to explore
            </motion.button>
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-[#FBBF24]" />
              <div className="h-1.5 w-1.5 rounded-full bg-[#FBBF24]/40" />
              <div className="h-1.5 w-1.5 rounded-full bg-[#FBBF24]/20" />
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
    <Section className="py-8 border-y-2 border-[#D4AF37]/40 bg-[#0F172A] backdrop-blur-sm overflow-hidden">
      <div className="flex items-center gap-12 animate-[scroll_30s_linear_infinite] whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="flex items-center gap-3 text-xs font-black text-[#FBBF24] uppercase tracking-wider">
            <div className="h-2 w-2 rounded-full bg-[#D4AF37]" />
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
    <Section className="py-24 px-8 bg-[#0B0F17]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-black uppercase tracking-widest text-[#FBBF24] px-4 py-1.5 bg-[#161E2E] rounded-full border border-[#D4AF37]/50 shadow-md">
            The Admission Challenge
          </span>
          <h2 className="mt-6 text-3xl sm:text-4xl font-black text-white">
            Why Traditional Spreadsheets Fail Your Academy
          </h2>
          <p className="mt-3 text-sm font-bold text-slate-400">
            Education admissions are fast-paced. Relying on manual tracking leads to lost revenue and missed student enrollments.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                className="p-6 rounded-2xl bg-[#161E2E] border border-[#D4AF37]/30 hover:border-[#FBBF24] shadow-xl transition-all"
              >
                <div className="h-12 w-12 rounded-xl bg-[#0F172A] border border-[#D4AF37]/40 text-[#FBBF24] flex items-center justify-center font-bold">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-black text-white">{p.title}</h3>
                <p className="mt-2 text-xs font-bold text-slate-400 leading-relaxed">{p.desc}</p>
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
    <div className="min-h-screen bg-[#0B0F17] text-white font-sans">
      <Navbar />
      <Hero />
      <CapabilitiesStrip />
      <ProblemSection />
    </div>
  );
}
