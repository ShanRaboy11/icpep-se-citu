"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        const conn = await mongoose_1.default.connect(process.env.MONGODB_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📦 Database: ${conn.connection.name}`);
        // Event listeners on the 'conn.connection' object
        conn.connection.on('error', (err) => {
            console.error(`❌ MongoDB connection error: ${err.message}`);
        });
        conn.connection.on('disconnected', () => {
            console.log('⚠️  MongoDB disconnected');
        });
    }
    catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};
exports.default = connectDB;
