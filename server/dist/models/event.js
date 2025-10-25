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
    eventType: {
        type: String,
        enum: ['workshop', 'seminar', 'competition', 'social', 'meeting', 'other'],
        default: 'other',
    },
    dateTime: {
        start: {
            type: Date,
            required: [true, 'Start date is required'],
        },
        end: Date,
    },
    location: String,
    venue: String,
    capacity: {
        type: Number,
        min: 0,
    },
    rsvpDeadline: Date,
    participants: [participantSchema],
    organizers: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
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
// Indexes
eventSchema.index({ 'dateTime.start': 1 });
eventSchema.index({ isPublished: 1, 'dateTime.start': 1 });
exports.default = mongoose_1.default.model('Event', eventSchema);
