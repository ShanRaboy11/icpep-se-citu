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
const attachmentSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    url: { type: String, required: true },
    fileType: String,
}, { _id: false });
const awardeeSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    program: String,
    year: { type: String, required: true },
    award: { type: String, required: true },
}, { _id: false });
const announcementSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        maxlength: [300, 'Description cannot exceed 300 characters'],
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
    },
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        enum: ['Event', 'Award', 'Workshop', 'Meeting', 'Seminar', 'Achievement', 'General'],
        default: 'General',
        required: true,
    },
    priority: {
        type: String,
        enum: ['normal', 'important', 'urgent'],
        default: 'normal',
    },
    targetAudience: [
        {
            type: String,
            enum: ['all', 'members', 'officers', 'faculty'],
            default: 'all',
        },
    ],
    isPublished: {
        type: Boolean,
        default: false,
    },
    publishDate: {
        type: Date,
        default: Date.now,
    },
    expiryDate: Date,
    // Event/Meeting specific fields
    time: {
        type: String,
        trim: true,
    },
    location: {
        type: String,
        trim: true,
    },
    organizer: {
        type: String,
        trim: true,
    },
    contact: {
        type: String,
        trim: true,
    },
    attendees: {
        type: String,
        trim: true,
    },
    agenda: [String],
    // Award specific fields
    awardees: [awardeeSchema],
    // Media
    imageUrl: {
        type: String,
        default: null,
    },
    attachments: [attachmentSchema],
    views: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
// Indexes
announcementSchema.index({ publishDate: -1 });
announcementSchema.index({ isPublished: 1, publishDate: -1 });
announcementSchema.index({ type: 1 });
announcementSchema.index({ targetAudience: 1 });
// Virtual to check if announcement is expired
announcementSchema.virtual('isExpired').get(function () {
    if (!this.expiryDate)
        return false;
    return new Date() > this.expiryDate;
});
// Virtual to format date
announcementSchema.virtual('formattedDate').get(function () {
    return this.publishDate?.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }) || '';
});
// Method to increment views
announcementSchema.methods.incrementViews = function () {
    this.views = (this.views || 0) + 1;
    return this.save();
};
const Announcement = mongoose_1.default.model('Announcement', announcementSchema);
exports.default = Announcement;
