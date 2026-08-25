import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare, Mail, Smartphone, Plus, Edit3, Eye, Send,
  Copy, Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { templates } from '@/data/mockData';
import { formatDate } from '@/lib/utils';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';
import toast from 'react-hot-toast';
import type { Template } from '@/types';

const typeConfig: Record<string, { icon: typeof MessageSquare; color: string; bg: string }> = {
  whatsapp: { icon: MessageSquare, color: 'text-[#2CBB5D]', bg: 'bg-[#132E1F] border border-[#2CBB5D]/40' },
  sms: { icon: Smartphone, color: 'text-[#007AFF]', bg: 'bg-[#1E293B] border border-[#007AFF]/40' },
  email: { icon: Mail, color: 'text-[#FFA116]', bg: 'bg-[#3A2E12] border border-[#FFA116]/40' },
};

export default function Templates() {
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
      return `<span class="inline-flex items-center rounded-md bg-[#383838] border border-[#FFA116]/50 px-2 py-0.5 text-[11px] font-mono font-bold text-[#FFA116] mx-0.5 shadow-sm">${varName}</span>`;
    });
  };

  return (
    <div className="p-6 space-y-6 pb-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Templates</h1>
          <p className="text-xs font-medium text-slate-400 mt-1">Manage WhatsApp, SMS and Email templates for automated communications</p>
        </div>
        <button
          onClick={() => { setEditingTemplate(null); setShowModal(true); }}
          className="inline-flex items-center gap-2 rounded-lg bg-[#FFA116] hover:bg-[#E08800] px-4 py-2.5 text-xs font-black text-[#1A1A1A] shadow-md transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add Template
        </button>
      </motion.div>

      {/* Type Tabs */}
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
              'inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold transition-all cursor-pointer',
              activeType === tab.value
                ? 'bg-[#FFA116] text-[#1A1A1A] font-black shadow-md'
                : 'bg-[#282828] border border-[#3E3E3E] text-white hover:bg-[#383838]'
            )}
          >
            {tab.label}
            <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-mono font-bold', activeType === tab.value ? 'bg-[#1A1A1A]/20 text-[#1A1A1A]' : 'bg-[#1A1A1A] text-[#FFA116]')}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {filteredTemplates.length === 0 ? (
        <EmptyState icon={MessageSquare} title="No templates found" description="Create your first template to get started with automated messaging." />
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredTemplates.map((template, idx) => {
            const config = typeConfig[template.type] || typeConfig.whatsapp;
            const Icon = config.icon;

            return (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.04 }}
                className="rounded-xl border border-[#3E3E3E] bg-[#282828] shadow-xl hover:border-[#FFA116] transition-all duration-200 overflow-hidden flex flex-col justify-between"
              >
                <div className="p-5 space-y-4">
                  {/* Card Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg shadow-sm', config.bg)}>
                        <Icon className={cn('h-5 w-5', config.color)} />
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-white">{template.name}</h3>
                        <p className="text-xs text-[#FFA116] font-bold capitalize">{template.type} Template</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => { setEditingTemplate(template); setShowModal(true); }}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-[#383838] hover:text-white transition-colors"
                        title="Edit Template"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setPreviewTemplate(template)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-[#383838] hover:text-white transition-colors"
                        title="Preview Template"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Email Subject Line */}
                  {template.subject && (
                    <div className="text-xs text-slate-300 font-medium bg-[#1A1A1A] p-2.5 rounded-lg border border-[#3E3E3E]">
                      <span className="font-bold text-[#FFA116]">Subject: </span>
                      <span className="text-white">{template.subject}</span>
                    </div>
                  )}

                  {/* Content Bubble */}
                  <div className="rounded-lg bg-[#1A1A1A] border border-[#3E3E3E] p-3.5 shadow-inner">
                    <p className="text-xs text-slate-200 leading-relaxed line-clamp-5 whitespace-pre-wrap font-sans" dangerouslySetInnerHTML={{ __html: renderPreview(template.content) }} />
                  </div>

                  {/* Variables section */}
                  {template.variables.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#FFA116]">Variables</p>
                      <div className="flex flex-wrap gap-1.5">
                        {template.variables.map(v => (
                          <button
                            key={v}
                            onClick={() => handleCopyVariable(v)}
                            className="inline-flex items-center gap-1.5 rounded-md bg-[#1A1A1A] border border-[#3E3E3E] px-2 py-1 text-[10px] font-mono font-bold text-[#FFA116] hover:bg-[#383838] hover:border-[#FFA116] transition-colors cursor-pointer"
                          >
                            {copiedVar === v ? <Check className="h-3 w-3 text-[#2CBB5D]" /> : <Copy className="h-3 w-3 text-slate-400" />}
                            {`{{${v}}}`}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="px-5 py-3 border-t border-[#3E3E3E] bg-[#222222] flex items-center justify-between">
                  <span className="text-[10px] font-medium text-slate-400">Created {formatDate(template.createdAt)}</span>
                  <button
                    onClick={() => toast.success(`Test ${template.type} sent successfully!`)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FFA116] hover:underline cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5" /> Send Test
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Edit / Add Modal */}
      <Modal open={showModal} onOpenChange={setShowModal} title={editingTemplate ? 'Edit Template' : 'Add Template'} size="lg">
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#FFA116] mb-1.5">Template Name</label>
              <input
                defaultValue={editingTemplate?.name}
                placeholder="e.g. Welcome Message"
                className="w-full rounded-lg border border-[#3E3E3E] bg-[#1A1A1A] px-3.5 py-2 text-xs font-bold text-white outline-none focus:border-[#FFA116]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#FFA116] mb-1.5">Template Type</label>
              <select
                defaultValue={editingTemplate?.type || 'whatsapp'}
                className="w-full rounded-lg border border-[#3E3E3E] bg-[#1A1A1A] px-3.5 py-2 text-xs font-bold text-white outline-none focus:border-[#FFA116]"
              >
                <option value="whatsapp">WhatsApp</option>
                <option value="sms">SMS</option>
                <option value="email">Email</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-[#FFA116] mb-1.5">Subject Line (Email only)</label>
            <input
              defaultValue={editingTemplate?.subject}
              className="w-full rounded-lg border border-[#3E3E3E] bg-[#1A1A1A] px-3.5 py-2 text-xs font-bold text-white outline-none focus:border-[#FFA116]"
              placeholder="e.g. Welcome to Geeks of Gurukul!"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#FFA116] mb-1.5">Template Body Content</label>
            <textarea
              defaultValue={editingTemplate?.content}
              rows={5}
              className="w-full rounded-lg border border-[#3E3E3E] bg-[#1A1A1A] p-3.5 text-xs font-mono text-white outline-none focus:border-[#FFA116] resize-none"
              placeholder="Hi {{student_name}}! Welcome to Geeks of Gurukul. Your counsellor {{counsellor_name}} will contact you shortly."
            />
            <p className="mt-1.5 text-[11px] font-medium text-slate-400">
              Use <code className="text-[#FFA116] font-bold">{'{{variable_name}}'}</code> syntax. Available: <span className="text-white font-mono">student_name, course_name, counsellor_name, batch_name, amount</span>
            </p>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#3E3E3E]">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-xs font-bold text-slate-300 hover:bg-[#383838] rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => { toast.success(editingTemplate ? 'Template updated' : 'Template created'); setShowModal(false); }}
              className="px-5 py-2 text-xs font-black text-[#1A1A1A] bg-[#FFA116] hover:bg-[#E08800] rounded-lg transition-colors shadow-md"
            >
              {editingTemplate ? 'Update Template' : 'Create Template'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Preview Modal */}
      <Modal open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)} title="Template Preview" size="md">
        {previewTemplate && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2.5">
              {(() => {
                const C = typeConfig[previewTemplate.type] || typeConfig.whatsapp;
                return (
                  <>
                    <div className={cn('flex h-8 w-8 items-center justify-center rounded-md', C.bg)}>
                      <C.icon className={cn('h-4 w-4', C.color)} />
                    </div>
                    <span className="text-sm font-bold text-white capitalize">{previewTemplate.type} Preview</span>
                  </>
                );
              })()}
            </div>
            {previewTemplate.subject && (
              <div className="rounded-lg bg-[#1A1A1A] p-3 border border-[#3E3E3E]">
                <p className="text-[10px] font-bold text-[#FFA116] uppercase">Subject</p>
                <p className="text-xs font-bold text-white mt-0.5">{previewTemplate.subject}</p>
              </div>
            )}
            <div className="rounded-xl bg-[#1A1A1A] p-4 border border-[#3E3E3E] shadow-inner">
              <p className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: renderPreview(previewTemplate.content) }} />
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="px-4 py-2 text-xs font-bold text-white bg-[#383838] hover:bg-[#555555] rounded-lg transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
