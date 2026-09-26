import { Request, Response } from 'express';
import MembershipTier from '../models/membershipTier';

export const createMembershipTier = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      planLabel,
      title,
      price,
      description,
      benefits,
      accentColor,
      isHighlighted,
      isActive,
      displayOrder,
    } = req.body;

    const created = await MembershipTier.create({
      planLabel,
      title,
      price,
      description,
      benefits: Array.isArray(benefits) ? benefits : [],
      accentColor,
      isHighlighted: isHighlighted === true || isHighlighted === 'true',
      isActive: isActive !== undefined ? isActive : true,
      displayOrder: displayOrder || 0,
    });

    res.status(201).json({
      success: true,
      message: 'Membership tier created successfully',
      data: created,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create membership tier',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Public: published tiers only, in display order
export const getMembershipTiers = async (req: Request, res: Response): Promise<void> => {
  try {
    const tiers = await MembershipTier.find({ isActive: true }).sort({
      displayOrder: 1,
      createdAt: 1,
    });
    res.status(200).json({ success: true, data: tiers });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch membership tiers',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getAllMembershipTiers = async (req: Request, res: Response): Promise<void> => {
  try {
    const tiers = await MembershipTier.find({}).sort({
      displayOrder: 1,
      createdAt: 1,
    });
    res.status(200).json({ success: true, data: tiers });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch membership tiers',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const updateMembershipTier = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      planLabel,
      title,
      price,
      description,
      benefits,
      accentColor,
      isHighlighted,
      isActive,
      displayOrder,
    } = req.body;

    const tier = await MembershipTier.findById(id);
    if (!tier) {
      res.status(404).json({ success: false, message: 'Membership tier not found' });
      return;
    }

    if (planLabel !== undefined) tier.planLabel = planLabel;
    if (title !== undefined) tier.title = title;
    if (price !== undefined) tier.price = price;
    if (description !== undefined) tier.description = description;
    if (Array.isArray(benefits)) tier.benefits = benefits;
    if (accentColor !== undefined) tier.accentColor = accentColor;
    if (isHighlighted !== undefined)
      tier.isHighlighted = isHighlighted === true || isHighlighted === 'true';
    if (isActive !== undefined) tier.isActive = isActive === true || isActive === 'true';
    if (displayOrder !== undefined) tier.displayOrder = displayOrder;

    const updated = await tier.save();

    res.status(200).json({
      success: true,
      message: 'Membership tier updated successfully',
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update membership tier',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const deleteMembershipTier = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await MembershipTier.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404).json({ success: false, message: 'Membership tier not found' });
      return;
    }

    res.status(200).json({ success: true, message: 'Membership tier deleted successfully' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete membership tier',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
