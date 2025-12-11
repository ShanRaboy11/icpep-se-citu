import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

// Interface for User document
export interface IUser extends Document {
  _id: string;
  studentNumber: string;
  lastName: string;
  firstName: string;
  email?: string;
  middleName?: string;
  password: string;
  role: 'student' | 'council-officer' | 'committee-officer' | 'faculty';
  position?: string;
  yearLevel?: number;
  membershipStatus: {
    isMember: boolean;
    membershipType: "local" | "regional" | "both" | null;
    validUntil?: Date;
  };
  profilePicture?: string;
  isActive: boolean;
  registeredBy?: mongoose.Types.ObjectId | IUser;
  firstLogin: boolean;
  createdAt: Date;
  updatedAt: Date;
  fullName: string;
  registeredByName: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Interface for User Model with static methods
interface IUserModel extends Model<IUser> {
  // Add any static methods here if needed
}

const userSchema = new Schema<IUser>(
  {
    studentNumber: {
      type: String,
      required: [true, "Student number is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    middleName: {
      type: String,
      trim: true,
      default: null,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      default: "123456",
      select: false,
    },
    role: {
      type: String,
      enum: ["student", "council-officer", "committee-officer", "faculty"],
      default: "student",
    },
    position: {
      type: String,
      default: null,
    },
    department: {
      type: String,
      default: null,
    },
    position: {
      type: String,
      default: null,
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
        enum: ["local", "regional", "both", null],
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
      ref: "User",
      default: null,
    },
    firstLogin: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for full name
userSchema.virtual("fullName").get(function (this: IUser) {
  if (this.middleName) {
    return `${this.firstName} ${this.middleName} ${this.lastName}`;
  }
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for registeredBy name
userSchema.virtual("registeredByName").get(function (this: IUser) {
  if (this.registeredBy && typeof this.registeredBy === "object") {
    const registrar = this.registeredBy as IUser;
    return registrar.fullName || `${registrar.firstName} ${registrar.lastName}`;
  }
  return "Self-registered";
});

// Pre-save middleware to hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Indexes
// `unique: true` on studentNumber already creates an index — avoid duplicate index declarations
userSchema.index({ role: 1 });
userSchema.index({ "membershipStatus.isMember": 1 });
userSchema.index({ "membershipStatus.membershipType": 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ updatedAt: -1 });

const User = mongoose.model<IUser, IUserModel>("User", userSchema);

export default User;
