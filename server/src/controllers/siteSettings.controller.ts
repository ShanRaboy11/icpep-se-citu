import { Request, Response } from 'express';
import SiteSettings from '../models/siteSettings';

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

// There is only ever one settings document. findOne (rather than a fixed
// id) so it self-heals if the collection is ever empty — first read
// creates the default row instead of the page rendering blank.
const getOrCreateSettings = async () => {
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create({});
  }
  return settings;
};

export const getSiteSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const settings = await getOrCreateSettings();
    res.status(200).json({
      success: true,
      data: {
        maintenanceMode: settings.maintenanceMode,
        maintenanceMessage: settings.maintenanceMessage,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch site settings',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const updateSiteSettings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { maintenanceMode, maintenanceMessage } = req.body;
    const settings = await getOrCreateSettings();

    if (maintenanceMode !== undefined) {
      settings.maintenanceMode = maintenanceMode === true || maintenanceMode === 'true';
    }
    if (maintenanceMessage !== undefined) {
      settings.maintenanceMessage = maintenanceMessage;
    }
    settings.updatedBy = req.user?.id as any;

    const updated = await settings.save();

    res.status(200).json({
      success: true,
      message: updated.maintenanceMode
        ? 'Maintenance mode is now on'
        : 'Maintenance mode is now off',
      data: {
        maintenanceMode: updated.maintenanceMode,
        maintenanceMessage: updated.maintenanceMessage,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update site settings',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
