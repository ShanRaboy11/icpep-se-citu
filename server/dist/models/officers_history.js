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
const officerSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    position: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        enum: ['executive', 'communications', 'technical', 'finance', 'logistics', 'creatives'],
        required: true,
    },
    bio: String,
    achievements: [String],
}, { _id: false });
const officersHistorySchema = new mongoose_1.Schema({
    academicYear: {
        type: String,
        required: true,
    },
    term: {
        type: String,
        enum: ['1st Semester', '2nd Semester', 'Summer', 'Full Year'],
        default: 'Full Year',
    },
    officers: [officerSchema],
    isCurrent: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
// Ensure only one current term
officersHistorySchema.pre('save', async function (next) {
    if (this.isCurrent) {
        // Type assertion to tell TypeScript this is a Mongoose model
        await this.constructor.updateMany({ _id: { $ne: this._id } }, { isCurrent: false });
    }
    next();
});
// Indexes
officersHistorySchema.index({ academicYear: 1, term: 1 });
officersHistorySchema.index({ isCurrent: 1 });
exports.default = mongoose_1.default.model('OfficersHistory', officersHistorySchema);
