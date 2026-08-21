import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Clock, Users, IndianRupee, Plus, Edit3, Layers, MapPin
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';
import { courses, batches, centers } from '@/data/mockData';
import { formatCurrency } from '@/lib/utils';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import { SearchInput } from '@/components/ui/SearchInput';
import toast from 'react-hot-toast';
import type { Course, Batch } from '@/types';

export default function Courses() {
  const { currentUser } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCenter, setFilterCenter] = useState('all');
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  const filteredCourses = useMemo(() => {
    let result = [...courses];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
    }
    if (filterCenter !== 'all') {
      result = result.filter(c => c.centerIds.includes(filterCenter));
    }
    return result;
  }, [searchQuery, filterCenter]);

  const getBatchesForCourse = (courseId: string) =>
    batches.filter(b => b.courseId === courseId && (filterCenter === 'all' || b.centerId === filterCenter));

  const getEnrolledForCourse = (courseId: string) =>
    getBatchesForCourse(courseId).reduce((sum, b) => sum + b.enrolled, 0);

  const handleSaveCourse = () => {
    toast.success(editingCourse ? 'Course updated' : 'Course created');
    setShowCourseModal(false);
    setEditingCourse(null);
  };

  const handleSaveBatch = () => {
    toast.success(editingBatch ? 'Batch updated' : 'Batch created');
    setShowBatchModal(false);
    setEditingBatch(null);
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Courses & Batches</h1>
          <p className="text-sm text-surface-500">Manage your courses, batches and schedules</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => { setEditingCourse(null); setShowCourseModal(true); }} className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700">
            <Plus className="h-4 w-4" />
            Add Course
          </button>
          <button onClick={() => { setEditingBatch(null); setShowBatchModal(true); }} className="inline-flex items-center gap-2 rounded-lg border border-surface-200 bg-white px-4 py-2.5 text-sm font-medium text-surface-700 hover:bg-surface-50 transition-colors">
            <Plus className="h-4 w-4" />
            Add Batch
          </button>
        </div>
      </motion.div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <SearchInput placeholder="Search courses..." value={searchQuery} onChange={setSearchQuery} className="w-full sm:w-72" />
        <select value={filterCenter} onChange={e => setFilterCenter(e.target.value)} className="rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm focus:border-primary-300 focus:outline-none">
          <option value="all">All Centers</option>
          {centers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="space-y-6">
        {filteredCourses.map((course, idx) => {
          const courseBatches = getBatchesForCourse(course.id);
          const totalEnrolled = getEnrolledForCourse(course.id);
          const isExpanded = selectedCourseId === course.id;

          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.05 }}
              className="rounded-xl border border-surface-200 bg-white shadow-sm overflow-hidden"
            >
              <div className="p-5 cursor-pointer hover:bg-surface-50/50 transition-colors" onClick={() => setSelectedCourseId(isExpanded ? null : course.id)}>
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-surface-900">{course.name}</h3>
                      {!course.isActive && <Badge variant="danger">Inactive</Badge>}
                    </div>
                    <p className="mt-0.5 text-sm text-surface-500">{course.description}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-surface-400">
                      <span className="flex items-center gap-1"><IndianRupee className="h-3 w-3" />{formatCurrency(course.fee)}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{course.duration}</span>
                      <span className="flex items-center gap-1"><Layers className="h-3 w-3" />{courseBatches.length} batches</span>
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" />{totalEnrolled} enrolled</span>
                    </div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setEditingCourse(course); setShowCourseModal(true); }} className="rounded-lg p-2 text-surface-400 hover:bg-surface-100 hover:text-surface-600 transition-colors">
                    <Edit3 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden border-t border-surface-100"
                  >
                    <div className="p-5 bg-surface-50/30">
                      <h4 className="text-xs font-semibold uppercase text-surface-500 mb-3">Batches</h4>
                      {courseBatches.length === 0 ? (
                        <p className="text-sm text-surface-400">No batches found for this course</p>
                      ) : (
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                          {courseBatches.map(batch => {
                            const center = centers.find(c => c.id === batch.centerId);
                            return (
                              <div key={batch.id} className="rounded-lg border border-surface-200 bg-white p-3">
                                <div className="flex items-center justify-between">
                                  <h5 className="text-sm font-medium text-surface-900">{batch.name}</h5>
                                  <Badge variant={batch.isActive ? 'success' : 'danger'}>{batch.isActive ? 'Active' : 'Inactive'}</Badge>
                                </div>
                                <div className="mt-2 space-y-1 text-xs text-surface-500">
                                  <p className="flex items-center gap-1"><Clock className="h-3 w-3" />{batch.timing}</p>
                                  <p className="flex items-center gap-1"><MapPin className="h-3 w-3" />{center?.name}</p>
                                  <div className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    <div className="flex-1 h-1.5 bg-surface-100 rounded-full overflow-hidden">
                                      <div className="h-full bg-primary-500 rounded-full" style={{ width: `${(batch.enrolled / batch.capacity) * 100}%` }} />
                                    </div>
                                    <span>{batch.enrolled}/{batch.capacity}</span>
                                  </div>
                                </div>
                                <button onClick={(e) => { e.stopPropagation(); setEditingBatch(batch); setShowBatchModal(true); }} className="mt-2 text-xs text-primary-600 hover:text-primary-700 font-medium">
                                  Edit Batch
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
        {filteredCourses.length === 0 && (
          <EmptyState icon={BookOpen} title="No courses found" description="Create your first course to get started" action={
            <button onClick={() => setShowCourseModal(true)} className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors">
              <Plus className="h-4 w-4" /> Add Course
            </button>
          } />
        )}
      </div>

      <Modal open={showCourseModal} onOpenChange={setShowCourseModal} title={editingCourse ? 'Edit Course' : 'Add Course'} size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Course Name</label>
            <input defaultValue={editingCourse?.name} className="w-full rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none" placeholder="e.g. Full Stack Development" />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Description</label>
            <textarea defaultValue={editingCourse?.description} rows={3} className="w-full rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Fee (₹)</label>
              <input type="number" defaultValue={editingCourse?.fee} className="w-full rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Duration</label>
              <input defaultValue={editingCourse?.duration} className="w-full rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none" placeholder="e.g. 6 months" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowCourseModal(false)} className="px-4 py-2 text-sm font-medium text-surface-600 hover:bg-surface-100 rounded-lg transition-colors">Cancel</button>
            <button onClick={handleSaveCourse} className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors">{editingCourse ? 'Update' : 'Create'}</button>
          </div>
        </div>
      </Modal>

      <Modal open={showBatchModal} onOpenChange={setShowBatchModal} title={editingBatch ? 'Edit Batch' : 'Add Batch'} size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Course</label>
            <select defaultValue={editingBatch?.courseId} className="w-full rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none">
              <option value="">Select course</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Batch Name</label>
              <input defaultValue={editingBatch?.name} className="w-full rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Center</label>
              <select defaultValue={editingBatch?.centerId} className="w-full rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none">
                {centers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Timing</label>
              <input defaultValue={editingBatch?.timing} className="w-full rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none" placeholder="e.g. 9:00 AM - 12:00 PM" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Capacity</label>
              <input type="number" defaultValue={editingBatch?.capacity} className="w-full rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowBatchModal(false)} className="px-4 py-2 text-sm font-medium text-surface-600 hover:bg-surface-100 rounded-lg transition-colors">Cancel</button>
            <button onClick={handleSaveBatch} className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors">{editingBatch ? 'Update' : 'Create'}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
