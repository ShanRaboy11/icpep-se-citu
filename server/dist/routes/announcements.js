"use strict";
/* server/routes/announcementRoutes.ts
import express, { Request, Response } from 'express';
import Announcement from '../models/announcement';
import { auth, AuthRequest } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload';

const router = express.Router();

// Create announcement
router.post(
  '/',
  auth,
  upload.single('image'),
  async (req: AuthRequest, res: Response) => {
    try {
      const {
        title,
        description,
        content,
        type,
        priority,
        targetAudience,
        publishDate,
        expiryDate,
        time,
        location,
        organizer,
        contact,
        attendees,
        agenda,
        awardees,
        attachments,
      } = req.body;

      // Validate required fields
      if (!title || !description || !content) {
        return res.status(400).json({
          success: false,
          message: 'Title, description, and content are required',
        });
      }

      // Parse JSON strings if needed
      const parsedAwardees = awardees ? JSON.parse(awardees) : undefined;
      const parsedAttachments = attachments ? JSON.parse(attachments) : undefined;
      const parsedAgenda = agenda ? JSON.parse(agenda) : undefined;
      const parsedTargetAudience = targetAudience ? JSON.parse(targetAudience) : ['all'];

      const announcement = new Announcement({
        title,
        description,
        content,
        author: req.user._id,
        type: type || 'General',
        priority: priority || 'normal',
        targetAudience: parsedTargetAudience,
        publishDate: publishDate || Date.now(),
        expiryDate,
        time,
        location,
        organizer,
        contact,
        attendees,
        agenda: parsedAgenda,
        awardees: parsedAwardees,
        imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
        attachments: parsedAttachments,
        isPublished: true,
      });

      await announcement.save();

      res.status(201).json({
        success: true,
        message: 'Announcement created successfully',
        data: announcement,
      });
    } catch (error: any) {
      console.error('Create announcement error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create announcement',
        error: error.message,
      });
    }
  }
);

// Get all announcements
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      type,
      isPublished = 'true',
      page = 1,
      limit = 10,
    } = req.query;

    const query: any = {};
    
    if (type) query.type = type;
    if (isPublished) query.isPublished = isPublished === 'true';

    const announcements = await Announcement.find(query)
      .populate('author', 'name email')
      .sort({ publishDate: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Announcement.countDocuments(query);

    res.status(200).json({
      success: true,
      data: announcements,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    console.error('Get announcements error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch announcements',
      error: error.message,
    });
  }
});

// Get single announcement
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate('author', 'name email');

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found',
      });
    }

    // Increment views
    await announcement.incrementViews();

    res.status(200).json({
      success: true,
      data: announcement,
    });
  } catch (error: any) {
    console.error('Get announcement error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch announcement',
      error: error.message,
    });
  }
});

// Update announcement
router.put(
  '/:id',
  auth,
  upload.single('image'),
  async (req: AuthRequest, res: Response) => {
    try {
      const announcement = await Announcement.findById(req.params.id);

      if (!announcement) {
        return res.status(404).json({
          success: false,
          message: 'Announcement not found',
        });
      }

      // Check if user is the author
      if (announcement.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this announcement',
        });
      }

      const updateData: any = { ...req.body };

      // Parse JSON fields
      if (req.body.awardees) updateData.awardees = JSON.parse(req.body.awardees);
      if (req.body.attachments) updateData.attachments = JSON.parse(req.body.attachments);
      if (req.body.agenda) updateData.agenda = JSON.parse(req.body.agenda);
      if (req.body.targetAudience) updateData.targetAudience = JSON.parse(req.body.targetAudience);

      if (req.file) {
        updateData.imageUrl = `/uploads/${req.file.filename}`;
      }

      const updatedAnnouncement = await Announcement.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      );

      res.status(200).json({
        success: true,
        message: 'Announcement updated successfully',
        data: updatedAnnouncement,
      });
    } catch (error: any) {
      console.error('Update announcement error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update announcement',
        error: error.message,
      });
    }
  }
);

// Delete announcement
router.delete('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found',
      });
    }

    // Check if user is the author
    if (announcement.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this announcement',
      });
    }

    await announcement.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Announcement deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete announcement error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete announcement',
      error: error.message,
    });
  }
});

export default router; */ 
