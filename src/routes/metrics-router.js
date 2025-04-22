import express from 'express';
import {
  getMetricById,
  postMetric,
  putMetric,
  getMetricByUserId,
} from '../controllers/metrics-controller.js';
import { authenticateToken } from '../../middlewares/authentication.js';
import { validationErrorHandler } from '../../middlewares/error-handler.js';
import { body } from 'express-validator';

const metricsRouter = express.Router();



/**
 * @api {get} /metrics/:id Get a metric by its ID
 * @apiName GetMetricById
 * @apiGroup Metrics
 * @apiPermission user
 *
 * @apiParam {String} id Metric's unique ID.
 *
 * @apiSuccess {Object} metric Metric entry object.
 * @apiError (404) NotFound Metric not found.
 * @apiError (401) Unauthorized Missing or invalid token.
 */
metricsRouter.route('/:id')
  .get(authenticateToken, getMetricById);


/**
 * @api {get} /metrics/user/:id Get all metrics by user ID
 * @apiName GetMetricsByUserId
 * @apiGroup Metrics
 * @apiPermission user
 *
 * @apiParam {String} id User's unique ID.
 *
 * @apiSuccess {Object[]} metrics Array of metrics linked to the user.
 * @apiError (404) NotFound No metrics found for user.
 * @apiError (401) Unauthorized Missing or invalid token.
 */
metricsRouter.get('/user/:id', authenticateToken, getMetricByUserId);


/**
 * @api {post} /metrics/insert Insert new metric data
 * @apiName PostMetric
 * @apiGroup Metrics
 * @apiPermission user
 *
 * @apiBody {String} [drug_use] Info about drug use.
 * @apiBody {String} [diseases_medications] Info about diseases or medications.
 * @apiBody {String} [sleep] Sleep-related info.
 * @apiBody {String} [self_assessment] Self-assessment notes.
 *
 * @apiSuccess (201) {Object} metric Created metric entry.
 * @apiError (400) {Object} error Validation error.
 * @apiError (401) Unauthorized Missing or invalid token.
 */
metricsRouter.route('/insert')
.post(
  body('drug_use').optional().isString().withMessage('drug_use must be a string'),
  body('diseases_medications').optional().isString().withMessage('diseases_medications must be a string'),
  body('sleep').optional().isString().withMessage('sleep must be a string'),
  body('self_assessment').optional().isString().withMessage('self_assessment must be a string'),
  authenticateToken,
  validationErrorHandler,
  postMetric);


/**
 * @api {put} /metrics/:id Update an existing metric entry
 * @apiName PutMetric
 * @apiGroup Metrics
 * @apiPermission user
 *
 * @apiParam {String} id Metric ID to update.
 *
 * @apiBody {String} [drug_use] Info about drug use.
 * @apiBody {String} [diseases_medications] Info about diseases or medications.
 * @apiBody {String} [sleep] Sleep-related info.
 * @apiBody {String} [self_assessment] Self-assessment notes.
 *
 * @apiSuccess {Object} metric Updated metric entry.
 * @apiError (400) {Object} error Validation error.
 * @apiError (404) NotFound Metric not found.
 * @apiError (401) Unauthorized Missing or invalid token.
 */
metricsRouter.route('/:id')
  .put(
    body('drug_use').optional().isString().withMessage('drug_use must be a string'),
    body('diseases_medications').optional().isString().withMessage('diseases_medications must be a string'),
    body('sleep').optional().isString().withMessage('sleep must be a string'),
    body('self_assessment').optional().isString().withMessage('self_assessment must be a string'),
    authenticateToken,
    putMetric);



export default metricsRouter;
