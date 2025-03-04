import express from 'express';
import {
  getActivityById,
  postActivity,
  putActivity,
  deleteActivity,
} from '../controllers/activities-controller.js';
import { authenticateToken } from '../../middlewares/authentication.js';
import { validationErrorHandler } from '../../middlewares/error-handler.js';
import { body } from 'express-validator';

const activitiesRouter = express.Router();

activitiesRouter.route('/')



activitiesRouter.route('/:id')
.get(getActivityById)

activitiesRouter.post('/insert', authenticateToken,
  body('activity_date').notEmpty().isDate(),
  body('activity_type').notEmpty(),
  body('duration_minutes').notEmpty().isInt({min: 2, max: 500}),
  body('calories_burned').notEmpty().isInt({min: 2, max: 5000}),
  body('notes').isLength({min: 3, max: 1500}).escape(),
  validationErrorHandler,
  postActivity);

activitiesRouter.route('/:id')
.put(authenticateToken,
    body('activity_date').optional().isDate().withMessage('Invalid date format'),
    body('activity_type').optional().notEmpty().withMessage('Activity type cannot be empty'),
    body('duration_minutes').optional().isInt({ min: 2, max: 500 }).withMessage('Duration must be between 2 and 500 minutes'),
    body('calories_burned').optional().isInt({ min: 2, max: 5000 }).withMessage('Calories burned must be between 2 and 5000'),
    body('notes').optional().isLength({ min: 3, max: 1500 }).escape().withMessage('Notes must be between 3 and 1500 characters'),
   putActivity)

activitiesRouter.route('/:id')
.delete(authenticateToken, deleteActivity)

export default activitiesRouter;
