import express from 'express';
import {
  getMetrics,
  getMetricById,
  postMetric,
  putMetric,
  deleteMetric,
} from '../controllers/metrics-controller.js';
import { authenticateToken } from '../../middlewares/authentication.js';
import { validationErrorHandler } from '../../middlewares/error-handler.js';
import { body } from 'express-validator';

const metricsRouter = express.Router();

metricsRouter.route('/')
  .get(authenticateToken, getMetrics);

metricsRouter.route('/:id')
  .get(getMetricById);

metricsRouter.post('/insert', authenticateToken,
  body('metric_date').notEmpty().isDate(),
  body('blood_pressure').optional().isString().isLength({ min: 3, max: 10 }),
  body('heart_rate').notEmpty().isInt({ min: 30, max: 250 }),
  body('notes').optional().isLength({ min: 3, max: 1500 }).escape(),
  validationErrorHandler,
  postMetric
);

metricsRouter.route('/:id')
  .put(authenticateToken,
    body('metric_date').optional().isDate(),
    body('blood_pressure').optional().matches(/^\d{2,3}\/\d{2,3}$/).withMessage('Blood pressure must be in format "120/80"'),
    body('heart_rate').optional().isInt({ min: 30, max: 250 }).withMessage('Heart rate must be between 30 and 250'),
    body('notes').optional().isLength({ min: 3, max: 1500 }).escape(),
    putMetric);

metricsRouter.route('/:id')
  .delete(authenticateToken, deleteMetric);

export default metricsRouter;
