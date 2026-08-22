import { Schema, model, Document, Types } from 'mongoose';

export type TemplateId = 'ats-friendly' | 'modern' | 'executive' | 'creative' | 'minimal' | 'academic';

export interface IPersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
}

export interface IWorkExperience {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  description?: string;
  bullets: string[];
}

export interface IEducation {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  gpa?: string;
}

export interface ISkillGroup {
  id: string;
  category: string;
  items: string[];
}

export interface ICertification {
  id: string;
  name: string;
  issuer: string;
  date?: string;
  url?: string;
}

export interface IProject {
  id: string;
  name: string;
  role?: string;
  link?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  highlights: string[];
}

export interface ILanguage {
  id: string;
  name: string;
  proficiency: string;
}

export interface IAward {
  id: string;
  title: string;
  issuer: string;
  date?: string;
  summary?: string;
}

export interface IReference {
  id: string;
  name: string;
  position: string;
  company: string;
  contact?: string;
}

export interface ICustomItem {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  description?: string;
}

export interface IResumeSection {
  id: string;
  type:
    | 'personal'
    | 'summary'
    | 'experience'
    | 'education'
    | 'skills'
    | 'certifications'
    | 'projects'
    | 'languages'
    | 'awards'
    | 'references'
    | 'custom';
  title: string;
  isVisible: boolean;
  order: number;
  content: any;
}

export interface IResume extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
  templateId: TemplateId;
  fontFamily: string;
  colorTheme: string;
  fontSize: string;
  lineSpacing: string;
  isPublic: boolean;
  publicSlug: string;
  viewsCount: number;
  downloadsCount: number;
  sections: IResumeSection[];
  createdAt: Date;
  updatedAt: Date;
}

const resumeSectionSchema = new Schema<IResumeSection>(
  {
    id: { type: String, required: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    isVisible: { type: Boolean, default: true },
    order: { type: Number, required: true },
    content: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: false },
);

const resumeSchema = new Schema<IResume>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, default: 'Untitled Resume' },
    templateId: {
      type: String,
      enum: ['ats-friendly', 'modern', 'executive', 'creative', 'minimal', 'academic'],
      default: 'ats-friendly',
    },
    fontFamily: { type: String, default: 'inter' },
    colorTheme: { type: String, default: 'slate' },
    fontSize: { type: String, default: 'medium' },
    lineSpacing: { type: String, default: 'normal' },
    isPublic: { type: Boolean, default: false },
    publicSlug: { type: String, sparse: true, unique: true, index: true },
    viewsCount: { type: Number, default: 0 },
    downloadsCount: { type: Number, default: 0 },
    sections: [resumeSectionSchema],
  },
  { timestamps: true },
);

export const Resume = model<IResume>('Resume', resumeSchema);
