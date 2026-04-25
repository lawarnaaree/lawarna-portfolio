import { generalModel } from '../models/generalModel.js';

export const getAbout = async (req, res, next) => {
  try {
    const data = await generalModel.getAbout();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateAbout = async (req, res, next) => {
  try {
    await generalModel.updateAbout(req.body);
    res.status(200).json({ success: true, message: 'About info updated' });
  } catch (error) {
    next(error);
  }
};

export const submitContact = async (req, res, next) => {
  try {
    await generalModel.createContact(req.body);
    res.status(201).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const data = await generalModel.getContacts();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getSettings = async (req, res, next) => {
  try {
    const data = await generalModel.getSettings();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateSetting = async (req, res, next) => {
  try {
    const { key, value } = req.body;
    await generalModel.updateSetting(key, value);
    res.status(200).json({ success: true, message: 'Setting updated' });
  } catch (error) {
    next(error);
  }
};
