import express from 'express';
const authRouter = express.Router();
import { authenticateToken } from '../../middlewares/authentication.js';
import { validationErrorHandler } from '../../middlewares/error-handler.js';
import { body } from 'express-validator';
import { getMe, postLogin } from '../controllers/kubios-auth-controller.js';



/**
 * @api {post} /auth/login User login
 * @apiName PostLogin
 * @apiGroup Auth
 * @apiPermission none
 *
 * @apiBody {String} email User email.
 * @apiBody {String} password User password.
 *
 * @apiSuccess {String} token JWT token for authentication.
 * @apiError (400) ValidationError Email or password missing or invalid.
 * @apiError (401) Unauthorized Invalid credentials.
 */
authRouter.route('/login')
.post(
  body('username'),
  body('password').notEmpty().withMessage('Password is required'),
  validationErrorHandler,
  postLogin);


/**
 * @api {get} /auth/me Get current authenticated user info
 * @apiName GetMe
 * @apiGroup Auth
 * @apiPermission user
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiSuccess {Object} user Current user info.
 * @apiError (401) Unauthorized Missing or invalid token.
 */
authRouter.get('/me', authenticateToken, getMe);

export default authRouter;
