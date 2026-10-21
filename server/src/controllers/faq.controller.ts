import { Request, Response } from 'express';
import FAQ from '../models/faq';
import { MAX_FAQS, parseFaqInput } from '../utils/site-content';

export const createFAQ = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, isActive, displayOrder } = req.body;

    const parsed = parseFaqInput(req.body ?? {}, { partial: false });
    if ('error' in parsed) {
      res.status(400).json({ success: false, message: parsed.error });
      return;
    }

    if ((await FAQ.countDocuments()) >= MAX_FAQS) {
      res.status(400).json({ success: false, message: `You can have up to ${MAX_FAQS} FAQs. Remove one to add another.` });
      return;
    }

    const newFAQ = new FAQ({
      question: parsed.values.question,
      answer: parsed.values.answer,
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
    res.status(500).json({
      success: false,
      message: 'Failed to create FAQ',
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
    res.status(500).json({
      success: false,
      message: 'Failed to fetch FAQs',
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
    res.status(500).json({
      success: false,
      message: 'Failed to fetch all FAQs',
    });
  }
};

export const updateFAQ = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { category, isActive, displayOrder } = req.body ?? {};

    const parsed = parseFaqInput(req.body ?? {}, { partial: true });
    if ('error' in parsed) {
      res.status(400).json({ success: false, message: parsed.error });
      return;
    }

    const updateData: Record<string, unknown> = { ...parsed.values };
    if (category !== undefined) updateData.category = category;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;

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
    res.status(500).json({
      success: false,
      message: 'Failed to update FAQ',
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
    res.status(500).json({
      success: false,
      message: 'Failed to delete FAQ',
    });
  }
};
