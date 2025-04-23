import express from 'express';
const authRouter = express.Router();
import { authenticateToken } from '../../middlewares/authentication.js';
import { validationErrorHandler } from '../../middlewares/error-handler.js';
import { body } from 'express-validator';
import { getMe, postLogin } from '../controllers/kubios-auth-controller.js';
import { professionalLogin } from '../controllers/auth-controller.js';
import { removeUser } from '../controllers/user-controller.js';



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
 * @api {post} /auth/login Professional login
 * @apiName ProfessionalLogin
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
authRouter.route('/professional-login')
.post(
  body('email'),
  body('password').notEmpty().withMessage('Password is required'),
  validationErrorHandler,
  professionalLogin);


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


/**
 * @api {delete} /api/users/:id Delete user by ID
 * @apiName RemoveUser
 * @apiGroup Users
 * @apiPermission admin
 * @apiHeader {String} Authorization Bearer token
 *
 * @apiParam {Number} id User's unique ID
 *
 * @apiSuccess {String} message Success message
 *
 * @apiError (400) BadRequest Invalid or missing ID parameter
 * @apiError (401) Unauthorized Missing or invalid token
 * @apiError (403) Forbidden Admin rights required
 * @apiError (404) NotFound User not found
 * @apiError (500) ServerError Unexpected server error
 * */
authRouter.delete('/delete/:id', authenticateToken, removeUser);

export default authRouter;
