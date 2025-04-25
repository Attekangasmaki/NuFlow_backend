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


/**
 * @api {get} /entries/user/:id Get all entries by user ID
 * @apiName GetEntriesByUserId
 * @apiGroup Entries
 * @apiPermission user
 *
 * @apiParam {String} id User's unique ID.
 *
 * @apiSuccess {Object[]} entries Array of entry objects.
 * @apiError (404) NotFound No entries found for user.
 * @apiError (401) Unauthorized Missing or invalid token.
 */
entriesRouter.get('/user', authenticateToken, getEntriesByUserId);


/**
 * @api {get} /entries/:id Get a single entry by ID
 * @apiName GetEntryById
 * @apiGroup Entries
 * @apiPermission user
 *
 * @apiParam {String} id Entry's unique ID.
 *
 * @apiSuccess {Object} entry Entry object.
 * @apiError (404) NotFound Entry not found.
 * @apiError (401) Unauthorized Missing or invalid token.
 */
entriesRouter.get('/:id', authenticateToken, getEntriesById);


/**
 * @api {post} /entries/insert Create a new daily entry
 * @apiName PostEntry
 * @apiGroup Entries
 * @apiPermission user
 *
 * @apiBody {String} entry_date Entry date (required, format YYYY-MM-DD).
 * @apiBody {String="morning","evening"} time_of_day Time of day (required).
 * @apiBody {Float{1-5}} sleep_duration Sleep duration in hours (required, 1-5).
 * @apiBody {String{..500}} [sleep_notes] Notes about sleep (optional).
 * @apiBody {Float{1-5}} current_mood Mood score (required, 1-5).
 * @apiBody {String{..255}} [activity] Notes on activity (optional).
 *
 * @apiSuccess (201) {Object} entry Created entry object.
 * @apiError (400) Validation error.
 * @apiError (401) Unauthorized Missing or invalid token.
 */
entriesRouter.post('/insert', authenticateToken,
  body('entry_date').notEmpty().withMessage('Entry date is required'),
  body('time_of_day').notEmpty().withMessage('Time of day is required').isIn(['morning', 'evening']).withMessage('Invalid time of day'),
  body('sleep_duration').notEmpty().withMessage('Sleep duration is required').isFloat({ min: 1, max: 5 }).withMessage('Sleep duration must be between 1 and 5'),
  body('sleep_notes').optional(),
  body('current_mood').notEmpty().withMessage('Mood is required').isFloat({ min: 1, max: 5 }).withMessage('Sleep duration must be between 1 and 5'),
  body('activity').optional(),
  validationErrorHandler,
  postEntry);



/**
 * @api {put} /entries/:id Update an existing entry
 * @apiName PutEntry
 * @apiGroup Entries
 * @apiPermission user
 *
 * @apiParam {String} id Entry's unique ID.
 *
 * @apiBody {String} [entry_date] Entry date (YYYY-MM-DD).
 * @apiBody {String="morning","evening"} [time_of_day] Time of day.
 * @apiBody {Float{1-5}} [sleep_duration] Sleep duration in hours.
 * @apiBody {String{..500}} [sleep_notes] Notes about sleep.
 * @apiBody {Float{1-5}} [current_mood] Mood score.
 * @apiBody {String} [activity] Notes on activity.
 *
 * @apiSuccess {Object} entry Updated entry object.
 * @apiError (400) Validation error.
 * @apiError (404) NotFound Entry not found.
 * @apiError (401) Unauthorized Missing or invalid token.
 */
entriesRouter.put('/:id', authenticateToken,
  body('entry_date').optional().isDate().withMessage('Entry date must be a valid date (YYYY-MM-DD)'),
  body('time_of_day').optional() .isIn(['morning', 'evening']).withMessage('Time of day must be one of: morning, evening'),
  body('sleep_duration').optional().isFloat({ min: 1, max: 5 }).withMessage('Sleep duration must be between 1 and 5'),
  body('sleep_notes').optional(),
  body('current_mood').optional().isFloat({ min: 1, max: 5 }).withMessage('Mood must be between 1 and 5'),
  body('activity').optional(),
  putEntry);

/**
 * @api {delete} /entries/:id Delete an entry by ID
 * @apiName DeleteEntry
 * @apiGroup Entries
 * @apiPermission user
 *
 * @apiParam {String} id Entry's unique ID.
 *
 * @apiSuccess {String} message Entry deleted successfully.
 * @apiError (404) NotFound Entry not found.
 * @apiError (401) Unauthorized Missing or invalid token.
 */
entriesRouter.delete('/:id', authenticateToken, deleteEntry);

export default entriesRouter;



