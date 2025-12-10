import { Request, Response } from 'express';
import Sponsor from '../models/sponsor';
import { uploadToCloudinary } from '../utils/cloudinary';

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
    console.error('Error creating sponsor:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create sponsor',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
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
    console.error('Error fetching sponsors:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sponsors',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
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
    console.error('Error fetching all sponsors:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sponsors',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
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
    console.error('Error updating sponsor:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update sponsor',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
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
    console.error('Error deleting sponsor:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete sponsor',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
