import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  studentNumber: string; 
  lastName: string;
  firstName: string;
  middleName?: string; 
  password: string;
  role: 'member' | 'non-member' | 'officer' | 'faculty';
  department?: string;
  yearLevel?: number;
  membershipStatus: {
    isMember: boolean;
    membershipType?: 'local' | 'regional' | null;
    validUntil?: Date;
  };
  profilePicture?: string;
  isActive: boolean;
  registeredBy?: mongoose.Types.ObjectId;
  fullName: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    studentNumber: {
      type: String,
      required: [true, 'Student number is required'],
      unique: true,
      trim: true,
      uppercase: true, // Normalize to uppercase
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    middleName: {
      type: String,
      trim: true,
      default: null,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: ['member', 'non-member', 'officer', 'faculty'],
      default: 'member',
    },
    department: {
      type: String,
      default: 'Computer Engineering',
    },
    yearLevel: {
      type: Number,
      min: 1,
      max: 5,
    },
    membershipStatus: {
      isMember: { type: Boolean, default: false },
      membershipType: {
        type: String,
        enum: ['local', 'regional', null],
        default: null,
      },
      validUntil: Date,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    registeredBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for full name
userSchema.virtual('fullName').get(function (this: IUser) {
  if (this.middleName) {
    return `${this.firstName} ${this.middleName} ${this.lastName}`;
  }
  return `${this.firstName} ${this.lastName}`;
});

// Pre-save middleware to hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  // Hash password (you'll need to import bcrypt)
  const bcrypt = await import('bcryptjs');
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Pre-save middleware to set membershipStatus based on role
userSchema.pre('save', function (next) {
  if (this.isNew && this.role === 'member') {
    this.membershipStatus.isMember = true;
  } else if (this.role === 'non-member') {
    this.membershipStatus.isMember = false;
    this.membershipStatus.membershipType = null;
  }
  next();
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ studentNumber: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'membershipStatus.isMember': 1 });
userSchema.index({ registrationMethod: 1 });

export default mongoose.model<IUser>('User', userSchema);