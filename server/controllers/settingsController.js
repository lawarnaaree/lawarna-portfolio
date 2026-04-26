import { settingsModel } from '../models/settingsModel.js';

export const getSettings = async (req, res, next) => {
  try {
    const settings = await settingsModel.getAllSettings();
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const settings = req.body;
    if (typeof settings !== 'object' || settings === null) {
      res.status(400);
      throw new Error('Settings must be an object');
    }
    await settingsModel.updateSettings(settings);
    res.status(200).json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    next(error);
  }
};
