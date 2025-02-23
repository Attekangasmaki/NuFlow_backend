import express from 'express';
const authRouter = express.Router();
import { getMe, userLogin } from '../controllers/auth-controller.js';
import { authenticateToken } from '../../middlewares/authentication.js';

authRouter.post('/login', userLogin);

authRouter.get('/me', authenticateToken, getMe);

export default authRouter;
