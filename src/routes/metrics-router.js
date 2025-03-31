import express from 'express';
import {
  getMetricById,
  postMetric,
  putMetric,
  getMetricByUserId,
} from '../controllers/metrics-controller.js';
import { authenticateToken } from '../../middlewares/authentication.js';
import { validationErrorHandler } from '../../middlewares/error-handler.js';
//import { body } from 'express-validator';

const metricsRouter = express.Router();




metricsRouter.route('/:id')
  .get(authenticateToken, getMetricById);


metricsRouter.get('/user/:id', authenticateToken, getMetricByUserId);


metricsRouter.post('/insert', authenticateToken,
  validationErrorHandler,
  postMetric);


metricsRouter.route('/:id')
  .put(authenticateToken,
    putMetric);



export default metricsRouter;
