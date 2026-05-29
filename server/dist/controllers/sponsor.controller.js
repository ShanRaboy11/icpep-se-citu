"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSponsor = exports.updateSponsor = exports.getAllSponsors = exports.getSponsors = exports.createSponsor = void 0;
const sponsor_1 = __importDefault(require("../models/sponsor"));
const cloudinary_1 = require("../utils/cloudinary");
const createSponsor = async (req, res) => {
    try {
        const { name, type, isActive, displayOrder } = req.body;
        let imageUrl = '';
        if (req.file) {
            const uploadResult = await (0, cloudinary_1.uploadToCloudinary)(req.file.buffer, 'sponsors');
            imageUrl = uploadResult.secure_url;
        }
        const newSponsor = new sponsor_1.default({
            name,
            type,
            image: imageUrl,
            isActive: isActive !== undefined ? isActive : true,
            displayOrder: displayOrder || 0,
        });
        const savedSponsor = await newSponsor.save();
        res.status(201).json({
            success: true,
            message: 'Sponsor created successfully',
            data: savedSponsor,
        });
    }
    catch (error) {
        console.error('Error creating sponsor:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create sponsor',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.createSponsor = createSponsor;
const getSponsors = async (req, res) => {
    try {
        const sponsors = await sponsor_1.default.find({ isActive: true }).sort({ displayOrder: 1, createdAt: -1 });
        res.status(200).json({
            success: true,
            data: sponsors,
        });
    }
    catch (error) {
        console.error('Error fetching sponsors:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch sponsors',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.getSponsors = getSponsors;
const getAllSponsors = async (req, res) => {
    try {
        const sponsors = await sponsor_1.default.find({}).sort({ displayOrder: 1, createdAt: -1 });
        res.status(200).json({
            success: true,
            data: sponsors,
        });
    }
    catch (error) {
        console.error('Error fetching all sponsors:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch sponsors',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.getAllSponsors = getAllSponsors;
const updateSponsor = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, type, isActive, displayOrder } = req.body;
        const sponsor = await sponsor_1.default.findById(id);
        if (!sponsor) {
            res.status(404).json({ success: false, message: 'Sponsor not found' });
            return;
        }
        if (name)
            sponsor.name = name;
        if (type)
            sponsor.type = type;
        if (isActive !== undefined)
            sponsor.isActive = isActive;
        if (displayOrder !== undefined)
            sponsor.displayOrder = displayOrder;
        if (req.file) {
            const uploadResult = await (0, cloudinary_1.uploadToCloudinary)(req.file.buffer, 'sponsors');
            sponsor.image = uploadResult.secure_url;
        }
        const updatedSponsor = await sponsor.save();
        res.status(200).json({
            success: true,
            message: 'Sponsor updated successfully',
            data: updatedSponsor,
        });
    }
    catch (error) {
        console.error('Error updating sponsor:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update sponsor',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.updateSponsor = updateSponsor;
const deleteSponsor = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedSponsor = await sponsor_1.default.findByIdAndDelete(id);
        if (!deletedSponsor) {
            res.status(404).json({ success: false, message: 'Sponsor not found' });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Sponsor deleted successfully',
        });
    }
    catch (error) {
        console.error('Error deleting sponsor:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete sponsor',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.deleteSponsor = deleteSponsor;
