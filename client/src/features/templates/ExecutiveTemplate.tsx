import React from 'react';
import { TemplateProps } from './types';

export const ExecutiveTemplate: React.FC<TemplateProps> = ({ data }) => {
  const findSection = (type: string) =>
    data.sections.find((s) => s.type === type && s.isVisible);

  const personal = findSection('personal')?.content ?? {};
  const summary = findSection('summary')?.content ?? {};
  const experiences = findSection('experience')?.content ?? [];
  const educationList = findSection('education')?.content ?? [];
  const skillGroups = findSection('skills')?.content ?? [];

  return (
    <div className="w-full bg-white text-gray-900 p-10 shadow-sm font-serif text-sm leading-relaxed max-w-[800px] mx-auto min-h-[1000px]">
      {/* Header */}
      <div className="border-b-2 border-amber-800/40 pb-6 mb-8 text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 uppercase">
          {personal.fullName || 'YOUR NAME'}
        </h1>
        <p className="font-sans text-xs uppercase tracking-widest text-amber-800 font-semibold">
          {personal.headline || 'Executive Leadership'}
        </p>
        <div className="font-sans flex flex-wrap items-center justify-center gap-x-4 text-xs text-gray-600 pt-2">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>• {personal.phone}</span>}
          {personal.location && <span>• {personal.location}</span>}
          {personal.linkedin && <span>• {personal.linkedin}</span>}
        </div>
      </div>

      {/* Summary */}
      {findSection('summary') && summary.text && (
        <div className="mb-6">
          <h2 className="font-sans text-xs font-bold uppercase tracking-widest text-amber-900 border-b border-gray-300 pb-1 mb-2">
            Executive Profile
          </h2>
          <p className="text-xs italic leading-relaxed text-gray-800">{summary.text}</p>
        </div>
      )}

      {/* Experience */}
      {findSection('experience') && experiences.length > 0 && (
        <div className="mb-6">
          <h2 className="font-sans text-xs font-bold uppercase tracking-widest text-amber-900 border-b border-gray-300 pb-1 mb-4">
            Leadership & Career History
          </h2>
          <div className="space-y-5">
            {experiences.map((exp: any, i: number) => (
              <div key={exp.id || i}>
                <div className="flex justify-between items-baseline font-bold text-sm text-gray-900">
                  <span>{exp.position}</span>
                  <span className="font-sans text-xs text-gray-600 font-normal">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <p className="font-sans text-xs font-semibold text-amber-800 mb-1">{exp.company} {exp.location ? `| ${exp.location}` : ''}</p>
                {exp.description && <p className="text-xs text-gray-700 mb-2">{exp.description}</p>}
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-disc list-outside pl-4 space-y-1 text-xs text-gray-800">
                    {exp.bullets.map((bullet: string, idx: number) => (
                      <li key={idx}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {findSection('education') && educationList.length > 0 && (
        <div className="mb-6">
          <h2 className="font-sans text-xs font-bold uppercase tracking-widest text-amber-900 border-b border-gray-300 pb-1 mb-3">
            Education & Credentials
          </h2>
          <div className="space-y-2">
            {educationList.map((edu: any, i: number) => (
              <div key={edu.id || i} className="flex justify-between text-xs">
                <div>
                  <span className="font-bold">{edu.degree}</span> in {edu.fieldOfStudy},{' '}
                  <span>{edu.institution}</span>
                </div>
                <span className="font-sans text-gray-600">{edu.startDate} – {edu.endDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {findSection('skills') && skillGroups.length > 0 && (
        <div>
          <h2 className="font-sans text-xs font-bold uppercase tracking-widest text-amber-900 border-b border-gray-300 pb-1 mb-2">
            Core Competencies
          </h2>
          <div className="font-sans space-y-1 text-xs text-gray-800">
            {skillGroups.map((g: any, i: number) => (
              <div key={g.id || i}>
                <span className="font-bold">{g.category}: </span>
                <span>{Array.isArray(g.items) ? g.items.join(' • ') : g.items}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
