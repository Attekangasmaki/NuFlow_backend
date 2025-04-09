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

/* entriesRouter.get('/user/hrv/:id', authenticateToken, getHrvByUserId); */

entriesRouter.get('/:id', authenticateToken, getEntriesById);


// Insert a new entry

entriesRouter.post('/insert', authenticateToken,
  body('entry_date').notEmpty().withMessage('Entry date is required'),
  body('time_of_day').notEmpty().withMessage('Time of day is required').isIn(['morning', 'evening']).withMessage('Invalid time of day'),
  body('sleep_duration').notEmpty().withMessage('Sleep duration is required').isFloat({ min: 1, max: 5 }).withMessage('Sleep duration must be between 1 and 5'),
  body('sleep_notes').optional().isLength({ max: 500 }).withMessage('Sleep notes must be under 500 characters'),
  body('current_mood').notEmpty().withMessage('Mood is required').isFloat({ min: 1, max: 5 }).withMessage('Sleep duration must be between 1 and 5'),
  body('activity').optional().isLength({ max: 255 }).withMessage('Activity description too long'),
  validationErrorHandler,
  postEntry);

/* entriesRouter.post('/hrv', authenticateToken, validationErrorHandler, addHrvEntry); */


entriesRouter.put('/:id', authenticateToken,
  body('entry_date').optional().isDate().withMessage('Entry date must be a valid date (YYYY-MM-DD)'),
  body('time_of_day').optional() .isIn(['morning', 'evening']).withMessage('Time of day must be one of: morning, evening'),
  body('sleep_duration').optional().isFloat({ min: 1, max: 5 }).withMessage('Sleep duration must be between 1 and 5'),
  body('sleep_notes').optional().isLength({ max: 500 }).withMessage('Sleep notes must be less than 500 characters'),
  body('current_mood').optional().isFloat({ min: 1, max: 5 }).withMessage('Mood must be between 1 and 5'),
  body('activity').optional(),
  putEntry);


entriesRouter.delete('/:id', authenticateToken, deleteEntry);

export default entriesRouter;



