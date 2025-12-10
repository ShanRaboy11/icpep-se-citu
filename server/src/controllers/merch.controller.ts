import { Request, Response } from 'express';
import Merch from '../models/merch';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary';

export const createMerch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, orderLink, prices, isActive } = req.body;

    let imageUrl = '';

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, 'merch');
      imageUrl = uploadResult.secure_url;
    }

    // Parse prices if it comes as a string (from FormData)
    let parsedPrices = prices;
    if (typeof prices === 'string') {
      try {
        parsedPrices = JSON.parse(prices);
      } catch (e) {
        console.error('Error parsing prices:', e);
        parsedPrices = [];
      }
    }

    const newMerch = new Merch({
      name,
      description,
      orderLink,
      image: imageUrl,
      prices: parsedPrices,
      isActive: isActive !== undefined ? isActive : true,
    });

    const savedMerch = await newMerch.save();

    res.status(201).json({
      success: true,
      message: 'Merch created successfully',
      data: savedMerch,
    });
  } catch (error) {
    console.error('Error creating merch:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create merch',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getMerch = async (req: Request, res: Response): Promise<void> => {
  try {
    const merch = await Merch.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: merch,
    });
  } catch (error) {
    console.error('Error fetching merch:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch merch',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const updateMerch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, orderLink, prices, isActive } = req.body;

    const merch = await Merch.findById(id);

    if (!merch) {
      res.status(404).json({
        success: false,
        message: 'Merch not found',
      });
      return;
    }

    if (req.file) {
      // Delete old image if exists
      if (merch.image) {
        await deleteFromCloudinary(merch.image);
      }
      const uploadResult = await uploadToCloudinary(req.file.buffer, 'merch');
      merch.image = uploadResult.secure_url;
    }

    if (name) merch.name = name;
    if (description) merch.description = description;
    if (orderLink) merch.orderLink = orderLink;
    if (isActive !== undefined) merch.isActive = isActive;

    if (prices) {
      let parsedPrices = prices;
      if (typeof prices === 'string') {
        try {
          parsedPrices = JSON.parse(prices);
        } catch (e) {
          console.error('Error parsing prices:', e);
        }
      }
      merch.prices = parsedPrices;
    }

    const updatedMerch = await merch.save();

    res.status(200).json({
      success: true,
      message: 'Merch updated successfully',
      data: updatedMerch,
    });
  } catch (error) {
    console.error('Error updating merch:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update merch',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const deleteMerch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const merch = await Merch.findById(id);

    if (!merch) {
      res.status(404).json({
        success: false,
        message: 'Merch not found',
      });
      return;
    }

    if (merch.image) {
      await deleteFromCloudinary(merch.image);
    }

    await Merch.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Merch deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting merch:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete merch',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
