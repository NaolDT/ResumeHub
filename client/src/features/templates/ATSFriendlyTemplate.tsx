import React from 'react';
import { TemplateProps } from './types';

export const ATSFriendlyTemplate: React.FC<TemplateProps> = ({ data }) => {
  const findSection = (type: string) =>
    data.sections.find((s) => s.type === type && s.isVisible);

  const personal = findSection('personal')?.content ?? {};
  const summary = findSection('summary')?.content ?? {};
  const experiences = findSection('experience')?.content ?? [];
  const educationList = findSection('education')?.content ?? [];
  const skillGroups = findSection('skills')?.content ?? [];
  const projects = findSection('projects')?.content ?? [];

  return (
    <div className="w-full bg-white text-gray-900 p-8 shadow-sm font-sans text-sm leading-normal max-w-[800px] mx-auto min-h-[1000px]">
      {/* Header / Personal Info */}
      <div className="border-b-2 border-gray-900 pb-4 mb-6 text-center">
        <h1 className="text-2xl font-bold uppercase tracking-wider text-gray-900">
          {personal.fullName || 'YOUR NAME'}
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-gray-700 mt-2">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>• {personal.phone}</span>}
          {personal.location && <span>• {personal.location}</span>}
          {personal.linkedin && <span>• {personal.linkedin}</span>}
          {personal.github && <span>• {personal.github}</span>}
          {personal.website && <span>• {personal.website}</span>}
        </div>
      </div>

      {/* Summary */}
      {findSection('summary') && summary.text && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-900 border-b border-gray-300 pb-1 mb-2">
            Professional Summary
          </h2>
          <p className="text-xs leading-relaxed text-gray-800">{summary.text}</p>
        </div>
      )}

      {/* Experience */}
      {findSection('experience') && experiences.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-900 border-b border-gray-300 pb-1 mb-3">
            Work Experience
          </h2>
          <div className="space-y-4">
            {experiences.map((exp: any, i: number) => (
              <div key={exp.id || i}>
                <div className="flex justify-between items-baseline font-bold text-xs">
                  <span>
                    {exp.position} — <span className="font-semibold text-gray-700">{exp.company}</span>
                  </span>
                  <span className="text-gray-600 font-medium text-[11px]">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.location && (
                  <p className="text-[11px] text-gray-500 italic mb-1">{exp.location}</p>
                )}
                {exp.description && (
                  <p className="text-xs text-gray-700 mb-1.5">{exp.description}</p>
                )}
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
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-900 border-b border-gray-300 pb-1 mb-3">
            Education
          </h2>
          <div className="space-y-3">
            {educationList.map((edu: any, i: number) => (
              <div key={edu.id || i} className="flex justify-between items-baseline text-xs">
                <div>
                  <span className="font-bold">{edu.degree}</span> in {edu.fieldOfStudy},{' '}
                  <span className="text-gray-700">{edu.institution}</span>
                  {edu.gpa && <span className="text-gray-500 text-[11px]"> (GPA: {edu.gpa})</span>}
                </div>
                <span className="text-gray-600 text-[11px] shrink-0">
                  {edu.startDate} – {edu.endDate}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {findSection('skills') && skillGroups.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-900 border-b border-gray-300 pb-1 mb-2">
            Skills & Competencies
          </h2>
          <div className="space-y-1.5 text-xs">
            {skillGroups.map((group: any, i: number) => (
              <div key={group.id || i}>
                <span className="font-bold text-gray-900">{group.category}: </span>
                <span className="text-gray-700">
                  {Array.isArray(group.items) ? group.items.join(', ') : group.items}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {findSection('projects') && projects.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-900 border-b border-gray-300 pb-1 mb-3">
            Key Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj: any, i: number) => (
              <div key={proj.id || i}>
                <div className="flex justify-between items-baseline font-bold text-xs">
                  <span>
                    {proj.name} {proj.role && <span className="font-normal text-gray-600">({proj.role})</span>}
                  </span>
                  <span className="text-gray-600 font-normal text-[11px]">{proj.startDate} – {proj.endDate}</span>
                </div>
                {proj.description && <p className="text-xs text-gray-700 mt-0.5">{proj.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
