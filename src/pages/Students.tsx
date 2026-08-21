import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, Search, Filter, User, BookOpen, Calendar, CreditCard,
  MessageCircle, Eye, ChevronRight, X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';
import { leads, courses, batches, payments, applications, activities } from '@/data/mockData';
import { formatCurrency, formatDate, getRelativeTime, getInitials } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import StatusBadge from '@/components/ui/StatusBadge';
import EmptyState from '@/components/ui/EmptyState';
import { SearchInput } from '@/components/ui/SearchInput';
import toast from 'react-hot-toast';

export default function Students() {
  const { currentUser } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [filterCourse, setFilterCourse] = useState('all');

  const students = useMemo(() => leads.filter(l => l.status === 'enrolled'), []);

  const filteredStudents = useMemo(() => {
    let result = [...students];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q));
    }
    if (filterCourse !== 'all') {
      result = result.filter(s => s.courseId === filterCourse);
    }
    return result;
  }, [students, searchQuery, filterCourse]);

  const studentLead = selectedStudent ? leads.find(l => l.id === selectedStudent) : null;
  const studentCourse = studentLead ? courses.find(c => c.id === studentLead.courseId) : null;
  const studentBatch = studentLead?.batchId ? batches.find(b => b.id === studentLead.batchId) : null;
  const studentPayment = payments.find(p => p.leadId === selectedStudent);
  const studentActivities = activities.filter(a => a.leadId === selectedStudent).slice(0, 10);

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Students</h1>
          <p className="text-sm text-surface-500">{students.length} enrolled students across all courses</p>
        </div>
      </motion.div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <SearchInput placeholder="Search students..." value={searchQuery} onChange={setSearchQuery} className="w-full sm:w-72" />
        <select value={filterCourse} onChange={e => setFilterCourse(e.target.value)} className="rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm focus:border-primary-300 focus:outline-none">
          <option value="all">All Courses</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="flex gap-6">
        <div className={cn('flex-1 space-y-3', selectedStudent && 'lg:w-[calc(100%-380px)]')}>
          {filteredStudents.length === 0 ? (
            <EmptyState icon={GraduationCap} title="No students found" description="No enrolled students match your search criteria" />
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {filteredStudents.map((student, idx) => {
                const course = courses.find(c => c.id === student.courseId);
                const payment = payments.find(p => p.leadId === student.id);
                const batch = student.batchId ? batches.find(b => b.id === student.batchId) : null;

                return (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: idx * 0.03 }}
                    onClick={() => setSelectedStudent(student.id)}
                    className={cn(
                      'group cursor-pointer rounded-xl border border-surface-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary-200',
                      selectedStudent === student.id && 'ring-2 ring-primary-500 border-primary-300'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-600">
                        {getInitials(student.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold text-surface-900 truncate">{student.name}</h3>
                        <p className="text-xs text-surface-500 truncate">{course?.name}</p>
                        <div className="mt-2 flex items-center gap-2 text-xs text-surface-400">
                          {batch && <span>{batch.name}</span>}
                          <span>Enrolled {getRelativeTime(student.updatedAt)}</span>
                        </div>
                      </div>
                      {payment && (
                        <Badge variant={payment.status === 'paid' ? 'success' : payment.status === 'overdue' ? 'danger' : 'warning'}>
                          {payment.status}
                        </Badge>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        <AnimatePresence>
          {selectedStudent && studentLead && (
            <motion.div
              initial={{ opacity: 0, x: 20, width: 0 }}
              animate={{ opacity: 1, x: 0, width: 380 }}
              exit={{ opacity: 0, x: 20, width: 0 }}
              transition={{ duration: 0.3 }}
              className="hidden lg:block shrink-0"
            >
              <div className="sticky top-6 rounded-xl border border-surface-200 bg-white shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-lg font-bold text-white">
                        {getInitials(studentLead.name)}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-white">{studentLead.name}</h3>
                        <p className="text-xs text-primary-100">{studentLead.email}</p>
                      </div>
                    </div>
                    <button onClick={() => setSelectedStudent(null)} className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 transition-colors">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-surface-50 p-3">
                      <p className="text-xs text-surface-500">Course</p>
                      <p className="text-sm font-medium text-surface-900">{studentCourse?.name || '-'}</p>
                    </div>
                    <div className="rounded-lg bg-surface-50 p-3">
                      <p className="text-xs text-surface-500">Batch</p>
                      <p className="text-sm font-medium text-surface-900">{studentBatch?.name || '-'}</p>
                    </div>
                    <div className="rounded-lg bg-surface-50 p-3">
                      <p className="text-xs text-surface-500">Fee</p>
                      <p className="text-sm font-medium text-surface-900">{formatCurrency(studentCourse?.fee || 0)}</p>
                    </div>
                    <div className="rounded-lg bg-surface-50 p-3">
                      <p className="text-xs text-surface-500">Payment</p>
                      <StatusBadge status={studentPayment?.status || 'pending'} type="payment" />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold uppercase text-surface-500 mb-2">Recent Activity</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {studentActivities.length === 0 ? (
                        <p className="text-xs text-surface-400">No recent activity</p>
                      ) : (
                        studentActivities.map(act => (
                          <div key={act.id} className="flex items-start gap-2 text-xs">
                            <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400" />
                            <div>
                              <p className="text-surface-700">{act.description}</p>
                              <p className="text-surface-400">{getRelativeTime(act.timestamp)}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button onClick={() => toast('Profile view coming soon')} className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-surface-200 px-3 py-2 text-xs font-medium text-surface-700 hover:bg-surface-50 transition-colors">
                      <Eye className="h-3.5 w-3.5" /> View Profile
                    </button>
                    <button onClick={() => toast('Message sent')} className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-surface-200 px-3 py-2 text-xs font-medium text-surface-700 hover:bg-surface-50 transition-colors">
                      <MessageCircle className="h-3.5 w-3.5" /> Message
                    </button>
                    <button onClick={() => toast('Payments view coming soon')} className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-surface-200 px-3 py-2 text-xs font-medium text-surface-700 hover:bg-surface-50 transition-colors">
                      <CreditCard className="h-3.5 w-3.5" /> Payments
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
