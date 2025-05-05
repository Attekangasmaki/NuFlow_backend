import express from 'express';
const authRouter = express.Router();
import { authenticateToken } from '../../middlewares/authentication.js';
import { validationErrorHandler } from '../../middlewares/error-handler.js';
import { body } from 'express-validator';
import { getMe, postLogin } from '../controllers/kubios-auth-controller.js';
import { getAvatarUrl, removeUser, updateAvatarUrl } from '../controllers/user-controller.js';



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
 * @api {post} /auth/avatar/insert Insert user avatar URL
 * @apiName updateAvatarUrl
 * @apiGroup Auth
 * @apiPermission none
 *
 * @apiBody {String} email User email.
 * @apiBody {String} password User password.
 *
 * @apiSuccess {String} token JWT token for authentication.
 * @apiError (400) Bad request if url is not valid.
 * @apiError (401) Unauthorized Invalid credentials.
 */
authRouter.route('/avatar/insert')
.post(
  authenticateToken,
  body('avatarUrl')
  .isURL().withMessage('Avatar URL must be a valid URL'),
  updateAvatarUrl);



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
 * @api {get} /auth/me Get current authenticated user info
 * @apiName GetMe
 * @apiGroup Auth
 * @apiPermission user
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiSuccess {Object} user Current avatar.
 * @apiError (401) Unauthorized Missing or invalid token.
 */
authRouter.get('/avatar', authenticateToken, getAvatarUrl);


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
