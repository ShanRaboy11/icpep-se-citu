"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyAnnouncements = exports.getAnnouncementsByType = exports.togglePublishStatus = exports.deleteAnnouncement = exports.updateAnnouncement = exports.getAnnouncementById = exports.getAnnouncements = exports.createAnnouncement = void 0;
const announcement_1 = __importDefault(require("../models/announcement"));
const cloudinary_1 = require("../utils/cloudinary");
const mongoose_1 = __importDefault(require("mongoose"));
// Create a new announcement
const createAnnouncement = async (req, res, next) => {
    try {
        const { title, description, content, type, priority, targetAudience, isPublished, publishDate, expiryDate, time, location, organizer, contact, attendees, agenda, awardees, attachments, } = req.body;
        // Get author from authenticated user
        const author = req.user?.id;
        if (!author) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        // Handle image upload if present
        let imageUrl = null;
        if (req.file) {
            const result = await (0, cloudinary_1.uploadToCloudinary)(req.file.buffer, 'announcements');
            imageUrl = result.secure_url;
        }
        // Parse arrays if sent as strings
        const parsedAgenda = agenda ? JSON.parse(agenda) : undefined;
        const parsedAwardees = awardees ? JSON.parse(awardees) : undefined;
        const parsedAttachments = attachments ? JSON.parse(attachments) : undefined;
        const parsedTargetAudience = targetAudience ? JSON.parse(targetAudience) : ['all'];
        const announcement = await announcement_1.default.create({
            title,
            description,
            content,
            author,
            type,
            priority,
            targetAudience: parsedTargetAudience,
            isPublished: isPublished === 'true' || isPublished === true,
            publishDate: publishDate || Date.now(),
            expiryDate,
            time,
            location,
            organizer,
            contact,
            attendees,
            agenda: parsedAgenda,
            awardees: parsedAwardees,
            imageUrl,
            attachments: parsedAttachments,
        });
        await announcement.populate('author', 'firstName lastName studentNumber');
        res.status(201).json({
            success: true,
            message: 'Announcement created successfully',
            data: announcement,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createAnnouncement = createAnnouncement;
// Get all announcements (with filters)
const getAnnouncements = async (req, res, next) => {
    try {
        const { type, isPublished, targetAudience, priority, page = 1, limit = 10, sort = '-publishDate', } = req.query;
        const query = {};
        if (type)
            query.type = type;
        if (isPublished !== undefined)
            query.isPublished = isPublished === 'true';
        if (targetAudience)
            query.targetAudience = { $in: [targetAudience] };
        if (priority)
            query.priority = priority;
        // Don't show expired announcements by default
        query.$or = [
            { expiryDate: { $exists: false } },
            { expiryDate: null },
            { expiryDate: { $gt: new Date() } },
        ];
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        const announcements = await announcement_1.default.find(query)
            .populate('author', 'firstName lastName studentNumber')
            .sort(sort)
            .skip(skip)
            .limit(limitNum);
        const total = await announcement_1.default.countDocuments(query);
        res.status(200).json({
            success: true,
            data: announcements,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum),
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAnnouncements = getAnnouncements;
// Get single announcement by ID
const getAnnouncementById = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid announcement ID' });
            return;
        }
        const announcement = await announcement_1.default.findById(id).populate('author', 'firstName lastName studentNumber');
        if (!announcement) {
            res.status(404).json({ message: 'Announcement not found' });
            return;
        }
        // Increment views
        await announcement.incrementViews();
        res.status(200).json({
            success: true,
            data: announcement,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAnnouncementById = getAnnouncementById;
// Update announcement
const updateAnnouncement = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid announcement ID' });
            return;
        }
        const announcement = await announcement_1.default.findById(id);
        if (!announcement) {
            res.status(404).json({ message: 'Announcement not found' });
            return;
        }
        // Handle new image upload
        if (req.file) {
            // Delete old image if exists
            if (announcement.imageUrl) {
                await (0, cloudinary_1.deleteFromCloudinary)(announcement.imageUrl);
            }
            const result = await (0, cloudinary_1.uploadToCloudinary)(req.file.buffer, 'announcements');
            req.body.imageUrl = result.secure_url;
        }
        // Parse arrays if they are strings
        if (req.body.agenda && typeof req.body.agenda === 'string') {
            req.body.agenda = JSON.parse(req.body.agenda);
        }
        if (req.body.awardees && typeof req.body.awardees === 'string') {
            req.body.awardees = JSON.parse(req.body.awardees);
        }
        if (req.body.attachments && typeof req.body.attachments === 'string') {
            req.body.attachments = JSON.parse(req.body.attachments);
        }
        if (req.body.targetAudience && typeof req.body.targetAudience === 'string') {
            req.body.targetAudience = JSON.parse(req.body.targetAudience);
        }
        const updatedAnnouncement = await announcement_1.default.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }).populate('author', 'firstName lastName studentNumber');
        res.status(200).json({
            success: true,
            message: 'Announcement updated successfully',
            data: updatedAnnouncement,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateAnnouncement = updateAnnouncement;
// Delete announcement
const deleteAnnouncement = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid announcement ID' });
            return;
        }
        const announcement = await announcement_1.default.findById(id);
        if (!announcement) {
            res.status(404).json({ message: 'Announcement not found' });
            return;
        }
        // Delete image from cloudinary if exists
        if (announcement.imageUrl) {
            await (0, cloudinary_1.deleteFromCloudinary)(announcement.imageUrl);
        }
        await announcement.deleteOne();
        res.status(200).json({
            success: true,
            message: 'Announcement deleted successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteAnnouncement = deleteAnnouncement;
// Publish/Unpublish announcement
const togglePublishStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid announcement ID' });
            return;
        }
        const announcement = await announcement_1.default.findById(id);
        if (!announcement) {
            res.status(404).json({ message: 'Announcement not found' });
            return;
        }
        announcement.isPublished = !announcement.isPublished;
        // Set publish date when publishing for the first time
        if (announcement.isPublished && !announcement.publishDate) {
            announcement.publishDate = new Date();
        }
        await announcement.save();
        res.status(200).json({
            success: true,
            message: `Announcement ${announcement.isPublished ? 'published' : 'unpublished'} successfully`,
            data: announcement,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.togglePublishStatus = togglePublishStatus;
// Get announcements by type
const getAnnouncementsByType = async (req, res, next) => {
    try {
        const { type } = req.params;
        const { page = 1, limit = 10 } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        const announcements = await announcement_1.default.find({
            type,
            isPublished: true,
            $or: [
                { expiryDate: { $exists: false } },
                { expiryDate: null },
                { expiryDate: { $gt: new Date() } },
            ],
        })
            .populate('author', 'firstName lastName studentNumber')
            .sort('-publishDate')
            .skip(skip)
            .limit(limitNum);
        const total = await announcement_1.default.countDocuments({
            type,
            isPublished: true,
        });
        res.status(200).json({
            success: true,
            data: announcements,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum),
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAnnouncementsByType = getAnnouncementsByType;
// Get user's announcements (drafts and published)
const getMyAnnouncements = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const { page = 1, limit = 10, status } = req.query;
        const query = { author: userId };
        if (status === 'published') {
            query.isPublished = true;
        }
        else if (status === 'draft') {
            query.isPublished = false;
        }
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        const announcements = await announcement_1.default.find(query)
            .sort('-createdAt')
            .skip(skip)
            .limit(limitNum);
        const total = await announcement_1.default.countDocuments(query);
        res.status(200).json({
            success: true,
            data: announcements,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum),
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getMyAnnouncements = getMyAnnouncements;
