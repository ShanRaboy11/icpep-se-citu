import { Request, Response } from 'express';
import OfficerTerm from '../models/officerTerm';
import { uploadToCloudinary } from '../utils/cloudinary';

export const createOfficerTerm = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      position,
      role,
      departmentType,
      committeeName,
      termYear,
      isActive,
      displayOrder,
    } = req.body;

    let imageUrl = '';
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, 'officer-terms');
      imageUrl = uploadResult.secure_url;
    }

    const created = await OfficerTerm.create({
      name,
      position,
      role: role || null,
      departmentType,
      committeeName: departmentType === 'committee' ? committeeName : null,
      termYear,
      image: imageUrl,
      isActive: isActive !== undefined ? isActive : true,
      displayOrder: displayOrder || 0,
    });

    res.status(201).json({
      success: true,
      message: 'Officer term created successfully',
      data: created,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create officer term',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Public: list published entries, optionally filtered by year / department
export const getOfficerTerms = async (req: Request, res: Response): Promise<void> => {
  try {
    const { year, departmentType, committeeName } = req.query;
    const query: Record<string, unknown> = { isActive: true };
    if (year) query.termYear = year;
    if (departmentType) query.departmentType = departmentType;
    if (committeeName) query.committeeName = committeeName;

    const terms = await OfficerTerm.find(query).sort({ displayOrder: 1, createdAt: -1 });
    res.status(200).json({ success: true, data: terms });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch officer terms',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Public: distinct academic years on record, newest first
export const getOfficerTermYears = async (req: Request, res: Response): Promise<void> => {
  try {
    const years = await OfficerTerm.distinct('termYear', { isActive: true });
    years.sort((a: string, b: string) => b.localeCompare(a));
    res.status(200).json({ success: true, data: years });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch officer term years',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getAllOfficerTerms = async (req: Request, res: Response): Promise<void> => {
  try {
    const terms = await OfficerTerm.find({}).sort({ termYear: -1, displayOrder: 1, createdAt: -1 });
    res.status(200).json({ success: true, data: terms });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch officer terms',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const updateOfficerTerm = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      name,
      position,
      role,
      departmentType,
      committeeName,
      termYear,
      isActive,
      displayOrder,
    } = req.body;

    const term = await OfficerTerm.findById(id);
    if (!term) {
      res.status(404).json({ success: false, message: 'Officer term not found' });
      return;
    }

    if (name) term.name = name;
    if (position) term.position = position;
    if (role !== undefined) term.role = role || null;
    if (departmentType) term.departmentType = departmentType;
    if (committeeName !== undefined) {
      term.committeeName = departmentType === 'committee' || term.departmentType === 'committee'
        ? committeeName
        : null;
    }
    if (termYear) term.termYear = termYear;
    if (isActive !== undefined) term.isActive = isActive === true || isActive === 'true';
    if (displayOrder !== undefined) term.displayOrder = displayOrder;

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, 'officer-terms');
      term.image = uploadResult.secure_url;
    }

    const updated = await term.save();
    res.status(200).json({
      success: true,
      message: 'Officer term updated successfully',
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update officer term',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const deleteOfficerTerm = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await OfficerTerm.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Officer term not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Officer term deleted successfully' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete officer term',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
