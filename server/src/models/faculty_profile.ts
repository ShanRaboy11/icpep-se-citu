import mongoose, { Document, Schema } from 'mongoose';

interface IYearOfService {
  year: string;
  role: string;
}

interface IEducation {
  degree: string;
  institution: string;
  year?: string;
}

export interface IFacultyProfile extends Document {
  name: string;
  role: 'department_head' | 'advisor' | 'faculty';
  department: string;
  bio?: string;
  image?: string;
  yearsOfService: IYearOfService[];
  education: IEducation[];
  specializations: string[];
  email?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const yearOfServiceSchema = new Schema<IYearOfService>(
  {
    year: { type: String, required: true },
    role: { type: String, required: true },
  },
  { _id: false }
);

const educationSchema = new Schema<IEducation>(
  {
    degree: { type: String, required: true },
    institution: { type: String, required: true },
    year: String,
  },
  { _id: false }
);

const facultyProfileSchema = new Schema<IFacultyProfile>(
  {
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['department_head', 'advisor', 'faculty'],
      required: true,
    },
    department: {
      type: String,
      default: 'Computer Engineering',
    },
    bio: String,
    image: String,
    yearsOfService: [yearOfServiceSchema],
    education: [educationSchema],
    specializations: [String],
    email: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Indexes
facultyProfileSchema.index({ role: 1, isActive: 1 });

export default mongoose.model<IFacultyProfile>('FacultyProfile', facultyProfileSchema);