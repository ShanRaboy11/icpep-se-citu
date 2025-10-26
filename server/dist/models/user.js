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
        default: '123456', // Default password for all new users
        select: false, // Ensure password is not returned by default queries
    },
    role: {
        type: String,
        enum: ['member', 'non-member', 'council-officer', 'committee-officer', 'faculty'],
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
            enum: ['local', 'regional', 'both', null],
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
    // NEW FIELD: To track if it's the user's first login
    firstLogin: {
        type: Boolean,
        default: true, // New users will have this set to true
        select: false, // Optional: don't return by default with user queries
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
        const registrar = this.registeredBy as any; // Cast to any for easier property access
        return registrar.fullName || `${registrar.firstName} ${registrar.lastName}`;
    }
    return 'Self-registered';
});

// Pre-save middleware to hash password
userSchema.pre('save', async function (next) {
    // Only hash if the password field is new or has been modified
    if (!this.isModified('password'))
        return next();
    
    // Dynamically import bcryptjs
    const bcrypt = await Promise.resolve().then(() => __importStar(require('bcryptjs')));
    this.password = await bcrypt.hash(this.password, 10);
    
    // If the password is being changed from the default for the first time,
    // set firstLogin to false.
    // This is a subtle point: it will only trigger if 'password' is explicitly modified *after* creation.
    // A better approach for 'firstLogin' modification might be in the login route itself.
    // For now, let's keep it simple here and manage it primarily in your login/password update route.
    
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

// NEW STATIC METHOD: For checking password and managing firstLogin status
// This is not part of the schema itself, but a method you'd use on the User model
// (I'll put it after the model definition for clarity, but it's related to the logic)


// Indexes
userSchema.index({ studentNumber: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'membershipStatus.isMember': 1 });
userSchema.index({ 'membershipStatus.membershipType': 1 }); // NEW: Index for membership type filtering
userSchema.index({ createdAt: -1 }); // For sorting by registration date
userSchema.index({ updatedAt: -1 }); // For sorting by update date

const User = mongoose_1.default.model('User', userSchema);
exports.default = User;