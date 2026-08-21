import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, Mail, Smartphone, Plus, Edit3, Eye, Send,
  Variable, Copy, Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';
import { templates } from '@/data/mockData';
import { formatDate } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';
import toast from 'react-hot-toast';
import type { Template } from '@/types';

const typeConfig: Record<string, { icon: typeof MessageSquare; color: string; bg: string }> = {
  whatsapp: { icon: MessageSquare, color: 'text-success-600', bg: 'bg-success-100' },
  sms: { icon: Smartphone, color: 'text-blue-600', bg: 'bg-blue-100' },
  email: { icon: Mail, color: 'text-purple-600', bg: 'bg-purple-100' },
};

export default function Templates() {
  const { currentUser } = useAppStore();
  const [activeType, setActiveType] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [copiedVar, setCopiedVar] = useState<string | null>(null);

  const filteredTemplates = activeType === 'all' ? templates : templates.filter(t => t.type === activeType);

  const handleCopyVariable = (v: string) => {
    navigator.clipboard.writeText(`{{${v}}}`);
    setCopiedVar(v);
    toast.success(`Copied {{${v}}}`);
    setTimeout(() => setCopiedVar(null), 1500);
  };

  const renderPreview = (content: string) => {
    return content.replace(/\{\{(\w+)\}\}/g, (_, varName) => {
      return `<span class="inline-flex items-center rounded bg-primary-100 px-1.5 py-0.5 text-xs font-medium text-primary-700 mx-0.5">${varName}</span>`;
    });
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Templates</h1>
          <p className="text-sm text-surface-500">Manage WhatsApp, SMS and Email templates</p>
        </div>
        <button onClick={() => { setEditingTemplate(null); setShowModal(true); }} className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700">
          <Plus className="h-4 w-4" />
          Add Template
        </button>
      </motion.div>

      <div className="flex items-center gap-2">
        {[
          { value: 'all', label: 'All', count: templates.length },
          { value: 'whatsapp', label: 'WhatsApp', count: templates.filter(t => t.type === 'whatsapp').length },
          { value: 'sms', label: 'SMS', count: templates.filter(t => t.type === 'sms').length },
          { value: 'email', label: 'Email', count: templates.filter(t => t.type === 'email').length },
        ].map(tab => (
          <button
            key={tab.value}
            onClick={() => setActiveType(tab.value)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              activeType === tab.value
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-surface-200 text-surface-600 hover:bg-surface-50'
            )}
          >
            {tab.label}
            <span className={cn('rounded-full px-1.5 py-0.5 text-[10px]', activeType === tab.value ? 'bg-white/20' : 'bg-surface-100')}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {filteredTemplates.length === 0 ? (
        <EmptyState icon={MessageSquare} title="No templates" description="Create your first template to get started" />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredTemplates.map((template, idx) => {
            const config = typeConfig[template.type];
            const Icon = config.icon;

            return (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.04 }}
                className="rounded-xl border border-surface-200 bg-white shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', config.bg)}>
                        <Icon className={cn('h-5 w-5', config.color)} />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-surface-900">{template.name}</h3>
                        <p className="text-xs text-surface-500 capitalize">{template.type} Template</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => { setEditingTemplate(template); setShowModal(true); }} className="rounded-lg p-1.5 text-surface-400 hover:bg-surface-100 transition-colors">
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => setPreviewTemplate(template)} className="rounded-lg p-1.5 text-surface-400 hover:bg-surface-100 transition-colors">
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {template.subject && (
                    <p className="mt-3 text-xs text-surface-500">Subject: <span className="font-medium text-surface-700">{template.subject}</span></p>
                  )}

                  <div className="mt-3 rounded-lg bg-surface-50 p-3">
                    <p className="text-xs text-surface-600 line-clamp-4 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: renderPreview(template.content) }} />
                  </div>

                  {template.variables.length > 0 && (
                    <div className="mt-3">
                      <p className="text-[10px] font-semibold uppercase text-surface-400 mb-1.5">Variables</p>
                      <div className="flex flex-wrap gap-1">
                        {template.variables.map(v => (
                          <button
                            key={v}
                            onClick={() => handleCopyVariable(v)}
                            className="inline-flex items-center gap-1 rounded-md bg-primary-50 px-2 py-1 text-[10px] font-medium text-primary-600 hover:bg-primary-100 transition-colors"
                          >
                            {copiedVar === v ? <Check className="h-2.5 w-2.5" /> : <Copy className="h-2.5 w-2.5" />}
                            {`{{${v}}}`}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[10px] text-surface-400">Created {formatDate(template.createdAt)}</span>
                    <button onClick={() => toast.success('Test message sent')} className="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium">
                      <Send className="h-3 w-3" /> Send Test
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <Modal open={showModal} onOpenChange={setShowModal} title={editingTemplate ? 'Edit Template' : 'Add Template'} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Template Name</label>
              <input defaultValue={editingTemplate?.name} className="w-full rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Type</label>
              <select defaultValue={editingTemplate?.type} className="w-full rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none">
                <option value="whatsapp">WhatsApp</option>
                <option value="sms">SMS</option>
                <option value="email">Email</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Subject (Email only)</label>
            <input defaultValue={editingTemplate?.subject} className="w-full rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none" placeholder="Email subject line" />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Content</label>
            <textarea defaultValue={editingTemplate?.content} rows={6} className="w-full rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none resize-none font-mono" placeholder="Use {{variable_name}} for dynamic content" />
            <p className="mt-1 text-[10px] text-surface-400">Use {'{{variable_name}}'} syntax for variables. Available: {'{{student_name}}'}, {'{{course_name}}'}, {'{{counsellor_name}}'}, etc.</p>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-surface-600 hover:bg-surface-100 rounded-lg transition-colors">Cancel</button>
            <button onClick={() => { toast.success(editingTemplate ? 'Template updated' : 'Template created'); setShowModal(false); }} className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors">{editingTemplate ? 'Update' : 'Create'}</button>
          </div>
        </div>
      </Modal>

      <Modal open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)} title="Template Preview" size="md">
        {previewTemplate && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {(() => { const C = typeConfig[previewTemplate.type]; return <><C.icon className={cn('h-4 w-4', C.color)} /><span className="text-sm font-medium capitalize">{previewTemplate.type}</span></>; })()}
            </div>
            {previewTemplate.subject && (
              <div className="rounded-lg bg-surface-50 p-3">
                <p className="text-xs text-surface-500">Subject</p>
                <p className="text-sm font-medium text-surface-900">{previewTemplate.subject}</p>
              </div>
            )}
            <div className="rounded-lg bg-success-50 p-4 border border-success-100">
              <p className="text-sm text-surface-700 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: renderPreview(previewTemplate.content) }} />
            </div>
            <div className="flex justify-end">
              <button onClick={() => setPreviewTemplate(null)} className="px-4 py-2 text-sm font-medium text-surface-600 hover:bg-surface-100 rounded-lg transition-colors">Close</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
