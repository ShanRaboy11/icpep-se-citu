import { Request, Response } from 'express';
import FAQ from '../models/faq';

export const createFAQ = async (req: Request, res: Response): Promise<void> => {
  try {
    const { question, answer, category, isActive, displayOrder } = req.body;

    const newFAQ = new FAQ({
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
  } catch (error) {
    console.error('Error creating FAQ:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create FAQ',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getFAQs = async (req: Request, res: Response): Promise<void> => {
  try {
    const faqs = await FAQ.find({ isActive: true }).sort({ displayOrder: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      data: faqs,
    });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch FAQs',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getAllFAQs = async (req: Request, res: Response): Promise<void> => {
  try {
    const faqs = await FAQ.find().sort({ displayOrder: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      data: faqs,
    });
  } catch (error) {
    console.error('Error fetching all FAQs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch all FAQs',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const updateFAQ = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedFAQ = await FAQ.findByIdAndUpdate(id, updateData, { new: true });

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
  } catch (error) {
    console.error('Error updating FAQ:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update FAQ',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const deleteFAQ = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const deletedFAQ = await FAQ.findByIdAndDelete(id);

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
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete FAQ',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
