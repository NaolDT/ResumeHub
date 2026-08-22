import React from 'react';
import { TemplateProps } from './types';
import { ATSFriendlyTemplate } from './ATSFriendlyTemplate';
import { ModernTemplate } from './ModernTemplate';
import { ExecutiveTemplate } from './ExecutiveTemplate';
import { CreativeTemplate } from './CreativeTemplate';
import { MinimalTemplate } from './MinimalTemplate';
import { AcademicTemplate } from './AcademicTemplate';

export const TemplateRenderer: React.FC<TemplateProps> = (props) => {
  switch (props.data.templateId) {
    case 'modern':
      return <ModernTemplate {...props} />;
    case 'executive':
      return <ExecutiveTemplate {...props} />;
    case 'creative':
      return <CreativeTemplate {...props} />;
    case 'minimal':
      return <MinimalTemplate {...props} />;
    case 'academic':
      return <AcademicTemplate {...props} />;
    case 'ats-friendly':
    default:
      return <ATSFriendlyTemplate {...props} />;
  }
};
