import React from 'react';
import { TemplateProps } from './types';

export const AcademicTemplate: React.FC<TemplateProps> = ({ data }) => {
  const findSection = (type: string) =>
    data.sections.find((s) => s.type === type && s.isVisible);

  const personal = findSection('personal')?.content ?? {};
  const summary = findSection('summary')?.content ?? {};
  const experiences = findSection('experience')?.content ?? [];
  const educationList = findSection('education')?.content ?? [];
  // skillGroups available via findSection('skills') when needed in future
  const projects = findSection('projects')?.content ?? [];

  return (
    <div className="w-full bg-white text-gray-900 p-10 shadow-sm font-serif text-sm leading-relaxed max-w-[800px] mx-auto min-h-[1000px] space-y-6">
      {/* Header */}
      <div className="text-center border-b border-gray-900 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{personal.fullName || 'CURRICULUM VITAE'}</h1>
        <p className="text-xs text-gray-700 mt-1">
          {[personal.email, personal.phone, personal.location, personal.website].filter(Boolean).join(' • ')}
        </p>
      </div>

      {/* Summary / Research Statement */}
      {findSection('summary') && summary.text && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-900 border-b border-gray-400 pb-1 mb-2 font-sans">
            Research Statement & Summary
          </h2>
          <p className="text-xs leading-relaxed text-gray-800">{summary.text}</p>
        </div>
      )}

      {/* Education */}
      {findSection('education') && educationList.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-900 border-b border-gray-400 pb-1 mb-3 font-sans">
            Education
          </h2>
          <div className="space-y-3">
            {educationList.map((edu: any, i: number) => (
              <div key={edu.id || i} className="flex justify-between items-baseline text-xs">
                <div>
                  <span className="font-bold">{edu.degree}</span> in {edu.fieldOfStudy}, <span className="italic">{edu.institution}</span>
                  {edu.gpa && <span className="text-gray-600"> (GPA: {edu.gpa})</span>}
                </div>
                <span className="font-sans text-gray-600 text-[11px]">{edu.startDate} – {edu.endDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Academic & Professional Appointments */}
      {findSection('experience') && experiences.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-900 border-b border-gray-400 pb-1 mb-3 font-sans">
            Academic & Professional Appointments
          </h2>
          <div className="space-y-4">
            {experiences.map((exp: any, i: number) => (
              <div key={exp.id || i}>
                <div className="flex justify-between items-baseline font-bold text-xs">
                  <span>{exp.position}, <span className="italic font-normal">{exp.company}</span></span>
                  <span className="font-sans text-gray-600 text-[11px]">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                {exp.description && <p className="text-xs text-gray-700 mt-1">{exp.description}</p>}
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-disc list-outside pl-4 space-y-1 text-xs text-gray-800 mt-1">
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

      {/* Research Projects & Publications */}
      {findSection('projects') && projects.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-900 border-b border-gray-400 pb-1 mb-3 font-sans">
            Publications & Key Projects
          </h2>
          <div className="space-y-3">
            {projects.map((p: any, i: number) => (
              <div key={p.id || i}>
                <div className="flex justify-between font-bold text-xs">
                  <span>{p.name}</span>
                  <span className="font-sans text-gray-600 text-[11px]">{p.startDate} – {p.endDate}</span>
                </div>
                {p.description && <p className="text-xs text-gray-700 italic mt-0.5">{p.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
