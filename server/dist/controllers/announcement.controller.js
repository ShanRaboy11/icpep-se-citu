"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyAnnouncements = exports.getAnnouncementsByType = exports.togglePublishStatus = exports.deleteAnnouncement = exports.updateAnnouncement = exports.getAnnouncementById = exports.getAnnouncements = exports.createAnnouncement = void 0;
const announcement_1 = __importDefault(require("../models/announcement"));
const cloudinary_1 = require("../utils/cloudinary");
const mongoose_1 = __importDefault(require("mongoose"));
const notification_1 = require("../utils/notification");
// Create a new announcement
const createAnnouncement = async (req, res, next) => {
    try {
        console.log("🔵 CREATE ANNOUNCEMENT - START");
        console.log("📦 Request body:", JSON.stringify(req.body, null, 2));
        console.log("📷 File present:", !!req.file);
        console.log("📷 Files present:", !!req.files && req.files.length);
        console.log("👤 User:", req.user);
        const { title, description, content, type, priority, targetAudience, isPublished, publishDate, date, expiryDate, time, location, organizer, contact, attendees, agenda, awardees, } = req.body;
        // Get author from authenticated user
        const author = req.user?.id;
        if (!author) {
            console.error("❌ No author ID found");
            res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
            return;
        }
        // Handle image upload(s) if present
        let imageUrl = null;
        let galleryImages = undefined;
        // Normalize multer files (can be array or object of arrays)
        const filesArray = Array.isArray(req.files)
            ? req.files
            : req.files && typeof req.files === "object"
                ? Object.values(req.files).flat()
                : [];
        if (filesArray.length > 0) {
            try {
                console.log(`📷 Uploading ${filesArray.length} image(s) to Cloudinary...`);
                const results = await (0, cloudinary_1.uploadMultipleToCloudinary)(filesArray, "announcements");
                const urls = results
                    .map((r) => r.secure_url)
                    .filter(Boolean);
                if (urls.length > 0) {
                    imageUrl = urls[0];
                    galleryImages = urls;
                }
                console.log("✅ Images uploaded:", urls);
            }
            catch (uploadError) {
                console.error("❌ Cloudinary upload failed:", uploadError);
                res.status(500).json({
                    success: false,
                    message: "Failed to upload image(s)",
                    error: uploadError instanceof Error
                        ? uploadError.message
                        : "Unknown error",
                });
                return;
            }
        }
        else if (req.file) {
            // Backwards compatibility for single-file uploads
            try {
                const fileBuf = req.file.buffer;
                if (!fileBuf) {
                    res
                        .status(400)
                        .json({ success: false, message: "Uploaded file has no data" });
                    return;
                }
                const result = await (0, cloudinary_1.uploadToCloudinary)(fileBuf, "announcements");
                imageUrl = result.secure_url;
                galleryImages = imageUrl ? [imageUrl] : undefined;
                console.log("✅ Image uploaded (single):", imageUrl);
            }
            catch (uploadError) {
                console.error("❌ Cloudinary upload failed:", uploadError);
                res
                    .status(500)
                    .json({
                    success: false,
                    message: "Failed to upload image",
                    error: uploadError instanceof Error
                        ? uploadError.message
                        : "Unknown error",
                });
                return;
            }
        }
        // Parse arrays if sent as strings with error handling
        let parsedAgenda, parsedAwardees, parsedTargetAudience;
        try {
            parsedAgenda = agenda ? JSON.parse(agenda) : undefined;
            parsedAwardees = awardees ? JSON.parse(awardees) : undefined;
            parsedTargetAudience = targetAudience
                ? JSON.parse(targetAudience)
                : ["all"];
        }
        catch (parseError) {
            console.error("❌ JSON parsing failed:", parseError);
            res.status(400).json({
                success: false,
                message: "Invalid JSON data in request",
                error: parseError instanceof Error ? parseError.message : "Unknown error",
            });
            return;
        }
        console.log("📝 Creating announcement with data:", {
            title,
            type,
            author,
            isPublished: String(isPublished) === "true",
            targetAudience: parsedTargetAudience,
            hasImage: !!imageUrl,
        });
        // Validate required fields
        if (!title || !description || !content) {
            console.error("❌ Missing required fields");
            res.status(400).json({
                success: false,
                message: "Missing required fields: title, description, or content",
            });
            return;
        }
        // Parse and normalize publishDate and date into Dates (if provided)
        const now = new Date();
        const parsedPublishDate = publishDate ? new Date(publishDate) : undefined;
        const parsedDate = date ? new Date(date) : undefined;
        const announcementData = {
            title,
            description,
            content,
            author,
            type,
            priority,
            targetAudience: parsedTargetAudience,
            // store a Date if provided, otherwise default to now
            publishDate: parsedPublishDate ?? new Date(),
            date: parsedDate ?? undefined,
            // initial isPublished flag based on incoming value; may be overridden below if scheduling
            isPublished: String(isPublished) === "true",
            expiryDate,
            time,
            location,
            organizer,
            contact,
            attendees,
            agenda: parsedAgenda,
            awardees: parsedAwardees,
            imageUrl,
            galleryImages,
        };
        // If a publishDate exists and it's in the future, ensure announcement remains unpublished until scheduler runs
        // BUT if the user explicitly set isPublished=false (draft), respect that regardless of date.
        // The logic below ensures that if it's a draft, it stays a draft.
        // If it's meant to be published, we check if it's scheduled for the future.
        if (announcementData.isPublished &&
            parsedPublishDate &&
            parsedPublishDate > now) {
            announcementData.isPublished = false;
            announcementData.scheduled = true;
        }
        else if (!announcementData.isPublished) {
            announcementData.scheduled = false;
        }
        console.log("📝 Final announcement data (publishDate/isPublished):", {
            publishDate: announcementData.publishDate,
            isPublished: announcementData.isPublished,
            scheduled: announcementData.scheduled,
        });
        // Enforce that published announcements must have at least one featured image
        const willBePublished = announcementData.isPublished === true;
        if (willBePublished &&
            !announcementData.imageUrl &&
            (!announcementData.galleryImages ||
                announcementData.galleryImages.length === 0)) {
            console.error("❌ Attempted to publish announcement without a featured image");
            res
                .status(400)
                .json({
                success: false,
                message: "A featured image is required when publishing an announcement.",
            });
            return;
        }
        console.log("💾 Saving to database...");
        const announcement = await announcement_1.default.create(announcementData);
        console.log("👥 Populating author...");
        await announcement.populate("author", "firstName lastName studentNumber");
        console.log("✅ Announcement created successfully:", announcement._id);
        // Send notification if published
        if (announcement.isPublished) {
            await (0, notification_1.notifyTargetAudience)(announcement.targetAudience || ["all"], `[ANNOUNCEMENT] ${announcement.title}`, `New announcement: ${announcement.title}`, "announcement", announcement._id, "Announcement", `/announcements/${announcement._id}`);
        }
        res.status(201).json({
            success: true,
            message: "Announcement created successfully",
            data: announcement,
        });
    }
    catch (error) {
        console.error("❌ FATAL ERROR in createAnnouncement:", error);
        console.error("Error stack:", error instanceof Error ? error.stack : "No stack");
        // Send error response
        res.status(500).json({
            success: false,
            message: "Failed to create announcement",
            error: error instanceof Error ? error.message : "Unknown error",
            ...(process.env.NODE_ENV === "development" && {
                stack: error instanceof Error ? error.stack : undefined,
            }),
        });
    }
};
exports.createAnnouncement = createAnnouncement;
// Get all announcements (with filters)
const getAnnouncements = async (req, res, next) => {
    try {
        const { type, isPublished, targetAudience, priority, page = 1, limit = 10, sort = "-publishDate", } = req.query;
        const query = {};
        if (type)
            query.type = type;
        if (isPublished !== undefined)
            query.isPublished = isPublished === "true";
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
            .populate("author", "firstName lastName studentNumber")
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
            res.status(400).json({ message: "Invalid announcement ID" });
            return;
        }
        const announcement = await announcement_1.default.findById(id).populate("author", "firstName lastName studentNumber");
        if (!announcement) {
            res.status(404).json({ message: "Announcement not found" });
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
            res.status(400).json({ message: "Invalid announcement ID" });
            return;
        }
        const announcement = await announcement_1.default.findById(id);
        if (!announcement) {
            res.status(404).json({ message: "Announcement not found" });
            return;
        }
        // Optional: Check if user is the author
        // if (announcement.author.toString() !== userId) {
        //     res.status(403).json({ message: 'Not authorized to update this announcement' });
        //     return;
        // }
        // Handle new image upload(s)
        // Normalize multer files (array or object)
        const incomingFiles = Array.isArray(req.files)
            ? req.files
            : req.files && typeof req.files === "object"
                ? Object.values(req.files).flat()
                : [];
        if (incomingFiles.length > 0) {
            // Delete old images if they exist
            if (announcement.galleryImages && announcement.galleryImages.length > 0) {
                for (const url of announcement.galleryImages) {
                    try {
                        await (0, cloudinary_1.deleteFromCloudinary)(url);
                    }
                    catch (err) {
                        console.warn("Failed to delete old announcement gallery image:", err);
                    }
                }
            }
            else if (announcement.imageUrl) {
                try {
                    await (0, cloudinary_1.deleteFromCloudinary)(announcement.imageUrl);
                }
                catch (err) {
                    console.warn("Failed to delete old announcement image:", err);
                }
            }
            // Upload new files
            const buffers = incomingFiles
                .filter((f) => !!f.buffer)
                .map((f) => ({ buffer: f.buffer }));
            if (buffers.length === 0) {
                res
                    .status(400)
                    .json({ success: false, message: "No valid file data to upload" });
                return;
            }
            const results = await (0, cloudinary_1.uploadMultipleToCloudinary)(buffers, "announcements");
            const urls = results.map((r) => r.secure_url).filter(Boolean);
            if (urls.length > 0) {
                req.body.galleryImages = JSON.stringify(urls);
                req.body.imageUrl = urls[0];
            }
        }
        // If the request is attempting to publish the announcement, ensure at least one image exists
        // But if the incoming publishDate is in the future, treat as scheduling (do not publish now)
        const incomingPublishDate = req.body.publishDate
            ? new Date(req.body.publishDate)
            : null;
        const requestWantsPublish = String(req.body.isPublished) === "true";
        // Create a clean update object
        const updateData = { ...req.body };
        if (requestWantsPublish &&
            incomingPublishDate &&
            incomingPublishDate > new Date()) {
            // ensure we don't publish immediately if scheduled for future
            updateData.isPublished = false;
            updateData.scheduled = true;
        }
        else if (!requestWantsPublish) {
            updateData.scheduled = false;
            // Explicitly set isPublished to false if it was sent as "false" string or boolean false
            if (req.body.isPublished !== undefined) {
                updateData.isPublished = false;
            }
        }
        else {
            // Publishing now
            updateData.isPublished = true;
            updateData.scheduled = false;
        }
        const existingHasImage = (announcement.imageUrl && announcement.imageUrl.length > 0) ||
            (announcement.galleryImages && announcement.galleryImages.length > 0);
        const incomingHasImage = (updateData.imageUrl && String(updateData.imageUrl).length > 0) ||
            (updateData.galleryImages && String(updateData.galleryImages).length > 0);
        if (requestWantsPublish && !existingHasImage && !incomingHasImage) {
            res
                .status(400)
                .json({
                success: false,
                message: "A featured image is required to publish an announcement.",
            });
            return;
        }
        // Parse arrays if they are strings
        if (updateData.agenda && typeof updateData.agenda === "string") {
            updateData.agenda = JSON.parse(updateData.agenda);
        }
        if (updateData.awardees && typeof updateData.awardees === "string") {
            updateData.awardees = JSON.parse(updateData.awardees);
        }
        if (updateData.attachments && typeof updateData.attachments === "string") {
            updateData.attachments = JSON.parse(updateData.attachments);
        }
        if (updateData.targetAudience &&
            typeof updateData.targetAudience === "string") {
            updateData.targetAudience = JSON.parse(updateData.targetAudience);
        }
        // Parse date string into Date for updates
        if (updateData.date && typeof updateData.date === "string") {
            try {
                updateData.date = new Date(updateData.date);
            }
            catch (e) {
                // leave as-is if parsing fails; validation will catch it
            }
        }
        // Ensure galleryImages is an array if it was stringified
        if (updateData.galleryImages &&
            typeof updateData.galleryImages === "string") {
            try {
                updateData.galleryImages = JSON.parse(updateData.galleryImages);
            }
            catch (e) {
                // ignore
            }
        }
        const updatedAnnouncement = await announcement_1.default.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).populate("author", "firstName lastName studentNumber");
        res.status(200).json({
            success: true,
            message: "Announcement updated successfully",
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
            res.status(400).json({ message: "Invalid announcement ID" });
            return;
        }
        const announcement = await announcement_1.default.findById(id);
        if (!announcement) {
            res.status(404).json({ message: "Announcement not found" });
            return;
        }
        // Optional: Check if user is the author
        // if (announcement.author.toString() !== userId) {
        //     res.status(403).json({ message: 'Not authorized to delete this announcement' });
        //     return;
        // }
        // Delete image(s) from cloudinary if exist
        if (announcement.galleryImages && announcement.galleryImages.length > 0) {
            for (const url of announcement.galleryImages) {
                try {
                    await (0, cloudinary_1.deleteFromCloudinary)(url);
                }
                catch (err) {
                    console.warn("Failed to delete announcement gallery image:", err);
                }
            }
        }
        else if (announcement.imageUrl) {
            await (0, cloudinary_1.deleteFromCloudinary)(announcement.imageUrl);
        }
        await announcement.deleteOne();
        res.status(200).json({
            success: true,
            message: "Announcement deleted successfully",
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
            res.status(400).json({ message: "Invalid announcement ID" });
            return;
        }
        const announcement = await announcement_1.default.findById(id);
        if (!announcement) {
            res.status(404).json({ message: "Announcement not found" });
            return;
        }
        // Optional: Check if user is the author
        // if (announcement.author.toString() !== userId) {
        //     res.status(403).json({ message: 'Not authorized to modify this announcement' });
        //     return;
        // }
        announcement.isPublished = !announcement.isPublished;
        // Set publish date when publishing for the first time
        if (announcement.isPublished && !announcement.publishDate) {
            announcement.publishDate = new Date();
        }
        await announcement.save();
        res.status(200).json({
            success: true,
            message: `Announcement ${announcement.isPublished ? "published" : "unpublished"} successfully`,
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
            .populate("author", "firstName lastName studentNumber")
            .sort("-publishDate")
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
        if (!userId) {
            res.status(401).json({ message: "User not authenticated" });
            return;
        }
        const query = { author: userId };
        if (status === "published") {
            query.isPublished = true;
        }
        else if (status === "draft") {
            query.isPublished = false;
        }
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        const announcements = await announcement_1.default.find(query)
            .populate("author", "firstName lastName studentNumber")
            .sort("-createdAt")
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
