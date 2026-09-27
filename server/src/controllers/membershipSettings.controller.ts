import { Request, Response } from 'express';
import MembershipSettings from '../models/membershipSettings';

// There is only ever one settings document. findOne (rather than a fixed
// id) so it self-heals if the collection is ever empty — first read
// creates the default row instead of the page rendering blank.
const getOrCreateSettings = async () => {
  let settings = await MembershipSettings.findOne();
  if (!settings) {
    settings = await MembershipSettings.create({
      isOpen: true,
      registrationUrl: '',
    });
  }
  return settings;
};

export const getMembershipSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const settings = await getOrCreateSettings();
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch membership settings',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const updateMembershipSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { isOpen, registrationUrl } = req.body;
    const settings = await getOrCreateSettings();

    if (isOpen !== undefined) settings.isOpen = isOpen === true || isOpen === 'true';
    if (registrationUrl !== undefined) settings.registrationUrl = registrationUrl;

    const updated = await settings.save();

    res.status(200).json({
      success: true,
      message: 'Membership settings updated successfully',
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update membership settings',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
