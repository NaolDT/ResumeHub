export type TemplateId = 'ats-friendly' | 'modern' | 'executive' | 'creative' | 'minimal' | 'academic';

export interface ResumeData {
  _id?: string;
  title: string;
  templateId: TemplateId;
  fontFamily: string;
  colorTheme: string;
  fontSize: string;
  lineSpacing: string;
  isPublic?: boolean;
  publicSlug?: string;
  sections: Array<{
    id: string;
    type: string;
    title: string;
    isVisible: boolean;
    order: number;
    content: any;
  }>;
}

export interface TemplateProps {
  data: ResumeData;
}
