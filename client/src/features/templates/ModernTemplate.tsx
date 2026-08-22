import React from 'react';
import { TemplateProps } from './types';

export const ModernTemplate: React.FC<TemplateProps> = ({ data }) => {
  const findSection = (type: string) =>
    data.sections.find((s) => s.type === type && s.isVisible);

  const personal = findSection('personal')?.content ?? {};
  const summary = findSection('summary')?.content ?? {};
  const experiences = findSection('experience')?.content ?? [];
  const educationList = findSection('education')?.content ?? [];
  const skillGroups = findSection('skills')?.content ?? [];
  const projects = findSection('projects')?.content ?? [];

  const themeColorClass =
    data.colorTheme === 'emerald'
      ? 'bg-emerald-700 text-white'
      : data.colorTheme === 'purple'
        ? 'bg-purple-800 text-white'
        : data.colorTheme === 'amber'
          ? 'bg-amber-700 text-white'
          : 'bg-slate-900 text-white';

  const accentTextClass =
    data.colorTheme === 'emerald'
      ? 'text-emerald-700'
      : data.colorTheme === 'purple'
        ? 'text-purple-800'
        : data.colorTheme === 'amber'
          ? 'text-amber-700'
          : 'text-brand';

  return (
    <div className="w-full bg-white text-gray-900 shadow-sm font-sans text-xs leading-normal max-w-[800px] mx-auto min-h-[1000px] flex flex-col">
      {/* Header Banner */}
      <div className={`p-8 ${themeColorClass}`}>
        <h1 className="text-2xl font-bold tracking-tight">{personal.fullName || 'YOUR NAME'}</h1>
        <p className="text-sm font-medium opacity-90 mt-1">{personal.headline || 'Software Engineer & System Architect'}</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] opacity-80 mt-3 pt-3 border-t border-white/20">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.linkedin && <span>{personal.linkedin}</span>}
          {personal.github && <span>{personal.github}</span>}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-3 p-8 gap-8 flex-1">
        {/* Left Column (Content) */}
        <div className="col-span-2 space-y-6">
          {/* Summary */}
          {findSection('summary') && summary.text && (
            <div>
              <h2 className={`text-xs font-bold uppercase tracking-wider ${accentTextClass} border-b border-gray-200 pb-1 mb-2`}>
                About Me
              </h2>
              <p className="text-xs leading-relaxed text-gray-700">{summary.text}</p>
            </div>
          )}

          {/* Work Experience */}
          {findSection('experience') && experiences.length > 0 && (
            <div>
              <h2 className={`text-xs font-bold uppercase tracking-wider ${accentTextClass} border-b border-gray-200 pb-1 mb-4`}>
                Experience
              </h2>
              <div className="space-y-4">
                {experiences.map((exp: any, i: number) => (
                  <div key={exp.id || i} className="relative pl-3 border-l-2 border-gray-200">
                    <div className="flex justify-between items-baseline font-semibold text-xs text-gray-900">
                      <span>{exp.position}</span>
                      <span className="text-[11px] text-gray-500 font-normal">
                        {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <p className={`text-[11px] font-medium ${accentTextClass} mb-1`}>{exp.company} {exp.location ? `• ${exp.location}` : ''}</p>
                    {exp.description && <p className="text-xs text-gray-600 mb-1.5">{exp.description}</p>}
                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className="list-disc list-outside pl-3 space-y-1 text-xs text-gray-700">
                        {exp.bullets.map((b: string, idx: number) => (
                          <li key={idx}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {findSection('projects') && projects.length > 0 && (
            <div>
              <h2 className={`text-xs font-bold uppercase tracking-wider ${accentTextClass} border-b border-gray-200 pb-1 mb-3`}>
                Projects
              </h2>
              <div className="space-y-3">
                {projects.map((p: any, i: number) => (
                  <div key={p.id || i}>
                    <div className="flex justify-between font-semibold text-xs">
                      <span>{p.name}</span>
                      <span className="text-gray-500 text-[11px] font-normal">{p.startDate} – {p.endDate}</span>
                    </div>
                    {p.description && <p className="text-xs text-gray-600 mt-0.5">{p.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Skills */}
          {findSection('skills') && skillGroups.length > 0 && (
            <div>
              <h2 className={`text-xs font-bold uppercase tracking-wider ${accentTextClass} border-b border-gray-200 pb-1 mb-3`}>
                Skills
              </h2>
              <div className="space-y-3">
                {skillGroups.map((g: any, i: number) => (
                  <div key={g.id || i}>
                    <p className="text-[11px] font-semibold text-gray-800 mb-1">{g.category}</p>
                    <div className="flex flex-wrap gap-1">
                      {(Array.isArray(g.items) ? g.items : [g.items]).map((item: string, idx: number) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-gray-100 text-[11px] text-gray-700 font-medium">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {findSection('education') && educationList.length > 0 && (
            <div>
              <h2 className={`text-xs font-bold uppercase tracking-wider ${accentTextClass} border-b border-gray-200 pb-1 mb-3`}>
                Education
              </h2>
              <div className="space-y-3">
                {educationList.map((edu: any, i: number) => (
                  <div key={edu.id || i}>
                    <p className="font-semibold text-xs text-gray-900">{edu.degree}</p>
                    <p className="text-[11px] text-gray-700">{edu.fieldOfStudy}</p>
                    <p className="text-[11px] text-gray-500">{edu.institution}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{edu.startDate} – {edu.endDate}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
