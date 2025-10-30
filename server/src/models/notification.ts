import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId;
  type: 'announcement' | 'event' | 'membership' | 'system' | 'rsvp';
  title: string;
  message: string;
  relatedId?: mongoose.Types.ObjectId;
  relatedModel?: 'Announcement' | 'Event' | 'Membership' | null;
  isRead: boolean;
  readAt?: Date;
  link?: string;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['announcement', 'event', 'membership', 'system', 'rsvp'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedId: Schema.Types.ObjectId,
    relatedModel: {
      type: String,
      enum: ['Announcement', 'Event', 'Membership', null],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: Date,
    link: String,
  },
  { timestamps: true }
);

// Indexes
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1 });

export default mongoose.model<INotification>('Notification', notificationSchema);