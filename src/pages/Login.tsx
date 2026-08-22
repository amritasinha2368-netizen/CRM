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
    <div className="space-y-6 bg-white p-8 rounded-3xl border-2 border-[#93C5FD] shadow-2xl">
      {/* Glow backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="text-3xl font-black text-[#0F172A] tracking-tight">
          Welcome Back
        </h2>
        <p className="mt-2 text-xs font-bold text-slate-500">
          Enter your credentials to access the 12th Pass Admissions Suite.
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
            <label className="text-xs font-bold text-slate-600">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2563EB] transition-colors" />
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
                placeholder="you@example.com"
                className={cn(
                  'w-full rounded-xl bg-slate-50 border-2 py-3 pl-10 pr-3 text-xs font-bold text-slate-900 placeholder-slate-400 outline-none transition-all duration-300',
                  'focus:border-[#2563EB] focus:bg-white focus:shadow-[0_0_20px_rgba(37,99,235,0.15)]',
                  errors.email ? 'border-red-500' : 'border-slate-300 hover:border-slate-400',
                )}
              />
            </div>
            <AnimatePresence>
              {errors.email && (
                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-[11px] font-bold text-red-600">
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
            <label className="text-xs font-bold text-slate-600">Password</label>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2563EB] transition-colors" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })); }}
                placeholder="Enter password"
                className={cn(
                  'w-full rounded-xl bg-slate-50 border-2 py-3 pl-10 pr-10 text-xs font-bold text-slate-900 placeholder-slate-400 outline-none transition-all duration-300',
                  'focus:border-[#2563EB] focus:bg-white focus:shadow-[0_0_20px_rgba(37,99,235,0.15)]',
                  errors.password ? 'border-red-500' : 'border-slate-300 hover:border-slate-400',
                )}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <AnimatePresence>
              {errors.password && (
                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-[11px] font-bold text-red-600">
                  {errors.password}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Forgot password + Login button row */}
        <div className="flex items-center gap-4 pt-2">
          <button type="button" className="text-xs text-[#2563EB] font-bold hover:underline transition-colors whitespace-nowrap">
            Forgot Password?
          </button>

          {/* Login button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(37,99,235,0.3)' }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-black text-white transition-all duration-300 cursor-pointer',
              'bg-[#2563EB] hover:bg-[#1D4ED8]',
              'disabled:opacity-60 disabled:cursor-not-allowed',
              'shadow-lg shadow-blue-600/30',
            )}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Login to Portal'}
          </motion.button>
        </div>
      </motion.form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-3 bg-white text-[10px] font-black text-slate-400 uppercase tracking-wider">or login as demo role</span>
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
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleDemoLogin(demo)}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-sky-200 bg-[#E0F2FE]/50 px-3 py-2.5 text-left transition-all hover:bg-sky-100 hover:border-[#93C5FD] disabled:opacity-50 cursor-pointer"
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#2563EB] text-[9px] font-black text-white shadow-xs">
              {demo.role.split('_').map(w => w[0]).join('').toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-black text-[#0F172A] truncate">{demo.label}</p>
              <p className="text-[9px] text-blue-800 font-bold truncate">{demo.password}</p>
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex items-center justify-between text-[11px] text-slate-500 font-bold pt-1"
      >
        <span>
          Don't have an account?{' '}
          <button className="font-extrabold text-[#2563EB] hover:underline transition-colors">
            Sign Up
          </button>
        </span>
        <button className="hover:text-slate-900 transition-colors font-extrabold">
          Contact Support
        </button>
      </motion.div>
    </div>
  );
}
