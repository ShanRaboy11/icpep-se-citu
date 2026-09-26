import { Request, Response } from 'express';
import Faculty from '../models/faculty';
import { uploadToCloudinary } from '../utils/cloudinary';

export const createFaculty = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, position, isActive, displayOrder } = req.body;

    let imageUrl = '';

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, 'faculty');
      imageUrl = uploadResult.secure_url;
    }

    const newFaculty = new Faculty({
      name,
      position,
      image: imageUrl,
      isActive: isActive !== undefined ? isActive : true,
      displayOrder: displayOrder || 0,
    });

    const savedFaculty = await newFaculty.save();

    res.status(201).json({
      success: true,
      message: 'Faculty member created successfully',
      data: savedFaculty,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create faculty member',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getFaculty = async (req: Request, res: Response): Promise<void> => {
  try {
    const faculty = await Faculty.find({ isActive: true }).sort({ displayOrder: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      data: faculty,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch faculty',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getAllFaculty = async (req: Request, res: Response): Promise<void> => {
  try {
    const faculty = await Faculty.find({}).sort({ displayOrder: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      data: faculty,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch faculty',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const updateFaculty = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, position, isActive, displayOrder } = req.body;

    const faculty = await Faculty.findById(id);
    if (!faculty) {
      res.status(404).json({ success: false, message: 'Faculty member not found' });
      return;
    }

    if (name) faculty.name = name;
    if (position) faculty.position = position;
    if (isActive !== undefined) faculty.isActive = isActive === true || isActive === 'true';
    if (displayOrder !== undefined) faculty.displayOrder = displayOrder;

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, 'faculty');
      faculty.image = uploadResult.secure_url;
    }

    const updatedFaculty = await faculty.save();

    res.status(200).json({
      success: true,
      message: 'Faculty member updated successfully',
      data: updatedFaculty,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update faculty member',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const deleteFaculty = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedFaculty = await Faculty.findByIdAndDelete(id);

    if (!deletedFaculty) {
      res.status(404).json({ success: false, message: 'Faculty member not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Faculty member deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete faculty member',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
