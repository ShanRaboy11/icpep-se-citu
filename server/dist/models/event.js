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
    o[k2] = k;
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

// Organizer subdocument schema
const organizerSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    role: String,
    imageUrl: String,
}, { _id: false });

const eventSchema = new mongoose_1.Schema({
    // Frontend expects: id (mapped from _id)
    title: {
        type: String,
        required: [true, 'Event title is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Event description is required'],
    },
    // Frontend expects: details (array of detail sections)
    details: [{
        title: String,
        content: String,
    }],
    // Frontend expects: tags (array of strings)
    tags: [String],
    eventType: {
        type: String,
        enum: ['workshop', 'seminar', 'competition', 'social', 'meeting', 'other'],
        default: 'other',
    },
    // Frontend expects: date (start date as string/Date)
    date: {
        type: Date,
        required: [true, 'Event date is required'],
    },
    // Frontend expects: endDate (optional, for multi-day events)
    endDate: Date,
    // Frontend expects: mode ("Online" | "In-person" | "Hybrid")
    mode: {
        type: String,
        enum: ['Online', 'In-person', 'Hybrid'],
        required: [true, 'Event mode is required'],
    },
    // Frontend expects: location (string)
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
    // Frontend expects: organizer (single object with name, role, imageUrl)
    organizer: organizerSchema,
    // Additional organizers reference (if needed for backend logic)
    organizerUsers: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    // Frontend expects: bannerImageUrl (single main image)
    bannerImageUrl: {
        type: String,
        required: [true, 'Banner image is required'],
    },
    // Frontend expects: galleryImageUrls (array, shown when status is "Ended")
    galleryImageUrls: [String],
    // Legacy images field (can be kept for backward compatibility)
    images: [String],
    coverImage: String,
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
    const endDate = this.endDate
        ? new Date(this.endDate)
        : new Date(startDate.getTime() + 24 * 60 * 60 * 1000 - 1);

    if (now < startDate) {
        return 'Upcoming';
    } else if (now >= startDate && now <= endDate) {
        return 'Ongoing';
    } else {
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

exports.default = mongoose_1.default.model('Event', eventSchema);