import { Request, Response } from 'express';
import Sponsor from '../models/sponsor';
import { uploadToCloudinary } from '../utils/media/cloudinary';
import { respondWithError } from '../utils/http-error';

export const createSponsor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, type, isActive, displayOrder } = req.body;

    let imageUrl = '';

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, 'sponsors');
      imageUrl = uploadResult.secure_url;
    }

    const newSponsor = new Sponsor({
      name,
      type,
      image: imageUrl,
      isActive: isActive !== undefined ? isActive : true,
      displayOrder: displayOrder || 0,
    });

    const savedSponsor = await newSponsor.save();

    res.status(201).json({
      success: true,
      message: 'Sponsor created successfully',
      data: savedSponsor,
    });
  } catch (error) {
    respondWithError(res, error, 'Failed to create sponsor');
  }
};

export const getSponsors = async (req: Request, res: Response): Promise<void> => {
  try {
    const sponsors = await Sponsor.find({ isActive: true }).sort({ displayOrder: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      data: sponsors,
    });
  } catch (error) {
    respondWithError(res, error, 'Failed to fetch sponsors');
  }
};

export const getAllSponsors = async (req: Request, res: Response): Promise<void> => {
  try {
    const sponsors = await Sponsor.find({}).sort({ displayOrder: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      data: sponsors,
    });
  } catch (error) {
    respondWithError(res, error, 'Failed to fetch sponsors');
  }
};

export const updateSponsor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, type, isActive, displayOrder } = req.body;

    const sponsor = await Sponsor.findById(id);
    if (!sponsor) {
      res.status(404).json({ success: false, message: 'Sponsor not found' });
      return;
    }

    if (name) sponsor.name = name;
    if (type) sponsor.type = type;
    if (isActive !== undefined) sponsor.isActive = isActive;
    if (displayOrder !== undefined) sponsor.displayOrder = displayOrder;

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, 'sponsors');
      sponsor.image = uploadResult.secure_url;
    }

    const updatedSponsor = await sponsor.save();

    res.status(200).json({
      success: true,
      message: 'Sponsor updated successfully',
      data: updatedSponsor,
    });
  } catch (error) {
    respondWithError(res, error, 'Failed to update sponsor');
  }
};

export const deleteSponsor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedSponsor = await Sponsor.findByIdAndDelete(id);

    if (!deletedSponsor) {
      res.status(404).json({ success: false, message: 'Sponsor not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Sponsor deleted successfully',
    });
  } catch (error) {
    respondWithError(res, error, 'Failed to delete sponsor');
  }
};
