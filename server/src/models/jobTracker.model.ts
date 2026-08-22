import { Schema, model, Document, Types } from 'mongoose';

export interface IJobApplication extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  company: string;
  position: string;
  status: 'Applied' | 'Interviewing' | 'Offer' | 'Rejected' | 'Accepted';
  location?: string;
  salary?: string;
  notes?: string;
  appliedDate?: Date;
  nextStepDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const jobApplicationSchema = new Schema<IJobApplication>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    company: { type: String, required: true },
    position: { type: String, required: true },
    status: { type: String, enum: ['Applied', 'Interviewing', 'Offer', 'Rejected', 'Accepted'], default: 'Applied' },
    location: { type: String },
    salary: { type: String },
    notes: { type: String },
    appliedDate: { type: Date, default: Date.now },
    nextStepDate: { type: Date },
  },
  { timestamps: true }
);

export const JobApplication = model<IJobApplication>('JobApplication', jobApplicationSchema);
