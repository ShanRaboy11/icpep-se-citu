"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchNonOfficers = exports.updateOfficer = exports.getOfficers = void 0;
const user_1 = __importDefault(require("../models/user"));
const cloudinary_1 = require("../utils/cloudinary");
const getOfficers = async (req, res) => {
    try {
        const officers = await user_1.default.find({
            role: { $in: ["council-officer", "committee-officer"] },
        }).select("firstName lastName middleName role position department profilePicture email studentNumber yearLevel");
        res.status(200).json({ success: true, data: officers });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getOfficers = getOfficers;
const updateOfficer = async (req, res) => {
    try {
        const { id } = req.params;
        let { role, position, department, yearLevel, profilePicture } = req.body;
        // Handle Base64 Image Upload
        if (profilePicture && profilePicture.startsWith("data:image")) {
            try {
                // Extract base64 data
                const matches = profilePicture.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
                if (matches && matches.length === 3) {
                    const buffer = Buffer.from(matches[2], "base64");
                    const uploadResult = await (0, cloudinary_1.uploadToCloudinary)(buffer, "officers");
                    profilePicture = uploadResult.secure_url;
                }
            }
            catch (uploadError) {
                console.error("Image upload failed:", uploadError);
                // Continue without updating image if upload fails, or handle error
            }
        }
        const updateData = { role, position, department, yearLevel };
        if (profilePicture) {
            updateData.profilePicture = profilePicture;
        }
        const user = await user_1.default.findByIdAndUpdate(id, updateData, { new: true });
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, data: user });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateOfficer = updateOfficer;
const searchNonOfficers = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res
                .status(400)
                .json({ success: false, message: "Query parameter is required" });
        }
        const users = await user_1.default.find({
            role: { $nin: ["council-officer", "committee-officer"] },
            $or: [
                { firstName: { $regex: query, $options: "i" } },
                { lastName: { $regex: query, $options: "i" } },
                { studentNumber: { $regex: query, $options: "i" } },
            ],
        })
            .select("firstName lastName middleName studentNumber profilePicture email role")
            .limit(10);
        res.status(200).json({ success: true, data: users });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.searchNonOfficers = searchNonOfficers;
