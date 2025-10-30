"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const participantSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'attended'],
        default: 'pending',
    },
    rsvpDate: {
        type: Date,
        default: Date.now,
    },
}, { _id: false });
const organizerSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    role: String,
    imageUrl: String,
}, { _id: false });
const eventSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Event title is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Event description is required'],
    },
    details: [{
            title: String,
            content: String,
        }],
    tags: [String],
    eventType: {
        type: String,
        enum: ['workshop', 'seminar', 'competition', 'social', 'meeting', 'other'],
        default: 'other',
    },
    date: {
        type: Date,
        required: [true, 'Event date is required'],
    },
    endDate: Date,
    mode: {
        type: String,
        enum: ['Online', 'In-person', 'Hybrid'],
        required: [true, 'Event mode is required'],
    },
    location: {
        type: String,
        required: [true, 'Event location is required'],
    },
    venue: String,
    capacity: {
        type: Number,
        min: 0,
    },
    rsvpDeadline: Date,
    participants: [participantSchema],
    organizer: organizerSchema,
    organizerUsers: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    bannerImageUrl: {
        type: String,
        required: [true, 'Banner image is required'],
    },
    galleryImageUrls: [String],
    images: [String], // Legacy field
    coverImage: String, // Legacy field
    isPublished: {
        type: Boolean,
        default: false,
    },
    requiresApproval: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });
// Virtual for approved participants count
eventSchema.virtual('approvedCount').get(function () {
    return this.participants.filter((p) => p.status === 'approved').length;
});
// Virtual for dynamic status calculation (Upcoming | Ongoing | Ended)
eventSchema.virtual('status').get(function () {
    const now = new Date();
    const startDate = new Date(this.date);
    // If endDate is not provided, assume event lasts until the end of the start date's day
    const endDate = this.endDate
        ? new Date(this.endDate)
        : new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 23, 59, 59, 999); // End of the day
    if (now < startDate) {
        return 'Upcoming';
    }
    else if (now >= startDate && now <= endDate) {
        return 'Ongoing';
    }
    else {
        return 'Ended';
    }
});
// Ensure virtuals are included in JSON/Object output
eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });
// Indexes
eventSchema.index({ date: 1 });
eventSchema.index({ isPublished: 1, date: 1 });
eventSchema.index({ tags: 1 });
const Event = mongoose_1.default.model('Event', eventSchema);
exports.default = Event;
