"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMerch = exports.updateMerch = exports.getMerch = exports.createMerch = void 0;
const merch_1 = __importDefault(require("../models/merch"));
const cloudinary_1 = require("../utils/cloudinary");
const createMerch = async (req, res) => {
    try {
        const { name, description, orderLink, prices, isActive } = req.body;
        let imageUrl = '';
        if (req.file) {
            const uploadResult = await (0, cloudinary_1.uploadToCloudinary)(req.file.buffer, 'merch');
            imageUrl = uploadResult.secure_url;
        }
        // Parse prices if it comes as a string (from FormData)
        let parsedPrices = prices;
        if (typeof prices === 'string') {
            try {
                parsedPrices = JSON.parse(prices);
            }
            catch (e) {
                console.error('Error parsing prices:', e);
                parsedPrices = [];
            }
        }
        // ✅ FIX: Parse isActive properly from FormData
        // FormData sends everything as strings, so "false" becomes string "false"
        let parsedIsActive = true; // Default to true for new items
        if (isActive !== undefined) {
            if (typeof isActive === 'string') {
                parsedIsActive = isActive === 'true';
            }
            else {
                parsedIsActive = Boolean(isActive);
            }
        }
        const newMerch = new merch_1.default({
            name,
            description,
            orderLink,
            image: imageUrl,
            prices: parsedPrices,
            isActive: parsedIsActive,
        });
        const savedMerch = await newMerch.save();
        res.status(201).json({
            success: true,
            message: 'Merch created successfully',
            data: savedMerch,
        });
    }
    catch (error) {
        console.error('Error creating merch:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create merch',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.createMerch = createMerch;
const getMerch = async (req, res) => {
    try {
        const merch = await merch_1.default.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: merch,
        });
    }
    catch (error) {
        console.error('Error fetching merch:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch merch',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.getMerch = getMerch;
const updateMerch = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, orderLink, prices, isActive } = req.body;
        const merch = await merch_1.default.findById(id);
        if (!merch) {
            res.status(404).json({
                success: false,
                message: 'Merch not found',
            });
            return;
        }
        if (req.file) {
            // Delete old image if exists
            if (merch.image) {
                await (0, cloudinary_1.deleteFromCloudinary)(merch.image);
            }
            const uploadResult = await (0, cloudinary_1.uploadToCloudinary)(req.file.buffer, 'merch');
            merch.image = uploadResult.secure_url;
        }
        if (name)
            merch.name = name;
        if (description)
            merch.description = description;
        if (orderLink)
            merch.orderLink = orderLink;
        // ✅ FIX: Parse isActive properly from FormData
        if (isActive !== undefined) {
            if (typeof isActive === 'string') {
                merch.isActive = isActive === 'true';
            }
            else {
                merch.isActive = Boolean(isActive);
            }
        }
        if (prices) {
            let parsedPrices = prices;
            if (typeof prices === 'string') {
                try {
                    parsedPrices = JSON.parse(prices);
                }
                catch (e) {
                    console.error('Error parsing prices:', e);
                }
            }
            merch.prices = parsedPrices;
        }
        const updatedMerch = await merch.save();
        res.status(200).json({
            success: true,
            message: 'Merch updated successfully',
            data: updatedMerch,
        });
    }
    catch (error) {
        console.error('Error updating merch:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update merch',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.updateMerch = updateMerch;
const deleteMerch = async (req, res) => {
    try {
        const { id } = req.params;
        const merch = await merch_1.default.findById(id);
        if (!merch) {
            res.status(404).json({
                success: false,
                message: 'Merch not found',
            });
            return;
        }
        if (merch.image) {
            await (0, cloudinary_1.deleteFromCloudinary)(merch.image);
        }
        await merch_1.default.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: 'Merch deleted successfully',
        });
    }
    catch (error) {
        console.error('Error deleting merch:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete merch',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.deleteMerch = deleteMerch;
