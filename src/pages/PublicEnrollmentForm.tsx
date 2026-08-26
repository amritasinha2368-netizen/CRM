import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, User, Phone, Mail, MapPin,
  CheckCircle2, Sparkles, ShieldCheck, ArrowRight, Check,
  Globe, Megaphone, UserCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';
import { courses, centers } from '@/data/mockData';
import type { Lead, LeadSource } from '@/types';
import toast from 'react-hot-toast';

const SOURCE_LABELS: Record<string, { label: string; icon: any; color: string }> = {
  instagram: { label: 'Instagram Campaign', icon: Sparkles, color: 'from-fuchsia-600 to-pink-600' },
  meta_ads: { label: 'Meta Lead Ads', icon: Megaphone, color: 'from-blue-600 to-indigo-600' },
  google_ads: { label: 'Google Search Ads', icon: Globe, color: 'from-amber-500 to-orange-600' },
  referral: { label: 'Student Referral', icon: UserCheck, color: 'from-emerald-600 to-teal-600' },
  website: { label: 'Official Website', icon: GraduationCap, color: 'from-sky-600 to-blue-600' },
  landing_page: { label: 'Summer Admissions Page', icon: Sparkles, color: 'from-purple-600 to-indigo-600' },
};

export default function PublicEnrollmentForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addLead, addNotification } = useAppStore();

  const detectedSource = (searchParams.get('source') || 'instagram') as LeadSource;
  const campaignName = searchParams.get('campaign') || 'Summer 2026 Batch';

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitted, setSubmitted] = useState(false);
  const [generatedLeadId, setGeneratedLeadId] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [qualification, setQualification] = useState('Pursuing Graduation');
  const [courseId, setCourseId] = useState(courses[0]?.id || 'c1');
  const [centerId, setCenterId] = useState(centers[0]?.id || 'center_delhi_01');
  const [source, setSource] = useState<LeadSource>(detectedSource);
  const [preferredTime, setPreferredTime] = useState('Immediate / Morning');
  const [comments, setComments] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  useEffect(() => {
    if (searchParams.get('source')) {
      setSource(searchParams.get('source') as LeadSource);
    }
  }, [searchParams]);

  const sourceMeta = SOURCE_LABELS[source] || SOURCE_LABELS['website'];
  const SourceIcon = sourceMeta.icon;

  const handleSendOtp = () => {
    if (!phone || phone.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    setOtpSent(true);
    setOtpCode('8942');
    toast.success('Verification OTP sent: 8942');
  };

  const handleVerifyOtp = () => {
    if (otpCode === '8942') {
      setOtpVerified(true);
      toast.success('Mobile number verified successfully!');
    } else {
      toast.error('Invalid OTP. Please enter 8942');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !phone || !email) {
      toast.error('Please fill in all required contact details');
      return;
    }

    // Calculate AI Lead Score
    let score = 50;
    if (otpVerified) score += 20;
    if (source === 'referral') score += 20;
    if (source === 'meta_ads' || source === 'instagram') score += 15;
    if (qualification === 'Graduate' || qualification === 'Working Professional') score += 10;
    if (comments) score += 5;

    const leadId = `QN-LEAD-${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedLeadId(leadId);

    const newLead: Lead = {
      id: leadId,
      name,
      phone,
      email,
      courseId,
      centerId,
      source,
      status: 'new',
      leadScore: Math.min(score, 98),
      assignedToId: 'u4', // Priya Verma (Counsellor)
      notes: `Public Enrollment Form Submission (${sourceMeta.label}). Campaign: ${campaignName}. Qualification: ${qualification}. Preferred Time: ${preferredTime}. ${comments ? `Notes: ${comments}` : ''}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addLead(newLead);

    // Alert Super Admin
    addNotification({
      title: '🎉 New Lead Enrolled via Public Form!',
      message: `${name} (${phone}) enrolled for ${courses.find(c => c.id === courseId)?.name || 'Course'} via ${sourceMeta.label}.`,
      type: 'lead',
    });

    setSubmitted(true);
    toast.success('Enrollment form submitted successfully!');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 mx-auto w-full max-w-4xl flex items-center justify-between py-4 border-b border-slate-800">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="bg-slate-800 border border-slate-700 p-2 rounded-xl flex items-center justify-center">
            <GraduationCap className="h-6 w-6 text-sky-400" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white tracking-tight">QuantNexa AI</h1>
            <p className="text-[10px] text-sky-400 font-bold uppercase tracking-wider">Admissions & Career Portal 2026</p>
          </div>
        </div>

        <div className={cn('hidden sm:flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-bold bg-gradient-to-r text-white shadow-md', sourceMeta.color)}>
          <SourceIcon className="h-3.5 w-3.5" />
          <span>{sourceMeta.label}</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 mx-auto w-full max-w-2xl my-8">
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form-card"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6"
            >
              {/* Form Title */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/15 border border-sky-500/30 px-3 py-0.5 text-xs font-extrabold text-sky-300">
                    <Sparkles className="h-3 w-3 text-sky-400" />
                    Direct Course Enrollment
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Enroll in QuantNexa AI Programs
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-400">
                  Fill out your details to reserve your seat and get assigned a dedicated Career Counsellor.
                </p>
              </div>

              {/* Stepper Progress */}
              <div className="flex items-center justify-between border-y border-slate-700/70 py-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className={cn(
                    'flex items-center gap-2 text-xs font-bold transition-colors',
                    step === 1 ? 'text-sky-400' : 'text-slate-400 hover:text-slate-200'
                  )}
                >
                  <span className={cn('h-6 w-6 rounded-full flex items-center justify-center text-[10px]', step === 1 ? 'bg-sky-500 text-slate-900 font-black' : 'bg-slate-700 text-slate-300')}>1</span>
                  Contact Info
                </button>
                <div className="h-0.5 flex-1 mx-3 bg-slate-700" />
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className={cn(
                    'flex items-center gap-2 text-xs font-bold transition-colors',
                    step === 2 ? 'text-sky-400' : 'text-slate-400 hover:text-slate-200'
                  )}
                >
                  <span className={cn('h-6 w-6 rounded-full flex items-center justify-center text-[10px]', step === 2 ? 'bg-sky-500 text-slate-900 font-black' : 'bg-slate-700 text-slate-300')}>2</span>
                  Course & Center
                </button>
                <div className="h-0.5 flex-1 mx-3 bg-slate-700" />
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className={cn(
                    'flex items-center gap-2 text-xs font-bold transition-colors',
                    step === 3 ? 'text-sky-400' : 'text-slate-400 hover:text-slate-200'
                  )}
                >
                  <span className={cn('h-6 w-6 rounded-full flex items-center justify-center text-[10px]', step === 3 ? 'bg-sky-500 text-slate-900 font-black' : 'bg-slate-700 text-slate-300')}>3</span>
                  Verification & Submit
                </button>
              </div>

              {/* Form Element */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {step === 1 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-300 mb-1.5">
                        Full Name <span className="text-rose-400">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full rounded-xl border border-slate-700 bg-slate-900/80 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-slate-300 mb-1.5">
                        Mobile Phone Number <span className="text-rose-400">*</span>
                      </label>
                      <div className="relative flex gap-2">
                        <div className="relative flex-1">
                          <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+91 9876543210"
                            className="w-full rounded-xl border border-slate-700 bg-slate-900/80 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 font-mono"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          className="px-3.5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-bold text-slate-200 transition-colors shrink-0"
                        >
                          {otpSent ? 'Resend OTP' : 'Send OTP'}
                        </button>
                      </div>

                      {otpSent && !otpVerified && (
                        <div className="mt-2.5 flex items-center gap-2">
                          <input
                            type="text"
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value)}
                            placeholder="Enter 8942"
                            className="w-32 rounded-xl border border-sky-500/50 bg-slate-900 px-3 py-1.5 text-xs text-white text-center font-mono focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={handleVerifyOtp}
                            className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-xs font-bold text-white transition-colors"
                          >
                            Verify OTP
                          </button>
                        </div>
                      )}

                      {otpVerified && (
                        <p className="mt-1.5 text-xs text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Mobile Number Verified via OTP
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-slate-300 mb-1.5">
                        Email Address <span className="text-rose-400">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="rahul.sharma@example.com"
                          className="w-full rounded-xl border border-slate-700 bg-slate-900/80 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-slate-300 mb-1.5">
                        Highest Qualification
                      </label>
                      <select
                        value={qualification}
                        onChange={(e) => setQualification(e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-sm text-white focus:border-sky-500 focus:outline-none"
                      >
                        <option value="12th Pass">12th Pass / High School</option>
                        <option value="Diploma Holder">Diploma Holder</option>
                        <option value="Pursuing Graduation">Pursuing Graduation (B.Tech / BCA / B.Sc)</option>
                        <option value="Graduate">Graduate (Degree Completed)</option>
                        <option value="Working Professional">Working Professional</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (!name || !phone || !email) {
                          toast.error('Please enter Name, Phone and Email to proceed');
                          return;
                        }
                        setStep(2);
                      }}
                      className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-500 py-3 text-sm font-bold text-white shadow-lg transition-all"
                    >
                      <span>Continue to Course Selection</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-300 mb-1.5">
                        Select Preferred Program / Course <span className="text-rose-400">*</span>
                      </label>
                      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                        {courses.map((c) => (
                          <div
                            key={c.id}
                            onClick={() => setCourseId(c.id)}
                            className={cn(
                              'cursor-pointer rounded-xl border p-3 transition-all flex flex-col justify-between',
                              courseId === c.id
                                ? 'border-sky-500 bg-sky-500/10 ring-1 ring-sky-500'
                                : 'border-slate-700 bg-slate-900/60 hover:border-slate-600'
                            )}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-black text-white">{c.name}</span>
                                {courseId === c.id && <CheckCircle2 className="h-4 w-4 text-sky-400" />}
                              </div>
                              <p className="text-[10px] text-slate-400 line-clamp-2">{c.description}</p>
                            </div>
                            <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-sky-300">
                              <span>Duration: {c.duration}</span>
                              <span className="font-bold">₹{c.price.toLocaleString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-slate-300 mb-1.5">
                        Preferred Campus / Study Mode <span className="text-rose-400">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                        <select
                          value={centerId}
                          onChange={(e) => setCenterId(e.target.value)}
                          className="w-full rounded-xl border border-slate-700 bg-slate-900/80 pl-10 pr-4 py-2.5 text-sm text-white focus:border-sky-500 focus:outline-none"
                        >
                          {centers.map((cnt) => (
                            <option key={cnt.id} value={cnt.id}>
                              {cnt.name} ({cnt.city})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-slate-300 mb-1.5">
                        How did you find QuantNexa AI?
                      </label>
                      <select
                        value={source}
                        onChange={(e) => setSource(e.target.value as LeadSource)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-sm text-white focus:border-sky-500 focus:outline-none"
                      >
                        <option value="instagram">Instagram Campaign / Reel</option>
                        <option value="meta_ads">Facebook / Meta Ads</option>
                        <option value="google_ads">Google Search / YouTube Ads</option>
                        <option value="referral">Friend / Alumnus Referral</option>
                        <option value="website">Official Website</option>
                        <option value="event">Campus Seminar / Workshop</option>
                      </select>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex-1 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 py-3 text-sm font-bold text-slate-300 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="flex-2 flex items-center justify-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-500 py-3 text-sm font-bold text-white shadow-lg transition-all"
                      >
                        <span>Review & Submit</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-4 space-y-3">
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-sky-400">
                        Summary of Your Application
                      </h3>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-slate-400 block">Applicant Name:</span>
                          <span className="font-bold text-white">{name}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Mobile Phone:</span>
                          <span className="font-bold text-white">{phone}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Email ID:</span>
                          <span className="font-bold text-white">{email}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Qualification:</span>
                          <span className="font-bold text-white">{qualification}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Selected Course:</span>
                          <span className="font-bold text-sky-300">
                            {courses.find((c) => c.id === courseId)?.name}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Campus Center:</span>
                          <span className="font-bold text-white">
                            {centers.find((cnt) => cnt.id === centerId)?.name}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-slate-300 mb-1.5">
                        Preferred Counselling Time Slot
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {['Immediate / Morning', 'Afternoon (12 PM - 4 PM)', 'Evening (4 PM - 8 PM)', 'Weekend Special Slot'].map((t) => (
                          <div
                            key={t}
                            onClick={() => setPreferredTime(t)}
                            className={cn(
                              'cursor-pointer rounded-xl border px-3 py-2 text-xs font-bold transition-all flex items-center justify-between',
                              preferredTime === t
                                ? 'border-sky-500 bg-sky-500/15 text-sky-300'
                                : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600'
                            )}
                          >
                            <span>{t}</span>
                            {preferredTime === t && <Check className="h-3.5 w-3.5 text-sky-400" />}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-slate-300 mb-1.5">
                        Any Specific Questions or Special Requirements? (Optional)
                      </label>
                      <textarea
                        rows={2}
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        placeholder="e.g. Looking for weekend batch, asking about scholarship discounts..."
                        className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="flex-1 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 py-3 text-sm font-bold text-slate-300 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="flex-2 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-3 text-sm font-black text-white shadow-xl transition-all"
                      >
                        <ShieldCheck className="h-5 w-5" />
                        <span>Submit Enrollment Form</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </form>
            </motion.div>
          ) : (
            /* Celebration / Success Screen */
            <motion.div
              key="success-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-800/95 border border-emerald-500/50 rounded-2xl p-8 shadow-2xl text-center space-y-6"
            >
              <div className="h-16 w-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg">
                <CheckCircle2 className="h-10 w-10" />
              </div>

              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3.5 py-1 text-xs font-black text-emerald-300 mb-2">
                  <Sparkles className="h-3.5 w-3.5" /> Enrollment Application Received
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  Congratulations, {name}! 🎉
                </h2>
                <p className="mt-2 text-sm text-slate-300 max-w-md mx-auto">
                  Your application has been registered in the QuantNexa AI CRM Portal. A Senior Career Counsellor will reach out to you shortly.
                </p>
              </div>

              <div className="bg-slate-900/90 border border-slate-700 rounded-xl p-4 text-left space-y-2 text-xs">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Reference Lead ID:</span>
                  <span className="font-mono font-bold text-sky-400 text-sm">{generatedLeadId}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Course Selected:</span>
                  <span className="font-bold text-white">{courses.find(c => c.id === courseId)?.name}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Assigned Counsellor:</span>
                  <span className="font-bold text-emerald-400">Priya Verma (Senior Counsellor)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Lead Source Channel:</span>
                  <span className="font-bold text-slate-200">{sourceMeta.label}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <div className="rounded-xl border border-sky-500/30 bg-sky-500/10 p-3.5 text-xs text-sky-200 flex items-center justify-center gap-2">
                  <Phone className="h-4 w-4 text-sky-400 animate-pulse" />
                  <span>Please keep your phone active. Counsellor <b>Priya Verma</b> will call you shortly.</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setStep(1);
                    setName('');
                    setPhone('');
                    setEmail('');
                    setComments('');
                    setOtpVerified(false);
                    setOtpSent(false);
                  }}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 py-3 text-xs font-bold text-slate-300 transition-colors"
                >
                  Submit Another Student Application
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mx-auto w-full max-w-4xl text-center py-4 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>&copy; 2026 QuantNexa AI Solutions Pvt. Ltd. All rights reserved.</p>
        <div className="flex items-center gap-4 text-slate-400 font-medium">
          <span>Privacy Policy</span>
          <span>Terms of Admissions</span>
          <span>Helpdesk</span>
        </div>
      </footer>
    </div>
  );
}
