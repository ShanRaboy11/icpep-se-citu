"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTestimonial = exports.updateTestimonial = exports.getAllTestimonials = exports.getTestimonials = exports.createTestimonial = void 0;
const testimonial_1 = __importDefault(require("../models/testimonial"));
const cloudinary_1 = require("../utils/cloudinary");
const createTestimonial = async (req, res) => {
    try {
        const { name, role, quote, year, isActive, displayOrder } = req.body;
        let imageUrl = '';
        if (req.file) {
            const uploadResult = await (0, cloudinary_1.uploadToCloudinary)(req.file.buffer, 'testimonials');
            imageUrl = uploadResult.secure_url;
        }
        const newTestimonial = new testimonial_1.default({
            name,
            role,
            quote,
            image: imageUrl,
            year,
            isActive: isActive !== undefined ? isActive : true,
            displayOrder: displayOrder || 0,
        });
        const savedTestimonial = await newTestimonial.save();
        res.status(201).json({
            success: true,
            message: 'Testimonial created successfully',
            data: savedTestimonial,
        });
    }
    catch (error) {
        console.error('Error creating testimonial:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create testimonial',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.createTestimonial = createTestimonial;
const getTestimonials = async (req, res) => {
    try {
        const testimonials = await testimonial_1.default.find({ isActive: true }).sort({ displayOrder: 1, createdAt: -1 });
        res.status(200).json({
            success: true,
            data: testimonials,
        });
    }
    catch (error) {
        console.error('Error fetching testimonials:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch testimonials',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.getTestimonials = getTestimonials;
const getAllTestimonials = async (req, res) => {
    try {
        const testimonials = await testimonial_1.default.find({}).sort({ displayOrder: 1, createdAt: -1 });
        res.status(200).json({
            success: true,
            data: testimonials,
        });
    }
    catch (error) {
        console.error('Error fetching all testimonials:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch testimonials',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.getAllTestimonials = getAllTestimonials;
const updateTestimonial = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, role, quote, year, isActive, displayOrder } = req.body;
        const testimonial = await testimonial_1.default.findById(id);
        if (!testimonial) {
            res.status(404).json({ success: false, message: 'Testimonial not found' });
            return;
        }
        if (name)
            testimonial.name = name;
        if (role)
            testimonial.role = role;
        if (quote)
            testimonial.quote = quote;
        if (year)
            testimonial.year = year;
        if (isActive !== undefined)
            testimonial.isActive = isActive;
        if (displayOrder !== undefined)
            testimonial.displayOrder = displayOrder;
        if (req.file) {
            const uploadResult = await (0, cloudinary_1.uploadToCloudinary)(req.file.buffer, 'testimonials');
            testimonial.image = uploadResult.secure_url;
        }
        const updatedTestimonial = await testimonial.save();
        res.status(200).json({
            success: true,
            message: 'Testimonial updated successfully',
            data: updatedTestimonial,
        });
    }
    catch (error) {
        console.error('Error updating testimonial:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update testimonial',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.updateTestimonial = updateTestimonial;
const deleteTestimonial = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTestimonial = await testimonial_1.default.findByIdAndDelete(id);
        if (!deletedTestimonial) {
            res.status(404).json({ success: false, message: 'Testimonial not found' });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Testimonial deleted successfully',
        });
    }
    catch (error) {
        console.error('Error deleting testimonial:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete testimonial',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.deleteTestimonial = deleteTestimonial;
