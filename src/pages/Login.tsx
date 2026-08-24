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
    <div className="space-y-6 bg-[#282828] p-8 rounded-2xl border border-[#3E3E3E] shadow-2xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Welcome Back
        </h2>
        <p className="mt-1.5 text-xs font-bold text-[#FFA116]">
          QuantNexa AI CRM &bull; Lead & Admissions Intelligence Portal
        </p>
      </motion.div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        {/* Full-width Stacked Email and Password */}
        <div className="space-y-4">
          {/* Email */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="space-y-1.5"
          >
            <label className="text-xs font-bold text-[#FFA116] block">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#FFA116] z-10 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
                placeholder="you@example.com"
                className={cn(
                  'w-full rounded-lg bg-[#1A1A1A] border py-2.5 pl-11 pr-4 text-xs font-bold text-white placeholder-slate-500 outline-none transition-all duration-200',
                  'focus:border-[#FFA116] focus:bg-[#303030] focus:ring-1 focus:ring-[#FFA116]',
                  errors.email ? 'border-[#FF2D55]' : 'border-[#3E3E3E] hover:border-[#555555]',
                )}
              />
            </div>
            <AnimatePresence>
              {errors.email && (
                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-[11px] font-bold text-[#FF2D55]">
                  {errors.email}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Password */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-1.5"
          >
            <label className="text-xs font-bold text-[#FFA116] block">Password</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#FFA116] z-10 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })); }}
                placeholder="Enter password"
                className={cn(
                  'w-full rounded-lg bg-[#1A1A1A] border py-2.5 pl-11 pr-10 text-xs font-bold text-white placeholder-slate-500 outline-none transition-all duration-200',
                  'focus:border-[#FFA116] focus:bg-[#303030] focus:ring-1 focus:ring-[#FFA116]',
                  errors.password ? 'border-[#FF2D55]' : 'border-[#3E3E3E] hover:border-[#555555]',
                )}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors z-10">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <AnimatePresence>
              {errors.password && (
                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-[11px] font-bold text-[#FF2D55]">
                  {errors.password}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Forgot password + Login button row */}
        <div className="flex items-center gap-4 pt-2">
          <button type="button" className="text-xs text-[#FFA116] font-bold hover:underline transition-colors whitespace-nowrap">
            Forgot Password?
          </button>

          {/* Login button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-black text-[#1A1A1A] transition-all duration-200 cursor-pointer',
              'bg-[#FFA116] hover:bg-[#E08800]',
              'disabled:opacity-60 disabled:cursor-not-allowed',
            )}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin text-[#1A1A1A]" /> : 'Login to Portal'}
          </motion.button>
        </div>
      </motion.form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#3E3E3E]" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-3 bg-[#282828] text-[10px] font-bold text-[#FFA116] uppercase tracking-wider">or login as demo role</span>
        </div>
      </div>

      {/* Demo Role Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-2 gap-2"
      >
        {demoRoles.map((demo, i) => (
          <motion.button
            key={demo.role}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 + i * 0.03 }}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleDemoLogin(demo)}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-[#3E3E3E] bg-[#303030] px-3 py-2 text-left transition-all hover:bg-[#383838] hover:border-[#FFA116] disabled:opacity-50 cursor-pointer"
          >
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[#FFA116] text-[9px] font-black text-[#1A1A1A]">
              {demo.role.split('_').map(w => w[0]).join('').toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-white truncate">{demo.label}</p>
              <p className="text-[9px] text-[#FFA116] font-medium truncate">{demo.password}</p>
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex items-center justify-between text-[11px] text-slate-400 font-medium pt-1"
      >
        <span>
          Don't have an account?{' '}
          <button className="font-bold text-[#FFA116] hover:underline transition-colors">
            Sign Up
          </button>
        </span>
        <button className="hover:text-white transition-colors font-bold">
          Contact Support
        </button>
      </motion.div>
    </div>
  );
}
