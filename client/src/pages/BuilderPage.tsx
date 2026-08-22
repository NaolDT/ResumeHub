import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiGet, apiPut } from '@/api/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TemplateRenderer } from '@/features/templates/TemplateRenderer';
import { ResumeData } from '@/features/templates/types';
import {
  Save,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Trash2,
  GripVertical,
} from 'lucide-react';

const SECTION_TYPE_LABELS: Record<string, string> = {
  personal: 'Personal Information',
  summary: 'Professional Summary',
  experience: 'Work Experience',
  education: 'Education',
  skills: 'Skills & Expertise',
  certifications: 'Certifications',
  projects: 'Projects',
  languages: 'Languages',
  awards: 'Awards',
  references: 'References',
  custom: 'Custom Section',
};

export const BuilderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: resumeData, isLoading } = useQuery({
    queryKey: ['resume', id],
    queryFn: () => apiGet<{ resume: ResumeData }>(`/resumes/${id}`),
    enabled: !!id,
  });

  const [draft, setDraft] = useState<ResumeData | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    if (resumeData?.resume) {
      setDraft(resumeData.resume);
    }
  }, [resumeData]);

  const saveMutation = useMutation({
    mutationFn: (data: Partial<ResumeData>) => apiPut(`/resumes/${id}`, data),
    onSuccess: () => {
      setSaveStatus('saved');
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      setTimeout(() => setSaveStatus('idle'), 2000);
    },
  });

  // Debounced autosave — triggers 3s after last change
  const scheduleAutosave = (updated: ResumeData) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    setSaveStatus('saving');
    saveTimerRef.current = setTimeout(() => {
      saveMutation.mutate({ sections: updated.sections, title: updated.title });
    }, 3000);
  };

  const updateSectionContent = (sectionId: string, content: any) => {
    if (!draft) return;
    const updated = {
      ...draft,
      sections: draft.sections.map((s) => (s.id === sectionId ? { ...s, content } : s)),
    };
    setDraft(updated);
    scheduleAutosave(updated);
  };

  const toggleSectionVisibility = (sectionId: string) => {
    if (!draft) return;
    const updated = {
      ...draft,
      sections: draft.sections.map((s) =>
        s.id === sectionId ? { ...s, isVisible: !s.isVisible } : s,
      ),
    };
    setDraft(updated);
    scheduleAutosave(updated);
  };

  const updateTitle = (title: string) => {
    if (!draft) return;
    const updated = { ...draft, title };
    setDraft(updated);
    scheduleAutosave(updated);
  };

  const changeTemplate = (templateId: ResumeData['templateId']) => {
    if (!draft) return;
    const updated = { ...draft, templateId };
    setDraft(updated);
    saveMutation.mutate({ templateId });
  };

  if (isLoading || !draft) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-muted gap-2">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>Loading resume builder...</span>
      </div>
    );
  }

  const sortedSections = [...draft.sections].sort((a, b) => a.order - b.order);
  const activeSection = sortedSections.find((s) => s.id === activeSectionId);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Builder Top Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-line bg-surface">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-lg text-muted hover:text-ink hover:bg-canvas transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <input
            type="text"
            value={draft.title}
            onChange={(e) => updateTitle(e.target.value)}
            className="text-sm font-semibold text-ink bg-transparent border-none focus:outline-none focus:ring-0 max-w-[220px] truncate"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Template Selector */}
          <select
            value={draft.templateId}
            onChange={(e) => changeTemplate(e.target.value as ResumeData['templateId'])}
            className="text-xs border border-line rounded-lg px-3 py-1.5 bg-canvas text-ink focus:outline-none focus:border-brand"
          >
            <option value="ats-friendly">ATS-Friendly</option>
            <option value="modern">Modern</option>
            <option value="minimal">Minimal</option>
            <option value="executive">Executive (PRO)</option>
            <option value="creative">Creative (PRO)</option>
            <option value="academic">Academic (PRO)</option>
          </select>

          {/* Save status */}
          <div className="flex items-center gap-1.5 text-xs text-muted">
            {saveStatus === 'saving' && (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-brand" />
                <span>Saving…</span>
              </>
            )}
            {saveStatus === 'saved' && (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-600">Saved</span>
              </>
            )}
          </div>

          <button
            onClick={() => {
              if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
              saveMutation.mutate({ sections: draft.sections, title: draft.title });
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-white bg-brand hover:bg-brand-hover transition-colors"
          >
            <Save className="h-3.5 w-3.5" />
            Save
          </button>
        </div>
      </div>

      {/* Main Builder Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar — Section Navigator */}
        <div className="w-56 shrink-0 border-r border-line bg-surface overflow-y-auto hidden md:flex flex-col">
          <div className="p-3 border-b border-line">
            <p className="text-[11px] font-bold text-muted uppercase tracking-wider">Sections</p>
          </div>
          <div className="py-2 space-y-0.5 px-2">
            {sortedSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSectionId(section.id === activeSectionId ? null : section.id)}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
                  activeSectionId === section.id
                    ? 'bg-brand/10 text-brand font-semibold'
                    : section.isVisible
                      ? 'text-muted hover:text-ink hover:bg-canvas'
                      : 'text-muted/50 hover:bg-canvas'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <GripVertical className="h-3.5 w-3.5 shrink-0 text-muted/30" />
                  <span className="truncate">{SECTION_TYPE_LABELS[section.type] || section.title}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSectionVisibility(section.id);
                  }}
                  className="shrink-0 text-muted hover:text-ink"
                >
                  {section.isVisible ? (
                    <Eye className="h-3.5 w-3.5" />
                  ) : (
                    <EyeOff className="h-3.5 w-3.5" />
                  )}
                </button>
              </button>
            ))}
          </div>
        </div>

        {/* Middle — Editor Panel */}
        <div className="flex-1 min-w-0 overflow-y-auto bg-canvas p-4 space-y-3">
          {/* Active section editor */}
          {activeSection ? (
            <SectionEditor
              section={activeSection}
              onChange={(content) => updateSectionContent(activeSection.id, content)}
            />
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-line p-8 text-center text-muted text-sm">
              <p className="font-medium text-ink">Select a section from the sidebar to start editing</p>
              <p className="text-xs mt-1">Changes are saved automatically every 3 seconds</p>
            </div>
          )}
        </div>

        {/* Right — Live Preview */}
        <div className="hidden xl:flex flex-col w-[480px] shrink-0 border-l border-line bg-gray-50 overflow-y-auto">
          <div className="sticky top-0 z-10 bg-gray-50 border-b border-line px-4 py-2">
            <p className="text-[11px] font-bold text-muted uppercase tracking-wider">Live Preview</p>
          </div>
          <div className="p-4 scale-[0.62] origin-top-left w-[780px] pointer-events-none">
            <TemplateRenderer data={draft} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Section Editor sub-component
function SectionEditor({ section, onChange }: { section: any; onChange: (content: any) => void }) {
  const content = section.content;

  if (section.type === 'personal') {
    return (
      <div className="rounded-2xl border border-line bg-surface p-6 space-y-4">
        <h3 className="text-sm font-bold text-ink">Personal Information</h3>
        {['fullName', 'email', 'phone', 'location', 'website', 'linkedin', 'github'].map((field) => (
          <div key={field}>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5 capitalize">
              {field.replace(/([A-Z])/g, ' $1')}
            </label>
            <input
              type="text"
              value={content[field] ?? ''}
              onChange={(e) => onChange({ ...content, [field]: e.target.value })}
              className="w-full px-3 py-2 bg-canvas border border-line rounded-lg text-sm text-ink focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
            />
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'summary') {
    return (
      <div className="rounded-2xl border border-line bg-surface p-6 space-y-4">
        <h3 className="text-sm font-bold text-ink">Professional Summary</h3>
        <textarea
          rows={5}
          value={content.text ?? ''}
          onChange={(e) => onChange({ ...content, text: e.target.value })}
          placeholder="Write a compelling 2-4 sentence professional summary..."
          className="w-full px-3 py-2 bg-canvas border border-line rounded-lg text-sm text-ink focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand resize-none leading-relaxed"
        />
        <p className="text-xs text-muted">{(content.text ?? '').length} characters</p>
      </div>
    );
  }

  if (section.type === 'experience') {
    const items: any[] = Array.isArray(content) ? content : [];
    return (
      <div className="rounded-2xl border border-line bg-surface p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-ink">Work Experience</h3>
          <button
            onClick={() =>
              onChange([
                ...items,
                {
                  id: `exp-${Date.now()}`,
                  company: '',
                  position: '',
                  location: '',
                  startDate: '',
                  endDate: '',
                  current: false,
                  description: '',
                  bullets: [''],
                },
              ])
            }
            className="text-xs font-semibold text-brand hover:underline"
          >
            + Add Experience
          </button>
        </div>
        <div className="space-y-6">
          {items.map((item, i) => (
            <div key={item.id} className="border border-line rounded-xl p-4 space-y-3 relative">
              <button
                onClick={() => onChange(items.filter((_, j) => j !== i))}
                className="absolute top-3 right-3 text-muted hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              {['company', 'position', 'location', 'startDate', 'endDate'].map((field) => (
                <div key={field}>
                  <label className="block text-[11px] font-semibold text-muted uppercase tracking-wider mb-1 capitalize">
                    {field.replace(/([A-Z])/g, ' $1')}
                  </label>
                  <input
                    type="text"
                    value={item[field] ?? ''}
                    onChange={(e) => {
                      const updated = [...items];
                      updated[i] = { ...item, [field]: e.target.value };
                      onChange(updated);
                    }}
                    className="w-full px-3 py-1.5 bg-canvas border border-line rounded-lg text-sm text-ink focus:outline-none focus:border-brand"
                  />
                </div>
              ))}
              <div>
                <label className="block text-[11px] font-semibold text-muted uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={item.description ?? ''}
                  onChange={(e) => {
                    const updated = [...items];
                    updated[i] = { ...item, description: e.target.value };
                    onChange(updated);
                  }}
                  className="w-full px-3 py-1.5 bg-canvas border border-line rounded-lg text-sm text-ink focus:outline-none focus:border-brand resize-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-muted uppercase tracking-wider mb-1">
                  Bullet Points (one per line)
                </label>
                <textarea
                  rows={3}
                  value={(item.bullets ?? []).join('\n')}
                  onChange={(e) => {
                    const updated = [...items];
                    updated[i] = { ...item, bullets: e.target.value.split('\n') };
                    onChange(updated);
                  }}
                  className="w-full px-3 py-1.5 bg-canvas border border-line rounded-lg text-sm text-ink focus:outline-none focus:border-brand resize-none font-mono text-xs"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (section.type === 'education') {
    const items: any[] = Array.isArray(content) ? content : [];
    return (
      <div className="rounded-2xl border border-line bg-surface p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-ink">Education</h3>
          <button
            onClick={() =>
              onChange([
                ...items,
                { id: `edu-${Date.now()}`, institution: '', degree: '', fieldOfStudy: '', location: '', startDate: '', endDate: '', gpa: '' },
              ])
            }
            className="text-xs font-semibold text-brand hover:underline"
          >
            + Add Education
          </button>
        </div>
        {items.map((item, i) => (
          <div key={item.id} className="border border-line rounded-xl p-4 space-y-3 relative">
            <button
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="absolute top-3 right-3 text-muted hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            {['institution', 'degree', 'fieldOfStudy', 'location', 'startDate', 'endDate', 'gpa'].map((field) => (
              <div key={field}>
                <label className="block text-[11px] font-semibold text-muted uppercase tracking-wider mb-1 capitalize">
                  {field.replace(/([A-Z])/g, ' $1')}
                </label>
                <input
                  type="text"
                  value={item[field] ?? ''}
                  onChange={(e) => {
                    const updated = [...items];
                    updated[i] = { ...item, [field]: e.target.value };
                    onChange(updated);
                  }}
                  className="w-full px-3 py-1.5 bg-canvas border border-line rounded-lg text-sm text-ink focus:outline-none focus:border-brand"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'skills') {
    const groups: any[] = Array.isArray(content) ? content : [];
    return (
      <div className="rounded-2xl border border-line bg-surface p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-ink">Skills</h3>
          <button
            onClick={() => onChange([...groups, { id: `skill-${Date.now()}`, category: 'New Category', items: [''] }])}
            className="text-xs font-semibold text-brand hover:underline"
          >
            + Add Group
          </button>
        </div>
        {groups.map((group, i) => (
          <div key={group.id} className="border border-line rounded-xl p-4 space-y-3 relative">
            <button
              onClick={() => onChange(groups.filter((_, j) => j !== i))}
              className="absolute top-3 right-3 text-muted hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <div>
              <label className="block text-[11px] font-semibold text-muted uppercase tracking-wider mb-1">Category</label>
              <input
                type="text"
                value={group.category ?? ''}
                onChange={(e) => {
                  const updated = [...groups];
                  updated[i] = { ...group, category: e.target.value };
                  onChange(updated);
                }}
                className="w-full px-3 py-1.5 bg-canvas border border-line rounded-lg text-sm text-ink focus:outline-none focus:border-brand"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-muted uppercase tracking-wider mb-1">Skills (comma-separated)</label>
              <input
                type="text"
                value={Array.isArray(group.items) ? group.items.join(', ') : group.items}
                onChange={(e) => {
                  const updated = [...groups];
                  updated[i] = { ...group, items: e.target.value.split(',').map((s: string) => s.trim()) };
                  onChange(updated);
                }}
                className="w-full px-3 py-1.5 bg-canvas border border-line rounded-lg text-sm text-ink focus:outline-none focus:border-brand"
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

    if (section.type === 'projects') {
    const items: any[] = Array.isArray(content) ? content : [];
    return (
      <div className="rounded-2xl border border-line bg-surface p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-ink">Projects</h3>
          <button
            onClick={() =>
              onChange([
                ...items,
                {
                  id: `proj-${Date.now()}`,
                  name: '',
                  role: '',
                  link: '',
                  startDate: '',
                  endDate: '',
                  description: '',
                  highlights: [''],
                },
              ])
            }
            className="text-xs font-semibold text-brand hover:underline"
          >
            + Add Project
          </button>
        </div>
        {items.map((item, i) => (
          <div key={item.id} className="border border-line rounded-xl p-4 space-y-3 relative">
            <button
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="absolute top-3 right-3 text-muted hover:text-red-500 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <div>
              <label className="block text-[11px] font-semibold text-muted uppercase tracking-wider mb-1">Name</label>
              <input
                type="text"
                value={item.name ?? ''}
                onChange={(e) => {
                  const updated = [...items];
                  updated[i] = { ...item, name: e.target.value };
                  onChange(updated);
                }}
                className="w-full px-3 py-1.5 bg-canvas border border-line rounded-lg text-sm text-ink focus:outline-none focus:border-brand"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-muted uppercase tracking-wider mb-1">Role</label>
              <input
                type="text"
                value={item.role ?? ''}
                onChange={(e) => {
                  const updated = [...items];
                  updated[i] = { ...item, role: e.target.value };
                  onChange(updated);
                }}
                className="w-full px-3 py-1.5 bg-canvas border border-line rounded-lg text-sm text-ink focus:outline-none focus:border-brand"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-muted uppercase tracking-wider mb-1">Link</label>
              <input
                type="text"
                value={item.link ?? ''}
                onChange={(e) => {
                  const updated = [...items];
                  updated[i] = { ...item, link: e.target.value };
                  onChange(updated);
                }}
                className="w-full px-3 py-1.5 bg-canvas border border-line rounded-lg text-sm text-ink focus:outline-none focus:border-brand"
              />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-[11px] font-semibold text-muted uppercase tracking-wider mb-1">Start Date</label>
                <input
                  type="text"
                  value={item.startDate ?? ''}
                  onChange={(e) => {
                    const updated = [...items];
                    updated[i] = { ...item, startDate: e.target.value };
                    onChange(updated);
                  }}
                  className="w-full px-3 py-1.5 bg-canvas border border-line rounded-lg text-sm text-ink focus:outline-none focus:border-brand"
                />
              </div>
              <div className="flex-1">
                <label className="block text-[11px] font-semibold text-muted uppercase tracking-wider mb-1">End Date</label>
                <input
                  type="text"
                  value={item.endDate ?? ''}
                  onChange={(e) => {
                    const updated = [...items];
                    updated[i] = { ...item, endDate: e.target.value };
                    onChange(updated);
                  }}
                  className="w-full px-3 py-1.5 bg-canvas border border-line rounded-lg text-sm text-ink focus:outline-none focus:border-brand"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-muted uppercase tracking-wider mb-1">Description</label>
              <textarea
                rows={2}
                value={item.description ?? ''}
                onChange={(e) => {
                  const updated = [...items];
                  updated[i] = { ...item, description: e.target.value };
                  onChange(updated);
                }}
                className="w-full px-3 py-1.5 bg-canvas border border-line rounded-lg text-sm text-ink focus:outline-none focus:border-brand resize-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-muted uppercase tracking-wider mb-1">Highlights (one per line)</label>
              <textarea
                rows={3}
                value={(item.highlights ?? []).join('\\n')}
                onChange={(e) => {
                  const updated = [...items];
                  updated[i] = { ...item, highlights: e.target.value.split('\\n') };
                  onChange(updated);
                }}
                className="w-full px-3 py-1.5 bg-canvas border border-line rounded-lg text-sm text-ink focus:outline-none focus:border-brand resize-none font-mono text-xs"
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Generic fallback for other sections
  return (
    <div className="rounded-2xl border border-line bg-surface p-6">
      <h3 className="text-sm font-bold text-ink mb-4">{SECTION_TYPE_LABELS[section.type] || section.title}</h3>
      <textarea
        rows={6}
        value={typeof content === 'string' ? content : JSON.stringify(content, null, 2)}
        onChange={(e) => {
          try {
            onChange(JSON.parse(e.target.value));
          } catch {
            onChange(e.target.value);
          }
        }}
        className="w-full px-3 py-2 bg-canvas border border-line rounded-lg text-xs font-mono text-ink focus:outline-none focus:border-brand resize-none"
      />
    </div>
  );
}
