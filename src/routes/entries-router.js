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


// Get entries by user ID
/**
 * @api {get} /api/entries/user/:id Get Entries by User ID
 * @apiName GetEntriesByUserId
 * @apiGroup Entries
 *
 * @apiParam {Number} id User's unique ID.
 *
 * @apiSuccess {Object[]} entries List of entries for the user.
 * @apiSuccess {Number} entries.id Entry ID.
 * @apiSuccess {String} entries.entry_date Date of the entry.
 * @apiSuccess {String} entries.mood Mood recorded in the entry.
 * @apiSuccess {Number} entries.weight Weight recorded in the entry.
 * @apiSuccess {Number} entries.sleep_hours Hours of sleep recorded in the entry.
 * @apiSuccess {String} entries.notes Additional notes about the entry.
 *
 * @apiError {String} error No entries found for the user.
 */
entriesRouter.get('/user/:id', authenticateToken, getEntriesByUserId);

// Get entry by entry ID
/**
 * @api {get} /api/entries/:id Get Entry by ID
 * @apiName GetEntryById
 * @apiGroup Entries
 *
 * @apiParam {Number} id Entry unique ID.
 *
 * @apiSuccess {String} entry_date Date of the entry.
 * @apiSuccess {String} mood Mood recorded in the entry.
 * @apiSuccess {Number} weight Weight recorded in the entry.
 * @apiSuccess {Number} sleep_hours Hours of sleep recorded in the entry.
 * @apiSuccess {String} notes Additional notes about the entry.
 *
 * @apiError {String} error Entry not found.
 */
entriesRouter.get('/:id', authenticateToken, getEntriesById);

// Insert a new entry
/**
 * @api {post} /api/entries/insert Insert Entry
 * @apiName InsertEntry
 * @apiGroup Entries
 *
 * @apiBody {String} entry_date The date of the entry (ISO format).
 * @apiBody {String} mood Mood recorded in the entry.
 * @apiBody {Number} weight Weight recorded in the entry (2-200 kg).
 * @apiBody {Number} sleep_hours Hours of sleep recorded in the entry (2-200 hours).
 * @apiBody {String} notes Additional notes (max 1500 characters).
 *
 * @apiSuccess {Object} entry Created entry details.
 * @apiSuccess {Number} entry.id The newly created entry's ID.
 * @apiSuccess {String} entry.entry_date Date of the entry.
 * @apiSuccess {String} entry.mood Mood recorded in the entry.
 * @apiSuccess {Number} entry.weight Weight recorded.
 * @apiSuccess {Number} entry.sleep_hours Sleep hours recorded.
 * @apiSuccess {String} entry.notes Additional notes about the entry.
 *
 * @apiError {String} error Invalid input or validation errors.
 */
entriesRouter.post('/insert', authenticateToken,
  body('entry_date').notEmpty().isDate(),
  body('mood').notEmpty(),
  body('weight').notEmpty().isFloat({ min: 2, max: 200 }),
  body('sleep_hours').notEmpty().isFloat({ min: 2, max: 200 }),
  body('notes').isLength({ min: 3, max: 1500 }).escape(),
  validationErrorHandler,
  postEntry);

// Update entry by ID
/**
 * @api {put} /api/entries/:id Update Entry
 * @apiName UpdateEntry
 * @apiGroup Entries
 *
 * @apiParam {Number} id Entry unique ID.
 * @apiBody {String} [entry_date] The date of the entry (optional).
 * @apiBody {String} [title] Title of the entry (optional).
 * @apiBody {String} [content] Content of the entry (optional).
 *
 * @apiSuccess {Object} entry Updated entry details.
 * @apiSuccess {Number} entry.id The updated entry's ID.
 * @apiSuccess {String} entry.entry_date Date of the entry.
 * @apiSuccess {String} entry.mood Mood recorded.
 * @apiSuccess {Number} entry.weight Weight recorded.
 * @apiSuccess {Number} entry.sleep_hours Sleep hours recorded.
 * @apiSuccess {String} entry.notes Additional notes.
 *
 * @apiError {String} error Entry not found or invalid input.
 */
entriesRouter.put('/:id', authenticateToken,
  body('entry_date').optional().isDate().withMessage('Invalid date format'),
  body('mood').optional().notEmpty().withMessage('Mood cannot be empty'),
  body('weight').optional().isFloat({ min: 2, max: 200 }).withMessage('Weight must be between 2 and 200 kg'),
  body('sleep_hours').optional().isFloat({ min: 2, max: 200 }).withMessage('Sleep hours must be between 2 and 200 hours'),
  body('notes').optional().isLength({ min: 3, max: 1500 }).escape().withMessage('Notes must be between 3 and 1500 characters'),
  putEntry);

// Delete entry by ID
/**
 * @api {delete} /api/entries/:id Delete Entry
 * @apiName DeleteEntry
 * @apiGroup Entries
 *
 * @apiParam {Number} id Entry unique ID.
 *
 * @apiSuccess {String} message Entry deleted successfully.
 *
 * @apiError {String} error Entry not found.
 */
entriesRouter.delete('/:id', authenticateToken, deleteEntry);

export default entriesRouter;



