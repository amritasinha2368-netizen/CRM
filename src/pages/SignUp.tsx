import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/store';
import { GOGLogo } from '@/components/ui/GOGLogo';
import toast from 'react-hot-toast';

export default function SignUp() {
  const navigate = useNavigate();
  const setCurrentUser = useAppStore((s) => s.setCurrentUser);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [role, setRole] = useState<'super_admin' | 'crm_admin' | 'team_leader' | 'counsellor' | 'admissions'>('super_admin');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    toast.success('Registration successful! Welcome to QuantNexa AI CRM.');
    setTimeout(() => {
      const newUser = {
        id: `U${Date.now()}`,
        name: fullName || 'New Administrator',
        email: email || 'admin@quantnexa.ai',
        role: role,
        avatar: '',
        active: true,
        phone: mobile || '+91 98765 43210',
      };
      setCurrentUser(newUser);
      navigate('/dashboard', { replace: true });
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1A1A] p-4 text-white">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-6 rounded-2xl border border-[#3E3E3E] bg-[#282828] p-8 shadow-2xl"
      >
        {/* Header Logo */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <GOGLogo size="lg" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Create Your Account</h1>
            <p className="text-xs text-slate-400 font-medium">Join QuantNexa AI CRM Lead & Admissions Platform</p>
          </div>
        </div>

        <form onSubmit={handleSignUpSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Rajesh Kumar"
                className="w-full rounded-lg border border-[#3E3E3E] bg-[#1A1A1A] pl-9 pr-3 py-2 text-xs font-medium text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@organization.com"
                className="w-full rounded-lg border border-[#3E3E3E] bg-[#1A1A1A] pl-9 pr-3 py-2 text-xs font-medium text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="+91 98765..."
                  className="w-full rounded-lg border border-[#3E3E3E] bg-[#1A1A1A] pl-9 pr-3 py-2 text-xs font-medium text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Role Type</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full rounded-lg border border-[#3E3E3E] bg-[#1A1A1A] px-3 py-2 text-xs font-medium text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="super_admin">Super Admin</option>
                <option value="crm_admin">CRM Admin</option>
                <option value="team_leader">Team Leader</option>
                <option value="counsellor">Counsellor</option>
                <option value="admissions">Admissions</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create strong password"
                className="w-full rounded-lg border border-[#3E3E3E] bg-[#1A1A1A] pl-9 pr-3 py-2 text-xs font-medium text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 py-2.5 text-xs font-bold text-white transition-all shadow-lg cursor-pointer"
          >
            <span>Register & Open Portal</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-sky-400 hover:underline">
            Sign In Here
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
