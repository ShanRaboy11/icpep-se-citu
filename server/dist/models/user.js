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

const userSchema = new mongoose_1.Schema({
    studentNumber: {
        type: String,
        required: [true, 'Student number is required'],
        unique: true,
        trim: true,
        uppercase: true,
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
        select: false,
    },
    role: {
        type: String,
        enum: ['member', 'non-member', 'officer', 'faculty'],
        default: 'member',
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
}, {
    timestamps: true, // This automatically adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

// Virtual for full name
userSchema.virtual('fullName').get(function () {
    if (this.middleName) {
        return `${this.firstName} ${this.middleName} ${this.lastName}`;
    }
    return `${this.firstName} ${this.lastName}`;
});

// Virtual for registeredBy name (populated)
userSchema.virtual('registeredByName').get(function () {
    if (this.registeredBy && typeof this.registeredBy === 'object') {
        const registrar = this.registeredBy as any;
        return registrar.fullName || `${registrar.firstName} ${registrar.lastName}`;
    }
    return 'Self-registered';
});

// Pre-save middleware to hash password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    
    const bcrypt = await Promise.resolve().then(() => __importStar(require('bcryptjs')));
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Pre-save middleware to set membershipStatus based on role
userSchema.pre('save', function (next) {
    if (this.isNew && this.role === 'member') {
        this.membershipStatus.isMember = true;
    }
    else if (this.role === 'non-member') {
        this.membershipStatus.isMember = false;
        this.membershipStatus.membershipType = null;
    }
    next();
});

// Indexes
userSchema.index({ studentNumber: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'membershipStatus.isMember': 1 });
userSchema.index({ createdAt: -1 }); // For sorting by registration date
userSchema.index({ updatedAt: -1 }); // For sorting by update date

exports.default = mongoose_1.default.model('User', userSchema);