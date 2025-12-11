import { Request, Response } from 'express';
import Partner from '../models/partner';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary';

export const createPartner = async (req: Request, res: Response) => {
  try {
    const { name, type, tier, description, website, displayOrder } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'Logo image is required' });
    }

    const uploadResult = await uploadToCloudinary(file.buffer, 'partners');

    const partner = new Partner({
      name,
      logo: uploadResult.secure_url,
      type: type || 'sponsor',
      tier: tier || 'bronze',
      description,
      website,
      displayOrder: displayOrder ? parseInt(displayOrder) : 0,
    });

    await partner.save();

    res.status(201).json(partner);
  } catch (error) {
    console.error('Error creating partner:', error);
    res.status(500).json({ message: 'Error creating partner' });
  }
};

export const getPartners = async (req: Request, res: Response) => {
  try {
    const { type } = req.query;
    const query = type ? { type } : {};
    
    const partners = await Partner.find(query).sort({ displayOrder: 1, createdAt: -1 });
    res.json(partners);
  } catch (error) {
    console.error('Error fetching partners:', error);
    res.status(500).json({ message: 'Error fetching partners' });
  }
};

export const updatePartner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, type, tier, description, website, displayOrder, isActive } = req.body;
    const file = req.file;

    const partner = await Partner.findById(id);
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }

    if (file) {
      // Delete old logo if it exists
      if (partner.logo) {
        await deleteFromCloudinary(partner.logo);
      }
      const uploadResult = await uploadToCloudinary(file.buffer, 'partners');
      partner.logo = uploadResult.secure_url;
    }

    if (name) partner.name = name;
    if (type) partner.type = type;
    if (tier) partner.tier = tier;
    if (description) partner.description = description;
    if (website) partner.website = website;
    if (displayOrder !== undefined) partner.displayOrder = parseInt(displayOrder);
    if (isActive !== undefined) partner.isActive = isActive === 'true' || isActive === true;

    await partner.save();

    res.json(partner);
  } catch (error) {
    console.error('Error updating partner:', error);
    res.status(500).json({ message: 'Error updating partner' });
  }
};

export const deletePartner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const partner = await Partner.findById(id);

    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }

    if (partner.logo) {
      await deleteFromCloudinary(partner.logo);
    }

    await Partner.findByIdAndDelete(id);

    res.json({ message: 'Partner deleted successfully' });
  } catch (error) {
    console.error('Error deleting partner:', error);
    res.status(500).json({ message: 'Error deleting partner' });
  }
};
