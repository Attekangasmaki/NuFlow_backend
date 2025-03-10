import express from 'express';
import {
  getMetricById,
  postMetric,
  putMetric,
  deleteMetric,
  getMetricByUserId,
} from '../controllers/metrics-controller.js';
import { authenticateToken } from '../../middlewares/authentication.js';
import { validationErrorHandler } from '../../middlewares/error-handler.js';
import { body } from 'express-validator';

const metricsRouter = express.Router();



// Get metric by ID
/**
 * @api {get} /api/metrics/:id Get Metric by ID
 * @apiName GetMetricById
 * @apiGroup Metrics
 *
 * @apiParam {Number} id Metric unique ID.
 *
 * @apiSuccess {String} metric_date Date of the metric entry.
 * @apiSuccess {String} blood_pressure Blood pressure recorded in the entry.
 * @apiSuccess {Number} heart_rate Heart rate recorded in beats per minute.
 * @apiSuccess {String} notes Additional notes about the metric entry.
 *
 * @apiError {String} error Metric not found.
 */
metricsRouter.route('/:id')
  .get(authenticateToken, getMetricById);

// Get metrics by user ID
/**
 * @api {get} /api/metrics/user/:id Get Metrics by User ID
 * @apiName GetMetricsByUserId
 * @apiGroup Metrics
 *
 * @apiParam {Number} id User's unique ID.
 *
 * @apiSuccess {Object[]} metrics List of metrics for the user.
 * @apiSuccess {String} metrics.metric_date Date of the metric entry.
 * @apiSuccess {String} metrics.blood_pressure Blood pressure recorded.
 * @apiSuccess {Number} metrics.heart_rate Heart rate recorded.
 * @apiSuccess {String} metrics.notes Additional notes about the metric entry.
 *
 * @apiError {String} error No metrics found for the user.
 */
metricsRouter.get('/user/:id', authenticateToken, getMetricByUserId);

// Insert a new metric
/**
 * @api {post} /api/metrics/insert Insert Metric
 * @apiName InsertMetric
 * @apiGroup Metrics
 *
 * @apiBody {String} metric_date The date of the metric entry (ISO format).
 * @apiBody {String} [blood_pressure] Blood pressure recorded in the format "120/80".
 * @apiBody {Number} heart_rate The heart rate recorded in beats per minute (30-250).
 * @apiBody {String} [notes] Additional notes (max 1500 characters).
 *
 * @apiSuccess {Object} metric Created metric details.
 * @apiSuccess {Number} metric.id The newly created metric's ID.
 * @apiSuccess {String} metric.metric_date Date of the metric entry.
 * @apiSuccess {String} metric.blood_pressure Blood pressure recorded.
 * @apiSuccess {Number} metric.heart_rate Heart rate recorded.
 * @apiSuccess {String} metric.notes Additional notes about the metric entry.
 *
 * @apiError {String} error Invalid input or validation errors.
 */
metricsRouter.post('/insert', authenticateToken,
  body('metric_date').notEmpty().isDate(),
  body('blood_pressure').optional().isString().isLength({ min: 3, max: 10 }),
  body('heart_rate').notEmpty().isInt({ min: 30, max: 250 }),
  body('notes').optional().isLength({ min: 3, max: 1500 }).escape(),
  validationErrorHandler,
  postMetric);

// Update metric by ID
/**
 * @api {put} /api/metrics/:id Update Metric
 * @apiName UpdateMetric
 * @apiGroup Metrics
 *
 * @apiParam {Number} id Metric unique ID.
 * @apiBody {String} [metric_date] The date of the metric entry (optional).
 * @apiBody {String} [blood_pressure] Blood pressure recorded in the format "120/80" (optional).
 * @apiBody {Number} [heart_rate] Heart rate recorded (30-250 bpm) (optional).
 * @apiBody {String} [notes] Additional notes (max 1500 characters) (optional).
 *
 * @apiSuccess {Object} metric Updated metric details.
 * @apiSuccess {Number} metric.id The updated metric's ID.
 * @apiSuccess {String} metric.metric_date Date of the metric entry.
 * @apiSuccess {String} metric.blood_pressure Blood pressure recorded.
 * @apiSuccess {Number} metric.heart_rate Heart rate recorded.
 * @apiSuccess {String} metric.notes Additional notes.
 *
 * @apiError {String} error Metric not found or invalid input.
 */
metricsRouter.route('/:id')
  .put(authenticateToken,
    body('metric_date').optional().isDate(),
    body('blood_pressure').optional().matches(/^\d{2,3}\/\d{2,3}$/).withMessage('Blood pressure must be in format "120/80"'),
    body('heart_rate').optional().isInt({ min: 30, max: 250 }).withMessage('Heart rate must be between 30 and 250'),
    body('notes').optional().isLength({ min: 3, max: 1500 }).escape(),
    putMetric);

// Delete metric by ID
/**
 * @api {delete} /api/metrics/:id Delete Metric
 * @apiName DeleteMetric
 * @apiGroup Metrics
 *
 * @apiParam {Number} id Metric unique ID.
 *
 * @apiSuccess {String} message Metric deleted successfully.
 *
 * @apiError {String} error Metric not found.
 */
metricsRouter.route('/:id')
  .delete(authenticateToken, deleteMetric);

export default metricsRouter;
