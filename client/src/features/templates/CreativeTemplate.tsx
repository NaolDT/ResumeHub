import React from 'react';
import { TemplateProps } from './types';

export const CreativeTemplate: React.FC<TemplateProps> = ({ data }) => {
  const findSection = (type: string) =>
    data.sections.find((s) => s.type === type && s.isVisible);

  const personal = findSection('personal')?.content ?? {};
  const summary = findSection('summary')?.content ?? {};
  const experiences = findSection('experience')?.content ?? [];
  const educationList = findSection('education')?.content ?? [];
  const skillGroups = findSection('skills')?.content ?? [];
  // projects available via findSection('projects') when needed in future

  return (
    <div className="w-full bg-white text-gray-900 shadow-sm font-sans text-xs leading-normal max-w-[800px] mx-auto min-h-[1000px] grid grid-cols-12">
      {/* Creative Sidebar */}
      <div className="col-span-4 bg-gradient-to-b from-indigo-900 to-purple-950 text-white p-6 space-y-6 flex flex-col justify-between">
        <div className="space-y-6">
          <div>
            <div className="h-16 w-16 rounded-2xl bg-white/10 text-white font-bold text-2xl flex items-center justify-center border border-white/20 mb-4">
              {(personal.fullName || 'Y').charAt(0)}
            </div>
            <h1 className="text-xl font-extrabold tracking-tight leading-tight">{personal.fullName || 'YOUR NAME'}</h1>
            <p className="text-[11px] text-purple-200 mt-1 font-medium">{personal.headline || 'Creative Developer'}</p>
          </div>

          <div className="space-y-2 text-[11px] text-purple-100 pt-4 border-t border-white/10">
            {personal.email && <p className="truncate">✉ {personal.email}</p>}
            {personal.phone && <p>📞 {personal.phone}</p>}
            {personal.location && <p>📍 {personal.location}</p>}
            {personal.linkedin && <p className="truncate">🔗 {personal.linkedin}</p>}
          </div>

          {/* Skills */}
          {findSection('skills') && skillGroups.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-white/10">
              <h3 className="text-xs font-bold uppercase tracking-wider text-purple-300">Expertise</h3>
              {skillGroups.map((g: any, i: number) => (
                <div key={g.id || i}>
                  <p className="text-[11px] font-semibold text-white mb-1">{g.category}</p>
                  <div className="flex flex-wrap gap-1">
                    {(Array.isArray(g.items) ? g.items : [g.items]).map((item: string, idx: number) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] text-purple-100 border border-white/10">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="col-span-8 p-8 space-y-6">
        {/* Summary */}
        {findSection('summary') && summary.text && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-indigo-100 pb-1 mb-2">
              Profile Summary
            </h2>
            <p className="text-xs leading-relaxed text-gray-700">{summary.text}</p>
          </div>
        )}

        {/* Experience */}
        {findSection('experience') && experiences.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-indigo-100 pb-1 mb-4">
              Work Experience
            </h2>
            <div className="space-y-4">
              {experiences.map((exp: any, i: number) => (
                <div key={exp.id || i}>
                  <div className="flex justify-between items-baseline font-bold text-xs text-gray-900">
                    <span>{exp.position}</span>
                    <span className="text-[11px] text-indigo-600 font-medium">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <p className="text-[11px] font-semibold text-gray-600 mb-1">{exp.company}</p>
                  {exp.description && <p className="text-xs text-gray-600 mb-1.5">{exp.description}</p>}
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="list-disc list-outside pl-4 space-y-1 text-xs text-gray-700">
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

        {/* Education & Projects */}
        {findSection('education') && educationList.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-indigo-100 pb-1 mb-3">
              Education
            </h2>
            <div className="space-y-2">
              {educationList.map((edu: any, i: number) => (
                <div key={edu.id || i} className="flex justify-between text-xs">
                  <div>
                    <span className="font-bold">{edu.degree}</span>, <span>{edu.institution}</span>
                  </div>
                  <span className="text-gray-500">{edu.startDate} – {edu.endDate}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
