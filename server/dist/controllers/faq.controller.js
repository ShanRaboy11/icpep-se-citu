"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFAQ = exports.updateFAQ = exports.getAllFAQs = exports.getFAQs = exports.createFAQ = void 0;
const faq_1 = __importDefault(require("../models/faq"));
const createFAQ = async (req, res) => {
    try {
        const { question, answer, category, isActive, displayOrder } = req.body;
        const newFAQ = new faq_1.default({
            question,
            answer,
            category,
            isActive: isActive !== undefined ? isActive : true,
            displayOrder: displayOrder || 0,
        });
        const savedFAQ = await newFAQ.save();
        res.status(201).json({
            success: true,
            message: 'FAQ created successfully',
            data: savedFAQ,
        });
    }
    catch (error) {
        console.error('Error creating FAQ:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create FAQ',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.createFAQ = createFAQ;
const getFAQs = async (req, res) => {
    try {
        const faqs = await faq_1.default.find({ isActive: true }).sort({ displayOrder: 1, createdAt: -1 });
        res.status(200).json({
            success: true,
            data: faqs,
        });
    }
    catch (error) {
        console.error('Error fetching FAQs:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch FAQs',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.getFAQs = getFAQs;
const getAllFAQs = async (req, res) => {
    try {
        const faqs = await faq_1.default.find().sort({ displayOrder: 1, createdAt: -1 });
        res.status(200).json({
            success: true,
            data: faqs,
        });
    }
    catch (error) {
        console.error('Error fetching all FAQs:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch all FAQs',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.getAllFAQs = getAllFAQs;
const updateFAQ = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedFAQ = await faq_1.default.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedFAQ) {
            res.status(404).json({
                success: false,
                message: 'FAQ not found',
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'FAQ updated successfully',
            data: updatedFAQ,
        });
    }
    catch (error) {
        console.error('Error updating FAQ:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update FAQ',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.updateFAQ = updateFAQ;
const deleteFAQ = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedFAQ = await faq_1.default.findByIdAndDelete(id);
        if (!deletedFAQ) {
            res.status(404).json({
                success: false,
                message: 'FAQ not found',
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'FAQ deleted successfully',
        });
    }
    catch (error) {
        console.error('Error deleting FAQ:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete FAQ',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.deleteFAQ = deleteFAQ;
