import express from 'express';
import {
  getActivityById,
  postActivity,
  putActivity,
  deleteActivity,
  getActivityByUserId,
} from '../controllers/activities-controller.js';
import { authenticateToken } from '../../middlewares/authentication.js';
import { validationErrorHandler } from '../../middlewares/error-handler.js';
import { body } from 'express-validator';

const activitiesRouter = express.Router();

activitiesRouter.route('/')



// Get activities by user ID
/**
 * @api {get} /api/activities/user/:id Get Activities by User ID
 * @apiName GetActivitiesByUserId
 * @apiGroup Activities
 *
 * @apiParam {Number} id User's unique ID.
 *
 * @apiSuccess {Object[]} activities List of activities for the user.
 * @apiSuccess {Number} activities.id Activity ID.
 * @apiSuccess {String} activities.activity_type Type of activity.
 * @apiSuccess {String} activities.activity_date Date of the activity.
 * @apiSuccess {Number} activities.duration_minutes Duration in minutes.
 * @apiSuccess {Number} activities.calories_burned Calories burned in the activity.
 * @apiSuccess {String} activities.notes Notes about the activity.
 *
 * @apiError {String} error No activities found for the user.
 */
activitiesRouter.get('/user/:id', authenticateToken, getActivityByUserId);

// Get activity by activity ID
/**
 * @api {get} /api/activities/:id Get Activity by ID
 * @apiName GetActivityById
 * @apiGroup Activities
 *
 * @apiParam {Number} id Activity unique ID.
 *
 * @apiSuccess {String} activity_type Type of activity.
 * @apiSuccess {String} activity_date Date of the activity.
 * @apiSuccess {Number} duration_minutes Duration in minutes.
 * @apiSuccess {Number} calories_burned Calories burned in the activity.
 * @apiSuccess {String} notes Notes about the activity.
 *
 * @apiError {String} error Activity not found.
 */
activitiesRouter.get('/:id', authenticateToken, getActivityById);

// Insert a new activity
/**
 * @api {post} /api/activities/insert Insert Activity
 * @apiName InsertActivity
 * @apiGroup Activities
 *
 * @apiBody {String} activity_date The date of the activity (ISO format).
 * @apiBody {String} activity_type The type of activity.
 * @apiBody {Number} duration_minutes Duration of the activity in minutes.
 * @apiBody {Number} calories_burned Calories burned during the activity.
 * @apiBody {String} notes Notes about the activity.
 *
 * @apiSuccess {Object} activity Created activity details.
 * @apiSuccess {Number} activity.id The newly created activity's ID.
 * @apiSuccess {String} activity.activity_type The type of the activity.
 * @apiSuccess {String} activity.activity_date Date of the activity.
 * @apiSuccess {Number} activity.duration_minutes Duration in minutes.
 * @apiSuccess {Number} activity.calories_burned Calories burned.
 * @apiSuccess {String} activity.notes Notes about the activity.
 *
 * @apiError {String} error Invalid input or validation errors.
 */
activitiesRouter.post('/insert', authenticateToken,
  body('activity_date').notEmpty().isDate(),
  body('activity_type').notEmpty(),
  body('duration_minutes').notEmpty().isInt({ min: 2, max: 500 }),
  body('calories_burned').notEmpty().isInt({ min: 2, max: 5000 }),
  body('notes').isLength({ min: 3, max: 1500 }).escape(),
  validationErrorHandler,
  postActivity);

// Update activity by ID
/**
 * @api {put} /api/activities/:id Update Activity
 * @apiName UpdateActivity
 * @apiGroup Activities
 *
 * @apiParam {Number} id Activity unique ID.
 * @apiBody {String} [activity_date] The date of the activity (optional).
 * @apiBody {String} [activity_type] The type of activity (optional).
 * @apiBody {Number} [duration_minutes] Duration of the activity in minutes (optional).
 * @apiBody {Number} [calories_burned] Calories burned during the activity (optional).
 * @apiBody {String} [notes] Notes about the activity (optional).
 *
 * @apiSuccess {Object} activity Updated activity details.
 * @apiSuccess {Number} activity.id The updated activity's ID.
 * @apiSuccess {String} activity.activity_type The type of the activity.
 * @apiSuccess {String} activity.activity_date Date of the activity.
 * @apiSuccess {Number} activity.duration_minutes Duration in minutes.
 * @apiSuccess {Number} activity.calories_burned Calories burned.
 * @apiSuccess {String} activity.notes Notes about the activity.
 *
 * @apiError {String} error Activity not found or invalid input.
 */
activitiesRouter.put('/:id', authenticateToken,
  body('activity_date').optional().isDate().withMessage('Invalid date format'),
  body('activity_type').optional().notEmpty().withMessage('Activity type cannot be empty'),
  body('duration_minutes').optional().isInt({ min: 2, max: 500 }).withMessage('Duration must be between 2 and 500 minutes'),
  body('calories_burned').optional().isInt({ min: 2, max: 5000 }).withMessage('Calories burned must be between 2 and 5000'),
  body('notes').optional().isLength({ min: 3, max: 1500 }).escape().withMessage('Notes must be between 3 and 1500 characters'),
  putActivity);

// Delete activity by ID
/**
 * @api {delete} /api/activities/:id Delete Activity
 * @apiName DeleteActivity
 * @apiGroup Activities
 *
 * @apiParam {Number} id Activity unique ID.
 *
 * @apiSuccess {String} message Activity deleted successfully.
 *
 * @apiError {String} error Activity not found.
 */
activitiesRouter.delete('/:id', authenticateToken, deleteActivity);

export default activitiesRouter;
