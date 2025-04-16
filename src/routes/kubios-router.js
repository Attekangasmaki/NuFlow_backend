import express from 'express';
import { authenticateToken } from '../../middlewares/authentication.js';
import { getLatestKubiosHrvValues, getAllKubiosHrvValues, getUserInfo, updateKubiosUserInfo, getKubiosHrvValuesLastMonth, getKubiosHrvValuesLastWeek, getKubiosHrvValuesByDate, getKubiosLast7Measurements, getKubiosLast30Measurements } from '../controllers/kubios-controller.js';

const kubiosRouter = express.Router();

kubiosRouter
  .get('/hrv/latest', authenticateToken, getLatestKubiosHrvValues)
  .get('/hrv/all', authenticateToken, getAllKubiosHrvValues)
  .get('/user-info', authenticateToken, getUserInfo)
  .get('/hrv/last-week', authenticateToken, getKubiosHrvValuesLastWeek)
  .get('/hrv/last-month', authenticateToken, getKubiosHrvValuesLastMonth)
  .get('/hrv/by-date/:date', authenticateToken, getKubiosHrvValuesByDate)
  .get('/hrv/last-7-measurements', authenticateToken, getKubiosLast7Measurements)
  .get('/hrv/last-30-measurements', authenticateToken, getKubiosLast30Measurements)
  .patch('/userinfo', authenticateToken, updateKubiosUserInfo);



export default kubiosRouter;
