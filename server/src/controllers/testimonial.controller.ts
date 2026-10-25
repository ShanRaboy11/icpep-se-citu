import { Request, Response } from 'express';
import Testimonial from '../models/testimonial';
import { uploadToCloudinary } from '../utils/media/cloudinary';
import { respondWithError } from '../utils/http-error';

export const createTestimonial = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, role, quote, year, isActive, displayOrder } = req.body;

    let imageUrl = '';

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, 'testimonials');
      imageUrl = uploadResult.secure_url;
    }

    const newTestimonial = new Testimonial({
      name,
      role,
      quote,
      image: imageUrl,
      year,
      isActive: isActive !== undefined ? isActive : true,
      displayOrder: displayOrder || 0,
    });

    const savedTestimonial = await newTestimonial.save();

    res.status(201).json({
      success: true,
      message: 'Testimonial created successfully',
      data: savedTestimonial,
    });
  } catch (error) {
    respondWithError(res, error, 'Failed to create testimonial');
  }
};

export const getTestimonials = async (req: Request, res: Response): Promise<void> => {
  try {
    const testimonials = await Testimonial.find({ isActive: true }).sort({ displayOrder: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      data: testimonials,
    });
  } catch (error) {
    respondWithError(res, error, 'Failed to fetch testimonials');
  }
};

export const getAllTestimonials = async (req: Request, res: Response): Promise<void> => {
  try {
    const testimonials = await Testimonial.find({}).sort({ displayOrder: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      data: testimonials,
    });
  } catch (error) {
    respondWithError(res, error, 'Failed to fetch testimonials');
  }
};

export const updateTestimonial = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, role, quote, year, isActive, displayOrder } = req.body;

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      res.status(404).json({ success: false, message: 'Testimonial not found' });
      return;
    }

    if (name) testimonial.name = name;
    if (role) testimonial.role = role;
    if (quote) testimonial.quote = quote;
    if (year) testimonial.year = year;
    if (isActive !== undefined) testimonial.isActive = isActive;
    if (displayOrder !== undefined) testimonial.displayOrder = displayOrder;

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, 'testimonials');
      testimonial.image = uploadResult.secure_url;
    }

    const updatedTestimonial = await testimonial.save();

    res.status(200).json({
      success: true,
      message: 'Testimonial updated successfully',
      data: updatedTestimonial,
    });
  } catch (error) {
    respondWithError(res, error, 'Failed to update testimonial');
  }
};

export const deleteTestimonial = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedTestimonial = await Testimonial.findByIdAndDelete(id);

    if (!deletedTestimonial) {
      res.status(404).json({ success: false, message: 'Testimonial not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Testimonial deleted successfully',
    });
  } catch (error) {
    respondWithError(res, error, 'Failed to delete testimonial');
  }
};
