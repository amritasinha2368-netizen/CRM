import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';
import { users } from '@/data/mockData';

const demoRoles = [
  { role: 'super_admin' as const, label: 'Super Admin', email: 'rajesh@gogacademy.com', password: 'admin123' },
  { role: 'crm_admin' as const, label: 'CRM Admin', email: 'priya@gogacademy.com', password: 'crm123' },
  { role: 'team_leader' as const, label: 'Team Leader', email: 'amit@gogacademy.com', password: 'team123' },
  { role: 'counsellor' as const, label: 'Counsellor', email: 'vikram@gogacademy.com', password: 'counsell123' },
  { role: 'admissions' as const, label: 'Admissions', email: 'kavita@gogacademy.com', password: 'admit123' },
];

export default function Login() {
  const navigate = useNavigate();
  const setCurrentUser = useAppStore((s) => s.setCurrentUser);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const errs: typeof errors = {};
    if (!email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Invalid email address';
    if (!password.trim()) errs.password = 'Password is required';
    else if (password.length < 3) errs.password = 'Min 3 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const user = users.find((u) => u.email === email);
    const demoMatch = demoRoles.find((d) => d.email === email && d.password === password);
    setTimeout(() => {
      if (user && demoMatch) {
        setCurrentUser(user);
        navigate('/dashboard', { replace: true });
      } else if (user) {
        setErrors({ password: 'Incorrect password' });
        setLoading(false);
      } else {
        setErrors({ email: 'No account found with this email' });
        setLoading(false);
      }
    }, 800);
  };

  const handleDemoLogin = (demo: typeof demoRoles[number]) => {
    const user = users.find((u) => u.email === demo.email);
    if (!user) return;
    setEmail(demo.email);
    setPassword(demo.password);
    setLoading(true);
    setTimeout(() => {
      setCurrentUser(user);
      navigate('/dashboard', { replace: true });
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Glow backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-purple-600/8 blur-[120px] pointer-events-none" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="text-3xl font-bold text-white tracking-tight">
          Welcome Back
        </h2>
        <p className="mt-2 text-sm text-white/35">
          Enter your credentials to access the CRM dashboard.
        </p>
      </motion.div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        {/* Email + Password side by side */}
        <div className="grid grid-cols-2 gap-4">
          {/* Email */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-1.5"
          >
            <label className="text-xs font-medium text-white/40">Email</label>
            <div className="relative group">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-400/40 group-focus-within:text-purple-400 transition-colors" />
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
                placeholder="you@example.com"
                className={cn(
                  'w-full rounded-xl bg-white/[0.05] border py-3 pl-10 pr-3 text-sm text-white placeholder-white/25 outline-none transition-all duration-300',
                  'focus:border-purple-400/60 focus:bg-white/[0.08] focus:shadow-[0_0_20px_rgba(147,97,213,0.15)]',
                  errors.email ? 'border-red-500/50' : 'border-white/10 hover:border-white/15',
                )}
              />
            </div>
            <AnimatePresence>
              {errors.email && (
                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-[11px] text-red-400">
                  {errors.email}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Password */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
            className="space-y-1.5"
          >
            <label className="text-xs font-medium text-white/40">Password</label>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-400/40 group-focus-within:text-purple-400 transition-colors" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })); }}
                placeholder="Enter password"
                className={cn(
                  'w-full rounded-xl bg-white/[0.05] border py-3 pl-10 pr-10 text-sm text-white placeholder-white/25 outline-none transition-all duration-300',
                  'focus:border-purple-400/60 focus:bg-white/[0.08] focus:shadow-[0_0_20px_rgba(147,97,213,0.15)]',
                  errors.password ? 'border-red-500/50' : 'border-white/10 hover:border-white/15',
                )}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <AnimatePresence>
              {errors.password && (
                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-[11px] text-red-400">
                  {errors.password}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Forgot password + Login button row */}
        <div className="flex items-center gap-4">
          <button type="button" className="text-xs text-purple-400/60 hover:text-purple-300 transition-colors whitespace-nowrap">
            Forgot Password?
          </button>

          {/* Login button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(147,97,213,0.3)' }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white transition-all duration-300',
              'bg-gradient-to-r from-purple-500 via-purple-600 to-purple-500 hover:from-purple-400 hover:via-purple-500 hover:to-purple-400',
              'disabled:opacity-60 disabled:cursor-not-allowed',
              'shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40',
            )}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Login'}
          </motion.button>
        </div>
      </motion.form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/8" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-3 text-[10px] text-white/25 uppercase tracking-wider">or login as demo</span>
        </div>
      </div>

      {/* Demo Role Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="grid grid-cols-2 gap-2"
      >
        {demoRoles.map((demo, i) => (
          <motion.button
            key={demo.role}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 + i * 0.04, duration: 0.3 }}
            whileHover={{ y: -2, backgroundColor: 'rgba(255,255,255,0.04)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleDemoLogin(demo)}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5 text-left transition-all hover:border-purple-500/20 disabled:opacity-50"
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-[9px] font-bold text-purple-400">
              {demo.role.split('_').map(w => w[0]).join('').toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-white/65 truncate">{demo.label}</p>
              <p className="text-[9px] text-white/20 truncate">{demo.password}</p>
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex items-center justify-between text-[11px] text-white/25 pt-1"
      >
        <span>
          Don't have an account?{' '}
          <button className="font-semibold text-purple-400 hover:text-purple-300 transition-colors">
            Sign Up
          </button>
        </span>
        <button className="hover:text-white/50 transition-colors">
          Contact Support
        </button>
      </motion.div>
    </div>
  );
}
