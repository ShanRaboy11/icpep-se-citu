import { Request, Response } from 'express';
import SiteSettings from '../models/siteSettings';
import { CLOUDINARY_ENABLED, deleteFromCloudinary, isPdf, uploadDocumentToCloudinary, uploadToCloudinary } from '../utils/media/cloudinary';
import { recordAudit } from '../utils/audit';
import { parseContactUpdate, resolveContact } from '../utils/content/contact-settings';
import { SITE_PHOTO_FIELDS, isSitePhotoSection, normalizePhotos, parsePhotoSlot } from '../utils/content/site-content';

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

// There is only ever one settings document. findOne (rather than a fixed
// id) so it self-heals if the collection is ever empty — first read
// creates the default row instead of the page rendering blank.
export const getOrCreateSettings = async () => {
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
        primerUrl: settings.primerUrl,
        joinPhotos: normalizePhotos(settings.joinPhotos),
        aboutPhotos: normalizePhotos(settings.aboutPhotos),
        ...resolveContact(settings),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch site settings',
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
    });
  }
};

export const updatePrimer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const settings = await getOrCreateSettings();
    const { url, clear } = req.body ?? {};

    if (req.file) {
      if (!isPdf(req.file.buffer)) {
        res.status(400).json({ success: false, message: 'That file is not a PDF' });
        return;
      }
      settings.primerUrl = (await uploadDocumentToCloudinary(req.file.buffer, 'primer')).secure_url;
    } else if (clear === true || clear === 'true') {
      settings.primerUrl = '';
    } else if (typeof url === 'string' && url.trim()) {
      let link: URL;
      try {
        link = new URL(url.trim());
      } catch {
        res.status(400).json({ success: false, message: 'Enter a valid link' });
        return;
      }
      if (link.protocol !== 'https:') {
        res.status(400).json({ success: false, message: 'The link must start with https://' });
        return;
      }
      settings.primerUrl = link.toString();
    } else {
      res.status(400).json({ success: false, message: 'Upload a PDF or paste a link' });
      return;
    }

    settings.updatedBy = req.user?.id as any;
    await settings.save();
    await recordAudit({ action: 'site.primer', actorId: req.user?.id });

    res.status(200).json({
      success: true,
      message: settings.primerUrl ? 'Primer updated' : 'Primer reset to the default',
      data: { primerUrl: settings.primerUrl },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update the primer' });
  }
};

export const updateContact = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const parsed = parseContactUpdate(req.body ?? {});
    if ('error' in parsed) {
      res.status(400).json({ success: false, message: parsed.error });
      return;
    }

    const settings = await getOrCreateSettings();
    Object.assign(settings, parsed.values);
    settings.updatedBy = req.user?.id as any;
    await settings.save();
    await recordAudit({ action: 'site.contact', actorId: req.user?.id });

    res.status(200).json({
      success: true,
      message: 'Contact details updated',
      data: resolveContact(settings),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update contact details' });
  }
};

const resolveSlot = (req: Request) => {
  const { section, slot } = req.params;
  const index = parsePhotoSlot(slot);
  if (!isSitePhotoSection(section) || index === null) return null;
  return { section, index, field: SITE_PHOTO_FIELDS[section] };
};

export const setSitePhoto = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const target = resolveSlot(req);
    if (!target) {
      res.status(404).json({ success: false, message: 'Unknown photo slot' });
      return;
    }
    if (!req.file) {
      res.status(400).json({ success: false, message: 'Choose a photo to upload' });
      return;
    }
    if (!CLOUDINARY_ENABLED) {
      res.status(503).json({ success: false, message: 'Photo uploads are not set up on this server' });
      return;
    }

    let url: string;
    try {
      url = (await uploadToCloudinary(req.file.buffer, 'site')).secure_url;
    } catch {
      res.status(400).json({ success: false, message: 'That image could not be used. Upload a JPEG, PNG, WebP or GIF.' });
      return;
    }

    const settings = await getOrCreateSettings();
    const photos = normalizePhotos(settings[target.field]);
    const previous = photos[target.index];
    photos[target.index] = url;
    settings[target.field] = photos;
    settings.updatedBy = req.user?.id as any;
    await settings.save();
    await recordAudit({ action: 'site.photos', actorId: req.user?.id, details: { section: target.section, slot: target.index, change: 'set' } });
    if (previous) await deleteFromCloudinary(previous).catch(() => undefined);

    res.status(200).json({ success: true, message: 'Photo updated', data: { photos } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update the photo' });
  }
};

export const clearSitePhoto = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const target = resolveSlot(req);
    if (!target) {
      res.status(404).json({ success: false, message: 'Unknown photo slot' });
      return;
    }

    const settings = await getOrCreateSettings();
    const photos = normalizePhotos(settings[target.field]);
    const previous = photos[target.index];
    photos[target.index] = '';
    settings[target.field] = photos;
    settings.updatedBy = req.user?.id as any;
    await settings.save();
    await recordAudit({ action: 'site.photos', actorId: req.user?.id, details: { section: target.section, slot: target.index, change: 'clear' } });
    if (previous) await deleteFromCloudinary(previous).catch(() => undefined);

    res.status(200).json({ success: true, message: 'Photo reset to the default', data: { photos } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to reset the photo' });
  }
};
