import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, CheckCircle2, Users, TrendingUp, GraduationCap, IndianRupee,
  Phone, CalendarClock, Target, Sparkles, Shield, Brain, Workflow,
  BarChart3, FileText, CreditCard, MessageSquare, ChevronRight, Star,
  Globe, Megaphone, Eye, Clock, AlertTriangle, Copy, PhoneOff, Layers,
  UserCheck, BookOpen, Send, Mail, Database, Cpu, Activity, Zap,
} from 'lucide-react';
import { GOGLogo, GOGLogoMark } from '@/components/ui/GOGLogo';

// ─── FLOWING WAVE BACKGROUND ──────────────────────────────
function FlowingWaves() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base gradient - dark purple matching video */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a1030] via-[#15102a] to-[#0f0a20]" />

      {/* Animated wave layers */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="none">
        <defs>
          <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6a3093" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#7b4fb5" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#6a3093" stopOpacity="0.25" />
          </linearGradient>
          <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#5a2d82" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#9b59b6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#5a2d82" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="wave3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4a2070" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#8e44ad" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#4a2070" stopOpacity="0.15" />
          </linearGradient>
          <filter id="blur1"><feGaussianBlur stdDeviation="2" /></filter>
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

      {/* Floating light orbs — purple tones */}
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -20, 0], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute top-[20%] right-[15%] w-64 h-64 rounded-full blur-[80px]"
        style={{ background: 'radial-gradient(circle, rgba(147,97,213,0.3) 0%, transparent 70%)' }}
      />
      <motion.div
        animate={{ x: [0, -30, 0], y: [0, 25, 0], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 18, repeat: Infinity }}
        className="absolute top-[40%] left-[10%] w-48 h-48 rounded-full blur-[60px]"
        style={{ background: 'radial-gradient(circle, rgba(128,90,213,0.25) 0%, transparent 70%)' }}
      />

      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(147,97,213,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(147,97,213,0.3) 1px, transparent 1px)',
        backgroundSize: '80px 80px',
      }} />
    </div>
  );
}

// ─── CRM LOOPING VIDEO (right half, full bleed) ────────────
function CRMVideo() {
  return (
    <div className="absolute inset-0 hidden lg:block overflow-hidden">
      {/* Full screen video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/gog-video.mp4" type="video/mp4" />
      </video>

      {/* Left edge — simple fade into content */}
      <div className="absolute top-0 left-0 bottom-0 w-64 z-20 pointer-events-none bg-gradient-to-r from-[#1a1030] via-[#1a1030]/80 to-transparent" />

      {/* Top fade */}
      <div className="absolute top-0 left-0 right-0 h-24 z-20 pointer-events-none bg-gradient-to-b from-[#1a1030] to-transparent" />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 z-20 pointer-events-none bg-gradient-to-t from-[#1a1030] to-transparent" />
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
          ? 'bg-[#0a0615]/90 backdrop-blur-xl border-b border-purple-800/30 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1">
          <motion.a
            href="https://www.geeksofgurukul.com/"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setHoveredItem('discover')}
            onMouseLeave={() => setHoveredItem(null)}
            whileHover={{ y: -2 }}
            className="discover-cta relative px-4 py-2 text-[13px] font-semibold text-purple-100/90 rounded-lg cursor-pointer backdrop-blur-sm transition-all duration-300 hover:text-white hover:bg-white/[0.06]"
            style={{
              background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(59,130,246,0.06))',
              border: '1px solid transparent',
              backgroundImage: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(59,130,246,0.06)), linear-gradient(135deg, rgba(139,92,246,0.4), rgba(59,130,246,0.3))',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
              boxShadow: '0 0 12px rgba(139,92,246,0.15), 0 0 24px rgba(59,130,246,0.08)',
            }}
          >
            <span className="flex items-center gap-1.5">
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
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/login')}
            className="rounded-full border border-purple-500/30 bg-transparent px-5 py-2 text-[13px] font-semibold text-purple-300 transition-all hover:bg-purple-500/10"
          >
            Login
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 4px 20px rgba(156, 39, 176, 0.3)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/login')}
            className="rounded-full bg-purple-600 px-5 py-2 text-[13px] font-semibold text-white shadow-lg shadow-purple-500/20 transition-all"
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

      <div className="relative z-10 max-w-7xl mx-auto px-8 py-20 w-full">
        {/* Content — positioned to overlap video area */}
        <div className="max-w-xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3"
          >
            <div className="h-px w-8 bg-purple-400/40" />
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-widest text-purple-300/60">
                Geeksofgurukul Applications
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-6xl sm:text-7xl lg:text-8xl font-thin text-white/90 leading-[0.95] tracking-tight"
          >
            Academy
            <br />
            Lead CRM
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-base text-purple-200/50 leading-relaxed max-w-md"
          >
            An intelligent platform for tracking every student<br />enquiry, automating counsellor follow-ups, managing admissions pipeline and converting leads into enrollments — all from a single dashboard.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.03, boxShadow: '0 8px 30px rgba(156, 39, 176, 0.2)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/login')}
            className="mt-8 inline-flex items-center gap-2 rounded-full border-2 border-purple-400/30 bg-white/10 backdrop-blur-sm px-7 py-3 text-sm font-semibold text-white/90 transition-all hover:bg-white/20 hover:border-purple-400/50"
          >
            Get started
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-purple-200/30">
              Design, develop and run any
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-purple-200/30">
              business software you need.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="text-[10px] font-bold uppercase tracking-widest text-purple-200/30 hover:text-purple-200/60 transition-colors"
            >
              Scroll to explore
            </motion.button>
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-purple-400/30" />
              <div className="h-1.5 w-1.5 rounded-full bg-purple-400/20" />
              <div className="h-1.5 w-1.5 rounded-full bg-purple-400/20" />
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
    <Section className="py-8 border-y border-purple-800/30 bg-[#0a0615]/80 backdrop-blur-sm overflow-hidden">
      <div className="flex items-center gap-12 animate-[scroll_30s_linear_infinite] whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="flex items-center gap-3 text-sm font-medium text-purple-200/40">
            <div className="h-1.5 w-1.5 rounded-full bg-purple-400/40" />
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
    <Section className="py-28 bg-[#0d0820]/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-300/60">The Problem</span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-thin text-white/80">
            Your academy is losing leads <span className="font-semibold">every single day.</span>
          </h2>
          <p className="mt-4 text-purple-200/40">Most education businesses manage enquiries through disconnected tools.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {problems.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6, boxShadow: '0 12px 32px rgba(156,39,176,0.15)' }}
              className="rounded-2xl border border-purple-700/30 bg-[#150e2a]/80 backdrop-blur-sm p-6 transition-all"
            >
              <div className="inline-flex rounded-xl bg-purple-500/10 p-3 mb-4">
                <p.icon className="h-5 w-5 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white/80">{p.title}</h3>
              <p className="mt-2 text-sm text-purple-200/40 leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ─── SOLUTION SECTION ──────────────────────────────────────
function SolutionSection() {
  return (
    <Section className="py-28 bg-gradient-to-b from-[#0d0820]/80 to-[#120a25]/80">
      <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-purple-300/60">The Solution</span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-thin text-white/80">
            One platform to manage <span className="font-semibold">every student journey.</span>
          </h2>
          <p className="mt-4 text-purple-200/40 leading-relaxed">Academy CRM centralizes all your leads, calls, follow-ups, applications, documents and payments into a single intelligent platform.</p>

          <div className="mt-8 space-y-4">
            {[
              { icon: Database, title: 'Centralized Lead Hub', desc: 'All leads from every source in one place' },
              { icon: Brain, title: 'AI Call Intelligence', desc: 'Automatic call scoring, sentiment analysis and next action' },
              { icon: Workflow, title: 'Smart Automations', desc: 'Auto-assign, auto-follow-up, auto-remind' },
              { icon: BarChart3, title: 'Real-time Analytics', desc: 'Campaign ROI, counsellor performance, conversion rates' },
            ].map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-start gap-4 group">
                <div className="shrink-0 rounded-xl bg-purple-50/80 p-2.5 group-hover:bg-purple-100/80 transition-colors">
                  <f.icon className="h-5 w-5 text-purple-400/60" />
                </div>
                <div>
                  <h4 className="font-semibold text-white/80">{f.title}</h4>
                  <p className="text-sm text-purple-200/40">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
          <div className="rounded-3xl border border-purple-700/30 bg-[#150e2a]/80 backdrop-blur-sm p-8 shadow-xl shadow-purple-900/20">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 rounded-xl border-2 border-red-900/30 bg-red-900/10 p-4 text-center">
                <p className="text-xs font-bold text-red-400/80 mb-2">Before</p>
                <div className="space-y-1.5 text-[11px] text-red-400/60">
                  <p>Excel sheets</p><p>WhatsApp groups</p><p>Paper notes</p><p>Phone logs</p>
                </div>
              </div>
              <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <ArrowRight className="h-6 w-6 text-purple-400/60" />
              </motion.div>
              <div className="flex-1 rounded-xl border-2 border-purple-700/30 bg-purple-900/10 p-4 text-center">
                <p className="text-xs font-bold text-purple-400/80 mb-2">After</p>
                <div className="space-y-1.5 text-[11px] text-purple-400/60 font-medium">
                  <p>Unified CRM</p><p>Auto follow-ups</p><p>AI insights</p><p>Real-time reports</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-purple-900/15 p-4 border border-purple-700/20">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center"><CheckCircle2 className="h-5 w-5 text-purple-400/60" /></div>
                <div><p className="text-sm font-semibold text-white/80">Lead Converted!</p><p className="text-xs text-purple-200/40">Aarav Mehta → Full Stack Dev — ₹85,000</p></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

// ─── CRM WORKFLOW ──────────────────────────────────────────
function CRMWorkflow() {
  const steps = ['Lead Capture', 'Assignment', 'Calling', 'Counselling', 'Follow-up', 'Visit', 'Application', 'Documents', 'Payment', 'Admission'];
  return (
    <Section className="py-28 bg-[#0d0820]">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-300/60">CRM Workflow</span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-thin text-white/80">
            From enquiry to enrollment, <span className="font-semibold">automated.</span>
          </h2>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {steps.map((step, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -4 }}
              className="flex items-center gap-2 rounded-full border border-purple-700/30 bg-[#150e2a]/80 backdrop-blur-sm px-5 py-2.5 text-sm font-medium text-purple-200/60 transition-all hover:border-purple-500/50 hover:bg-[#1a1030]"
            >
              <span className="h-6 w-6 rounded-full bg-purple-500/10 flex items-center justify-center text-[10px] font-bold text-purple-400/60">{i + 1}</span>
              {step}
              {i < steps.length - 1 && <ChevronRight className="h-3 w-3 text-purple-300/40 ml-1" />}
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ─── ROLE SECTION ──────────────────────────────────────────
function RoleSection() {
  const roles = [
    { icon: Shield, title: 'Super Admin', desc: 'Complete system control and enterprise analytics.', color: 'bg-violet-50 text-violet-500' },
    { icon: Megaphone, title: 'Marketing Admin', desc: 'Campaign management and lead source tracking.', color: 'bg-blue-50 text-blue-500' },
    { icon: Users, title: 'Team Leader', desc: 'Team performance and counsellor leaderboard.', color: 'bg-amber-50 text-amber-500' },
    { icon: Phone, title: 'Counsellor', desc: 'Action-oriented daily lead management.', color: 'bg-emerald-50 text-emerald-500' },
    { icon: GraduationCap, title: 'Admissions', desc: 'Applications, documents and payments.', color: 'bg-rose-50 text-rose-500' },
  ];
  return (
    <Section className="py-28 bg-gradient-to-b from-[#120a25]/80 to-[#0d0820]/80">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-300/60">Role-Based Platform</span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-thin text-white/80">
            Every role gets <span className="font-semibold">its own experience.</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-5 gap-4">
          {roles.map((role, i) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -8, boxShadow: '0 16px 40px rgba(156,39,176,0.1)' }}
              className="rounded-2xl border border-purple-700/30 bg-[#150e2a]/80 backdrop-blur-sm p-6 text-center transition-all"
            >
              <div className={`inline-flex rounded-xl ${role.color} p-3 mb-4`}>
                <role.icon className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-white/80 mb-1">{role.title}</h3>
              <p className="text-xs text-purple-200/40">{role.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ─── AI CALL SECTION ───────────────────────────────────────
function AICallSection() {
  return (
    <Section className="py-28 bg-gradient-to-br from-purple-900/90 to-purple-800/90 text-white overflow-hidden relative">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-16 items-center relative z-10">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-purple-300/60">AI-Powered Calling</span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-thin">Every call becomes <span className="font-semibold">an insight.</span></h2>
          <p className="mt-4 text-purple-200/50 leading-relaxed">Our AI listens to every counselling call and provides automatic scoring, sentiment analysis, objection tracking, and next best action recommendations.</p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              { label: 'Call Score', value: '87/100', icon: BarChart3 },
              { label: 'Sentiment', value: 'Positive', icon: Activity },
              { label: 'Intent', value: 'High Purchase', icon: Target },
              { label: 'Next Action', value: 'Send Brochure', icon: Send },
            ].map((item) => (
              <motion.div key={item.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-xl bg-white/5 border border-white/10 p-4 backdrop-blur-sm">
                <item.icon className="h-4 w-4 text-purple-300/60 mb-2" />
                <p className="text-xs text-purple-200/40">{item.label}</p>
                <p className="text-sm font-semibold">{item.value}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-purple-400/10 flex items-center justify-center"><Brain className="h-5 w-5 text-purple-300/60" /></div>
              <div><p className="text-sm font-semibold">AI Call Analysis</p><p className="text-xs text-purple-200/40">Call with Aarav Mehta — 14:32</p></div>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Greeting', score: 92 },
                { label: 'Discovery', score: 88 },
                { label: 'Explanation', score: 85 },
                { label: 'Objection Handling', score: 78 },
                { label: 'Closing', score: 90 },
              ].map((s) => (
                <div key={s.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-purple-200/50">{s.label}</span>
                    <span className="font-semibold text-purple-300/80">{s.score}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <motion.div initial={{ width: 0 }} whileInView={{ width: `${s.score}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.5 }} className="h-full rounded-full bg-gradient-to-r from-purple-400 to-purple-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

// ─── FEATURES GRID ────────────────────────────────────────
function FeaturesGrid() {
  const features = [
    { icon: Users, title: 'Smart Lead Capture', desc: 'Import from Google Ads, Meta, WhatsApp, website forms and walk-ins.' },
    { icon: Brain, title: 'AI Call Intelligence', desc: 'Automatic scoring, sentiment analysis and next best action.' },
    { icon: Workflow, title: 'Smart Automations', desc: 'Auto-assign leads, schedule follow-ups, send reminders.' },
    { icon: BarChart3, title: 'Real-time Analytics', desc: 'Campaign ROI, conversion rates, revenue trends.' },
    { icon: MessageSquare, title: 'Omnichannel Communication', desc: 'WhatsApp, SMS, Email, Phone — all from one platform.' },
    { icon: FileText, title: 'Document Management', desc: 'Upload, verify, and track all student documents digitally.' },
    { icon: CreditCard, title: 'Payment Tracking', desc: 'Installments, scholarships, discounts and receipt generation.' },
    { icon: Shield, title: 'Role-based Access', desc: 'Different dashboards for every role with granular permissions.' },
  ];
  return (
    <Section className="py-28 bg-[#0d0820]">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-300/60">Features</span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-thin text-white/80">
            Everything you need, <span className="font-semibold">nothing you don't.</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -6, boxShadow: '0 12px 32px rgba(147,97,213,0.1)' }}
              className="rounded-2xl border border-purple-700/30 bg-[#150e2a]/80 backdrop-blur-sm p-6 transition-all group"
            >
              <div className="inline-flex rounded-xl bg-purple-500/10 p-3 mb-4 group-hover:bg-purple-500/20 transition-colors">
                <f.icon className="h-5 w-5 text-purple-400/60" />
              </div>
              <h3 className="font-semibold text-white/80 mb-2">{f.title}</h3>
              <p className="text-sm text-purple-200/40 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ─── FINAL CTA ────────────────────────────────────────────
function FinalCTA() {
  const navigate = useNavigate();
  return (
    <Section className="py-28 bg-gradient-to-b from-[#0d0820] to-[#0a0615] relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #333 1px, transparent 0)', backgroundSize: '30px 30px' }} />
      <div className="max-w-3xl mx-auto px-8 text-center relative z-10">
        <h2 className="text-4xl sm:text-5xl font-thin text-white/80">Ready to transform your academy?</h2>
        <p className="mt-4 text-lg text-purple-200/40">Join 500+ education institutions already using Academy CRM.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 8px 30px rgba(156, 39, 176, 0.2)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 rounded-full bg-purple-600 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition-all"
          >
            Get Started Free
            <ArrowRight className="h-4 w-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 rounded-full border-2 border-purple-200/50 bg-white/40 backdrop-blur-sm px-8 py-4 text-sm font-semibold text-purple-800 transition-all hover:bg-white/60"
          >
            Book a Demo
          </motion.button>
        </div>
      </div>
    </Section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────
function Footer() {
  return (
    <footer className="py-12 bg-[#0a0615] border-t border-purple-800/30">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div><GOGLogo size="sm" showText={false} /><p className="mt-3 text-sm text-purple-300/40">AI-powered education CRM.</p></div>
          <div><h4 className="text-sm font-semibold text-white/80 mb-3">Product</h4><div className="space-y-2 text-sm text-purple-300/40"><p>Features</p><p>Pricing</p><p>Integrations</p></div></div>
          <div><h4 className="text-sm font-semibold text-white/80 mb-3">Company</h4><div className="space-y-2 text-sm text-purple-300/40"><p>About</p><p>Blog</p><p>Careers</p></div></div>
          <div><h4 className="text-sm font-semibold text-white/80 mb-3">Legal</h4><div className="space-y-2 text-sm text-purple-300/40"><p>Privacy</p><p>Terms</p><p>Security</p></div></div>
        </div>
        <div className="border-t border-purple-800/30 pt-6 text-center text-xs text-purple-400/30">
          © 2026 Geeksofgurukul. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

// ─── MAIN ──────────────────────────────────────────────────
export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1030] to-[#0f0a20]">
      <Navbar />
      <Hero />
      <CapabilitiesStrip />
      <ProblemSection />
      <SolutionSection />
      <CRMWorkflow />
      <RoleSection />
      <AICallSection />
      <FeaturesGrid />
      <FinalCTA />
      <Footer />
    </div>
  );
}
