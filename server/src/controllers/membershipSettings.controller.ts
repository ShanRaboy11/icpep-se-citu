import { Request, Response } from 'express';
import MembershipSettings from '../models/membershipSettings';
import { respondWithError } from '../utils/http-error';

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
    respondWithError(res, error, 'Failed to fetch membership settings');
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
    respondWithError(res, error, 'Failed to update membership settings');
  }
};
