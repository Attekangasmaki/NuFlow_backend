import express from 'express';
const authRouter = express.Router();
//import { getMe, userLogin } from '../controllers/auth-controller.js';
import { authenticateToken } from '../../middlewares/authentication.js';
import { validationErrorHandler } from '../../middlewares/error-handler.js';
//import { body } from 'express-validator';
import {getMe, postLogin} from '../controllers/kubios-auth-controller.js';

authRouter.post('/login',
  validationErrorHandler,
  postLogin);



authRouter.get('/me', authenticateToken, getMe);

export default authRouter;
