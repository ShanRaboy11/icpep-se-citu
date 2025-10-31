import mongoose, { Document, Schema } from 'mongoose';

interface IPaymentDetails {
  amount: number;
  transactionId?: string;
  paymentDate?: Date;
  receiptUrl?: string;
}

export interface IMembership extends Document {
  user: mongoose.Types.ObjectId;
  membershipType: 'regular' | 'premium';
  academicYear: string;
  startDate: Date;
  expiryDate: Date;
  paymentStatus: 'pending' | 'paid' | 'expired';
  paymentDetails?: IPaymentDetails;
  benefits: string[];
  registeredBy?: mongoose.Types.ObjectId;
  registrationMethod: 'self' | 'bulk';
  createdAt: Date;
  updatedAt: Date;
}

const paymentDetailsSchema = new Schema<IPaymentDetails>(
  {
    amount: Number,
    transactionId: String,
    paymentDate: Date,
    receiptUrl: String,
  },
  { _id: false }
);

const membershipSchema = new Schema<IMembership>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    membershipType: {
      type: String,
      enum: ['regular', 'premium'],
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'expired'],
      default: 'pending',
    },
    paymentDetails: paymentDetailsSchema,
    benefits: [String],
    registeredBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    registrationMethod: {
      type: String,
      enum: ['self', 'bulk'],
      default: 'self',
    },
  },
  { timestamps: true }
);

// Indexes
membershipSchema.index({ user: 1 });
membershipSchema.index({ academicYear: 1, membershipType: 1 });

export default mongoose.model<IMembership>('Membership', membershipSchema);