import express from 'express';
import { authenticateToken } from '../../middlewares/authentication.js';
import { getLatestKubiosHrvValues, getAllKubiosHrvValues, getUserInfo, updateKubiosUserInfo, getKubiosHrvValuesLastMonth, getKubiosHrvValuesLastWeek, getKubiosHrvValuesByDate } from '../controllers/kubios-controller.js';

const kubiosRouter = express.Router();

kubiosRouter
  .get('/hrv/latest', authenticateToken, getLatestKubiosHrvValues)
  .get('/hrv/all', authenticateToken, getAllKubiosHrvValues)
  .get('/user-info', authenticateToken, getUserInfo)
  .get('/hrv/last-week', authenticateToken, getKubiosHrvValuesLastWeek)
  .get('/hrv/last-month', authenticateToken, getKubiosHrvValuesLastMonth)
  .get('/hrv/by-date/:date', authenticateToken, getKubiosHrvValuesByDate)
  .patch('/userinfo', authenticateToken, updateKubiosUserInfo);



export default kubiosRouter;
