import express from 'express';
const authRouter = express.Router();
import { getMe, userLogin } from '../controllers/auth-controller.js';
import { authenticateToken } from '../../middlewares/authentication.js';
import { validationErrorHandler } from '../../middlewares/error-handler.js';
import { body } from 'express-validator';


authRouter.post('/login',
  body('email').isEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  validationErrorHandler,
  userLogin);



authRouter.get('/me', authenticateToken, getMe);

export default authRouter;
