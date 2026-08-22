import React from 'react';
import { TemplateProps } from './types';

export const MinimalTemplate: React.FC<TemplateProps> = ({ data }) => {
  const findSection = (type: string) =>
    data.sections.find((s) => s.type === type && s.isVisible);

  const personal = findSection('personal')?.content ?? {};
  const summary = findSection('summary')?.content ?? {};
  const experiences = findSection('experience')?.content ?? [];
  const educationList = findSection('education')?.content ?? [];
  const skillGroups = findSection('skills')?.content ?? [];

  return (
    <div className="w-full bg-white text-gray-900 p-8 shadow-sm font-mono text-xs leading-relaxed max-w-[800px] mx-auto min-h-[1000px] space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold uppercase tracking-widest">{personal.fullName || 'YOUR NAME'}</h1>
        <p className="text-[11px] text-gray-500">{personal.headline}</p>
        <p className="text-[11px] text-gray-500 mt-1">
          {[personal.email, personal.phone, personal.location, personal.linkedin].filter(Boolean).join(' | ')}
        </p>
      </div>

      {/* Summary */}
      {findSection('summary') && summary.text && (
        <div>
          <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">// SUMMARY</h2>
          <p className="text-xs text-gray-700 leading-normal">{summary.text}</p>
        </div>
      )}

      {/* Experience */}
      {findSection('experience') && experiences.length > 0 && (
        <div>
          <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">// EXPERIENCE</h2>
          <div className="space-y-4">
            {experiences.map((exp: any, i: number) => (
              <div key={exp.id || i}>
                <div className="flex justify-between font-bold text-xs">
                  <span>{exp.position} @ {exp.company}</span>
                  <span className="text-gray-500 text-[11px]">{exp.startDate} – {exp.current ? 'NOW' : exp.endDate}</span>
                </div>
                {exp.description && <p className="text-xs text-gray-600 my-1">{exp.description}</p>}
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-square pl-4 space-y-1 text-xs text-gray-700">
                    {exp.bullets.map((b: string, idx: number) => (
                      <li key={idx}>- {b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {findSection('skills') && skillGroups.length > 0 && (
        <div>
          <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">// SKILLS</h2>
          <div className="space-y-1">
            {skillGroups.map((g: any, i: number) => (
              <div key={g.id || i}>
                <span className="font-bold">{g.category}:</span>{' '}
                <span className="text-gray-700">{Array.isArray(g.items) ? g.items.join(', ') : g.items}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {findSection('education') && educationList.length > 0 && (
        <div>
          <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">// EDUCATION</h2>
          <div className="space-y-2">
            {educationList.map((edu: any, i: number) => (
              <div key={edu.id || i} className="flex justify-between">
                <span>{edu.degree} in {edu.fieldOfStudy} ({edu.institution})</span>
                <span className="text-gray-500">{edu.startDate} – {edu.endDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
