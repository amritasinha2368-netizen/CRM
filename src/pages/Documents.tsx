import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Upload, Eye, CheckCircle2, XCircle, Clock, AlertTriangle,
  Filter, Grid, List, History, Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';
import { documents, leads } from '@/data/mockData';
import { formatDate, getRelativeTime } from '@/lib/utils';
import StatusBadge from '@/components/ui/StatusBadge';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';
import { SearchInput } from '@/components/ui/SearchInput';
import toast from 'react-hot-toast';
import type { Document } from '@/types';

const docTypeIcons: Record<string, typeof FileText> = {
  'Photo': FileText,
  'ID Proof': FileText,
  'Marksheets': FileText,
  'Certificate': FileText,
};

export default function Documents() {
  const { currentUser } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);
  const [showUploadArea, setShowUploadArea] = useState(false);

  const filteredDocs = useMemo(() => {
    let result = [...documents];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(d => {
        const lead = leads.find(l => l.id === d.leadId);
        return d.name.toLowerCase().includes(q) || lead?.name.toLowerCase().includes(q) || d.type.toLowerCase().includes(q);
      });
    }
    if (filterType !== 'all') {
      result = result.filter(d => d.type === filterType);
    }
    if (filterStatus !== 'all') {
      result = result.filter(d => d.status === filterStatus);
    }
    return result.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  }, [searchQuery, filterType, filterStatus]);

  const docTypes = [...new Set(documents.map(d => d.type))];
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    documents.forEach(d => { counts[d.status] = (counts[d.status] || 0) + 1; });
    return counts;
  }, []);

  const handleApprove = (doc: Document) => {
    toast.success(`Document "${doc.name}" approved`);
    setPreviewDoc(null);
  };
  const handleReject = (doc: Document) => {
    toast.error(`Document "${doc.name}" rejected`);
    setPreviewDoc(null);
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Document Vault</h1>
          <p className="text-sm text-surface-500">Manage and verify student documents</p>
        </div>
        <button onClick={() => setShowUploadArea(!showUploadArea)} className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700">
          <Upload className="h-4 w-4" />
          Upload Document
        </button>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-surface-200 bg-white p-4">
          <p className="text-2xl font-bold text-surface-900">{documents.length}</p>
          <p className="text-xs text-surface-500">Total Documents</p>
        </div>
        <div className="rounded-xl border border-surface-200 bg-white p-4">
          <p className="text-2xl font-bold text-success-600">{statusCounts['approved'] || 0}</p>
          <p className="text-xs text-surface-500">Approved</p>
        </div>
        <div className="rounded-xl border border-surface-200 bg-white p-4">
          <p className="text-2xl font-bold text-warning-600">{statusCounts['pending'] || 0}</p>
          <p className="text-xs text-surface-500">Pending</p>
        </div>
        <div className="rounded-xl border border-surface-200 bg-white p-4">
          <p className="text-2xl font-bold text-surface-400">{statusCounts['missing'] || 0}</p>
          <p className="text-xs text-surface-500">Missing</p>
        </div>
      </div>

      <AnimatePresence>
        {showUploadArea && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border-2 border-dashed border-primary-300 bg-primary-50/30 p-8 text-center">
              <Upload className="h-10 w-10 text-primary-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-surface-700">Drag & drop files here, or click to browse</p>
              <p className="text-xs text-surface-400 mt-1">Supports PDF, JPG, PNG up to 10MB</p>
              <button className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors">
                <Upload className="h-4 w-4" /> Choose Files
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <SearchInput placeholder="Search documents..." value={searchQuery} onChange={setSearchQuery} className="w-full sm:w-72" />
        <select value={filterType} onChange={e => setFilterType(e.target.value)} className="rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm focus:border-primary-300 focus:outline-none">
          <option value="all">All Types</option>
          {docTypes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm focus:border-primary-300 focus:outline-none">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="missing">Missing</option>
        </select>
        <div className="flex rounded-lg border border-surface-200 bg-white p-0.5 ml-auto">
          <button onClick={() => setViewMode('grid')} className={cn('px-3 py-1.5 text-xs font-medium rounded-md transition-colors', viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-surface-500')}>
            <Grid className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => setViewMode('list')} className={cn('px-3 py-1.5 text-xs font-medium rounded-md transition-colors', viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-surface-500')}>
            <List className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {filteredDocs.length === 0 ? (
        <EmptyState icon={FileText} title="No documents found" description="No documents match your filters" />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredDocs.map((doc, idx) => {
            const lead = leads.find(l => l.id === doc.leadId);
            const Icon = docTypeIcons[doc.type] || FileText;

            return (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: idx * 0.02 }}
                className="rounded-xl border border-surface-200 bg-white p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                onClick={() => setPreviewDoc(doc)}
              >
                <div className="flex items-start justify-between">
                  <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', doc.status === 'approved' ? 'bg-success-100' : doc.status === 'pending' ? 'bg-warning-100' : doc.status === 'rejected' ? 'bg-danger-100' : 'bg-surface-100')}>
                    <Icon className={cn('h-5 w-5', doc.status === 'approved' ? 'text-success-600' : doc.status === 'pending' ? 'text-warning-600' : doc.status === 'rejected' ? 'text-danger-600' : 'text-surface-400')} />
                  </div>
                  <StatusBadge status={doc.status} type="document" />
                </div>
                <h3 className="mt-3 text-sm font-medium text-surface-900 truncate">{doc.name}</h3>
                <p className="text-xs text-surface-500">{doc.type}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-surface-400">{lead?.name}</span>
                  <span className="text-[10px] text-surface-400">v{doc.version}</span>
                </div>
                <p className="mt-1 text-[10px] text-surface-400">{getRelativeTime(doc.uploadedAt)}</p>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-surface-200 bg-white">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead>
              <tr className="border-b border-surface-200 bg-surface-50">
                <th className="px-4 py-3 text-xs font-semibold uppercase text-surface-500">Document</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase text-surface-500">Type</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase text-surface-500">Student</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase text-surface-500">Status</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase text-surface-500">Uploaded</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase text-surface-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map((doc, idx) => {
                const lead = leads.find(l => l.id === doc.leadId);
                return (
                  <motion.tr key={doc.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.02 }} className="border-b border-surface-100 last:border-0 hover:bg-surface-50/50">
                    <td className="px-4 py-3 font-medium text-surface-900">{doc.name}</td>
                    <td className="px-4 py-3 text-surface-500">{doc.type}</td>
                    <td className="px-4 py-3 text-surface-700">{lead?.name}</td>
                    <td className="px-4 py-3"><StatusBadge status={doc.status} type="document" /></td>
                    <td className="px-4 py-3 text-surface-400 text-xs">{getRelativeTime(doc.uploadedAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setPreviewDoc(doc)} className="rounded-lg p-1.5 text-surface-400 hover:bg-surface-100 transition-colors"><Eye className="h-3.5 w-3.5" /></button>
                        <button onClick={() => handleApprove(doc)} className="rounded-lg p-1.5 text-success-600 hover:bg-success-50 transition-colors"><CheckCircle2 className="h-3.5 w-3.5" /></button>
                        <button onClick={() => handleReject(doc)} className="rounded-lg p-1.5 text-danger-600 hover:bg-danger-50 transition-colors"><XCircle className="h-3.5 w-3.5" /></button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!previewDoc} onOpenChange={() => setPreviewDoc(null)} title="Document Preview" size="lg">
        {previewDoc && (() => {
          const lead = leads.find(l => l.id === previewDoc.leadId);
          return (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className={cn('flex h-14 w-14 items-center justify-center rounded-xl', previewDoc.status === 'approved' ? 'bg-success-100' : 'bg-surface-100')}>
                  <FileText className={cn('h-7 w-7', previewDoc.status === 'approved' ? 'text-success-600' : 'text-surface-400')} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-surface-900">{previewDoc.name}</h3>
                  <p className="text-sm text-surface-500">{previewDoc.type} &middot; {lead?.name}</p>
                </div>
                <div className="ml-auto"><StatusBadge status={previewDoc.status} type="document" /></div>
              </div>

              <div className="rounded-xl bg-surface-50 p-8 text-center">
                <FileText className="h-16 w-16 text-surface-300 mx-auto mb-3" />
                <p className="text-sm text-surface-500">Document preview will appear here</p>
                <button className="mt-3 inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium">
                  <Download className="h-4 w-4" /> Download
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-surface-50 p-3">
                  <p className="text-xs text-surface-500">Uploaded</p>
                  <p className="text-sm font-medium text-surface-900">{formatDate(previewDoc.uploadedAt)}</p>
                </div>
                <div className="rounded-lg bg-surface-50 p-3">
                  <p className="text-xs text-surface-500">Version</p>
                  <p className="text-sm font-medium text-surface-900">v{previewDoc.version}</p>
                </div>
                <div className="rounded-lg bg-surface-50 p-3">
                  <p className="text-xs text-surface-500">Status</p>
                  <StatusBadge status={previewDoc.status} type="document" />
                </div>
              </div>

              {previewDoc.status === 'pending' && (
                <div className="flex justify-end gap-3 pt-2">
                  <button onClick={() => setPreviewDoc(null)} className="px-4 py-2 text-sm font-medium text-surface-600 hover:bg-surface-100 rounded-lg transition-colors">Close</button>
                  <button onClick={() => handleReject(previewDoc)} className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-danger-600 border border-danger-200 hover:bg-danger-50 rounded-lg transition-colors">
                    <XCircle className="h-4 w-4" /> Reject
                  </button>
                  <button onClick={() => handleApprove(previewDoc)} className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-success-600 hover:bg-success-700 rounded-lg transition-colors">
                    <CheckCircle2 className="h-4 w-4" /> Approve
                  </button>
                </div>
              )}
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
