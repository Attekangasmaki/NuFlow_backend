import express from 'express';
import {
  getEntries,
  getEntryById,
  postEntry,
  putEntry,
  deleteEntry,
} from '../controllers/entries-controller.js';
import { authenticateToken } from '../../middlewares/authentication.js';
import { validationErrorHandler } from '../../middlewares/error-handler.js';
import { body } from 'express-validator';

const entriesRouter = express.Router();

entriesRouter.route('/')
  .get(authenticateToken, getEntries)


entriesRouter.route('/:id')
.get(getEntryById)

entriesRouter.post('/insert', authenticateToken,
  body('entry_date').notEmpty().isDate(),
  body('mood').notEmpty(),
  body('weight').notEmpty().isFloat({min: 2, max: 200}),
  body('sleep_hours').notEmpty().isInt({min: 2, max: 200}),
  body('notes').isLength({min: 3, max: 1500}).escape(),
  validationErrorHandler,
  postEntry);

entriesRouter.route('/:id')
.put(authenticateToken,
    body('entry_date').optional().isDate().withMessage('Invalid date format'),
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('content').optional().isLength({ min: 5, max: 5000 }).withMessage('Content must be between 5 and 5000 characters'),
    putEntry)

entriesRouter.route('/:id')
.delete(authenticateToken, deleteEntry)

export default entriesRouter;



