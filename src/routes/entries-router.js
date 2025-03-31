import express from 'express';
import {
  getEntriesById,
  getEntriesByUserId,
  postEntry,
  putEntry,
  deleteEntry,
} from '../controllers/entries-controller.js';
import { authenticateToken } from '../../middlewares/authentication.js';
import { validationErrorHandler } from '../../middlewares/error-handler.js';
import { body } from 'express-validator';

const entriesRouter = express.Router();



entriesRouter.get('/user/:id', authenticateToken, getEntriesByUserId);

entriesRouter.get('/:id', authenticateToken, getEntriesById);

// Insert a new entry

entriesRouter.post('/insert', authenticateToken,
  body('entry_date').notEmpty().isDate(),
  body('time_of_day').notEmpty(),
  body('sleep_duration').notEmpty(),
  body('sleep_notes').notEmpty(),
  body('current_mood').notEmpty(),
  body('activity').notEmpty(),
  validationErrorHandler,
  postEntry);




entriesRouter.put('/:id', authenticateToken,
  body('entry_date').notEmpty().isDate().optional(),
  body('time_of_day').notEmpty().optional(),
  body('sleep_duration').notEmpty().optional(),
  body('sleep_notes').notEmpty().optional(),
  body('current_mood').notEmpty().optional(),
  body('activity').notEmpty().optional(),
  putEntry);


entriesRouter.delete('/:id', authenticateToken, deleteEntry);

export default entriesRouter;



