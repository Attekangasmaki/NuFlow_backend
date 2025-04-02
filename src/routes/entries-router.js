import express from 'express';
import {
  getEntriesById,
  getEntriesByUserId,
  postEntry,
  putEntry,
  deleteEntry,
  getHrvByDate,
  addHrvEntry
} from '../controllers/entries-controller.js';
import { authenticateToken } from '../../middlewares/authentication.js';
import { validationErrorHandler } from '../../middlewares/error-handler.js';
import { body } from 'express-validator';

const entriesRouter = express.Router();



entriesRouter.get('/user/:id', authenticateToken, getEntriesByUserId);

entriesRouter.get('/:id', authenticateToken, getEntriesById);

entriesRouter.get('/hrv/:date', authenticateToken, getHrvByDate);

// Insert a new entry

entriesRouter.post('/insert', authenticateToken,
  body('entry_date').notEmpty().isDate(),
  body('time_of_day').notEmpty(),
  body('sleep_duration').notEmpty(),
  body('sleep_notes').optional(),
  body('current_mood').notEmpty(),
  body('activity').optional(),
  validationErrorHandler,
  postEntry);

entriesRouter.post('/hrv', authenticateToken, validationErrorHandler, addHrvEntry);


entriesRouter.put('/:id', authenticateToken,
  body('entry_date').optional().isDate(),
  body('time_of_day').optional(),
  body('sleep_duration').optional(),
  body('sleep_notes').optional(),
  body('current_mood').optional(),
  body('activity').optional(),
  putEntry);


entriesRouter.delete('/:id', authenticateToken, deleteEntry);

export default entriesRouter;



