import { Request, Response } from 'express';
import Advisor from '../models/advisor';
import { uploadToCloudinary } from '../utils/cloudinary';

export const createAdvisor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, position, yearRange, isCurrent, isActive, displayOrder } = req.body;

    let imageUrl = '';

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, 'advisors');
      imageUrl = uploadResult.secure_url;
    }

    const newAdvisor = new Advisor({
      name,
      position,
      yearRange,
      isCurrent: isCurrent === true || isCurrent === 'true',
      image: imageUrl,
      isActive: isActive !== undefined ? isActive : true,
      displayOrder: displayOrder || 0,
    });

    const savedAdvisor = await newAdvisor.save();

    res.status(201).json({
      success: true,
      message: 'Advisor created successfully',
      data: savedAdvisor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create advisor',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getAdvisors = async (req: Request, res: Response): Promise<void> => {
  try {
    const { current } = req.query;
    const query: Record<string, unknown> = { isActive: true };
    if (current === 'true') query.isCurrent = true;

    const advisors = await Advisor.find(query).sort({ displayOrder: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      data: advisors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch advisors',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getAllAdvisors = async (req: Request, res: Response): Promise<void> => {
  try {
    const advisors = await Advisor.find({}).sort({ displayOrder: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      data: advisors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch advisors',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const updateAdvisor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, position, yearRange, isCurrent, isActive, displayOrder } = req.body;

    const advisor = await Advisor.findById(id);
    if (!advisor) {
      res.status(404).json({ success: false, message: 'Advisor not found' });
      return;
    }

    if (name) advisor.name = name;
    if (position) advisor.position = position;
    if (yearRange) advisor.yearRange = yearRange;
    if (isCurrent !== undefined) advisor.isCurrent = isCurrent === true || isCurrent === 'true';
    if (isActive !== undefined) advisor.isActive = isActive === true || isActive === 'true';
    if (displayOrder !== undefined) advisor.displayOrder = displayOrder;

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, 'advisors');
      advisor.image = uploadResult.secure_url;
    }

    const updatedAdvisor = await advisor.save();

    res.status(200).json({
      success: true,
      message: 'Advisor updated successfully',
      data: updatedAdvisor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update advisor',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const deleteAdvisor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedAdvisor = await Advisor.findByIdAndDelete(id);

    if (!deletedAdvisor) {
      res.status(404).json({ success: false, message: 'Advisor not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Advisor deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete advisor',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
