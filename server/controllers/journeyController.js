import { journeyModel } from '../models/journeyModel.js';

export const getJourney = async (req, res, next) => {
  try {
    const entries = await journeyModel.getAll();
    res.status(200).json({ success: true, count: entries.length, data: entries });
  } catch (error) {
    next(error);
  }
};

export const addJourneyEntry = async (req, res, next) => {
  try {
    const id = await journeyModel.create(req.body);
    res.status(201).json({ success: true, message: 'Entry added successfully', data: { id, ...req.body } });
  } catch (error) {
    next(error);
  }
};

export const updateJourneyEntry = async (req, res, next) => {
  try {
    const success = await journeyModel.update(req.params.id, req.body);
    if (!success) {
      res.status(404);
      throw new Error('Entry not found');
    }
    res.status(200).json({ success: true, message: 'Entry updated successfully' });
  } catch (error) {
    next(error);
  }
};

export const deleteJourneyEntry = async (req, res, next) => {
  try {
    const success = await journeyModel.delete(req.params.id);
    if (!success) {
      res.status(404);
      throw new Error('Entry not found');
    }
    res.status(200).json({ success: true, message: 'Entry deleted successfully' });
  } catch (error) {
    next(error);
  }
};
