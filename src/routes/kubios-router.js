import express from 'express';
import { authenticateToken } from '../../middlewares/authentication.js';
import { getLatestKubiosHrvValues, getAllKubiosHrvValues, getUserInfo, updateKubiosUserInfo } from '../controllers/kubios-controller.js';

const kubiosRouter = express.Router();

kubiosRouter
  .get('/hrv/latest', authenticateToken, getLatestKubiosHrvValues)
  .get('/hrv/all', authenticateToken, getAllKubiosHrvValues)
  .get('/user-info', authenticateToken, getUserInfo)
  .patch('/userinfo', authenticateToken, updateKubiosUserInfo);

export default kubiosRouter;
