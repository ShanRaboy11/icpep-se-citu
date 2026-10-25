import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Advisor from '../models/advisor';
import Faculty from '../models/faculty';
import { respondWithError } from '../utils/http-error';

const FACULTY_FIELDS = 'name image gender';

interface LinkedFaculty {
  _id?: unknown;
  name?: string;
  image?: string;
  gender?: string | null;
}

interface PlainAdvisor {
  faculty?: LinkedFaculty | unknown;
  name?: string;
  image?: string;
  gender?: string | null;
  [key: string]: unknown;
}

const present = (advisor: PlainAdvisor | { toObject: () => PlainAdvisor }) => {
  const plain: PlainAdvisor = typeof (advisor as { toObject?: unknown }).toObject === "function" ? (advisor as { toObject: () => PlainAdvisor }).toObject() : (advisor as PlainAdvisor);
  const member = plain.faculty && typeof plain.faculty === "object" ? (plain.faculty as LinkedFaculty) : null;
  return {
    ...plain,
    faculty: member ? member._id : plain.faculty ?? null,
    name: member?.name ?? plain.name,
    image: member?.image || plain.image,
    gender: member?.gender ?? plain.gender ?? null,
  };
};

const linkFaculty = async (facultyId: unknown) => {
  if (typeof facultyId !== 'string' || !mongoose.Types.ObjectId.isValid(facultyId)) return null;
  return Faculty.findById(facultyId).select(FACULTY_FIELDS);
};

export const createAdvisor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, position, yearRange, isCurrent, isActive, displayOrder } = req.body;

    const member = await linkFaculty(req.body.faculty);
    if (!member && !name) {
      res.status(400).json({ success: false, message: 'Choose a faculty member for this advisor' });
      return;
    }

    const saved = await new Advisor({
      faculty: member?._id ?? null,
      name: member?.name ?? name,
      image: member?.image ?? '',
      gender: member?.gender ?? null,
      position,
      yearRange,
      isCurrent: isCurrent === true || isCurrent === 'true',
      isActive: isActive !== undefined ? isActive : true,
      displayOrder: displayOrder || 0,
    }).save();
    await saved.populate('faculty', FACULTY_FIELDS);

    res.status(201).json({
      success: true,
      message: 'Advisor created successfully',
      data: present(saved),
    });
  } catch (error) {
    respondWithError(res, error, 'Failed to create advisor');
  }
};

export const getAdvisors = async (req: Request, res: Response): Promise<void> => {
  try {
    const { current } = req.query;
    const query: Record<string, unknown> = { isActive: true };
    if (current === 'true') query.isCurrent = true;

    const advisors = await Advisor.find(query)
      .populate('faculty', FACULTY_FIELDS)
      .sort({ displayOrder: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      data: advisors.map(present),
    });
  } catch (error) {
    respondWithError(res, error, 'Failed to fetch advisors');
  }
};

export const getAllAdvisors = async (req: Request, res: Response): Promise<void> => {
  try {
    const advisors = await Advisor.find({})
      .populate('faculty', FACULTY_FIELDS)
      .sort({ displayOrder: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      data: advisors.map(present),
    });
  } catch (error) {
    respondWithError(res, error, 'Failed to fetch advisors');
  }
};

export const updateAdvisor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { position, yearRange, isCurrent, isActive, displayOrder } = req.body;

    const advisor = await Advisor.findById(id);
    if (!advisor) {
      res.status(404).json({ success: false, message: 'Advisor not found' });
      return;
    }

    if (req.body.faculty !== undefined) {
      const member = await linkFaculty(req.body.faculty);
      if (member) {
        advisor.faculty = member._id as mongoose.Types.ObjectId;
        advisor.name = member.name;
        advisor.image = member.image ?? '';
        advisor.gender = member.gender ?? null;
      } else if (req.body.faculty === '') {
        advisor.faculty = null;
      } else {
        res.status(400).json({ success: false, message: 'That faculty member no longer exists' });
        return;
      }
    }

    if (position) advisor.position = position;
    if (yearRange) advisor.yearRange = yearRange;
    if (isCurrent !== undefined) advisor.isCurrent = isCurrent === true || isCurrent === 'true';
    if (isActive !== undefined) advisor.isActive = isActive === true || isActive === 'true';
    if (displayOrder !== undefined) advisor.displayOrder = displayOrder;

    const updated = await advisor.save();
    await updated.populate('faculty', FACULTY_FIELDS);

    res.status(200).json({
      success: true,
      message: 'Advisor updated successfully',
      data: present(updated),
    });
  } catch (error) {
    respondWithError(res, error, 'Failed to update advisor');
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
    respondWithError(res, error, 'Failed to delete advisor');
  }
};
