import express from 'express';
const authRouter = express.Router();
import { getMe, userLogin } from '../controllers/auth-controller.js';
import { authenticateToken } from '../../middlewares/authentication.js';
import { validationErrorHandler } from '../../middlewares/error-handler.js';
import { body } from 'express-validator';

// User Login
/**
 * @api {post} /api/auth/login User Login
 * @apiName UserLogin
 * @apiGroup Authentication
 *
 * @apiBody {String} username The user's username.
 * @apiBody {String} password The user's password.
 *
 * @apiSuccess {String} token The JWT token for the logged-in user.
 * @apiSuccess {String} message Success message indicating login success.
 *
 * @apiError {String} error Invalid credentials or authentication failure.
 */
authRouter.post('/login',
  body('username'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  validationErrorHandler,
  userLogin);

// Get current user information
/**
 * @api {get} /api/auth/me Get Current User
 * @apiName GetCurrentUser
 * @apiGroup Authentication
 *
 * @apiHeader {String} Authorization Bearer JWT token to authenticate the user.
 *
 * @apiSuccess {Number} id The ID of the authenticated user.
 * @apiSuccess {String} username The username of the authenticated user.
 * @apiSuccess {String} email The email of the authenticated user.
 *
 * @apiError {String} error Authentication failed or token missing.
 */
authRouter.get('/me', authenticateToken, getMe);

export default authRouter;
