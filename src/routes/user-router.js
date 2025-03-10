import express from 'express';
import {
  addUser,
  getUserById,
  getUsers,
  putUser,
} from '../controllers/user-controller.js';
import { authenticateToken } from '../../middlewares/authentication.js';
import {body} from 'express-validator';
import { validationErrorHandler } from '../../middlewares/error-handler.js';
const userRouter = express.Router();

// Get all users
/**
 * @api {get} /api/users Get All Users
 * @apiName GetUsers
 * @apiGroup User
 *
 * @apiSuccess {Object[]} users List of all users.
 * @apiSuccess {Number} users.id User's unique ID.
 * @apiSuccess {String} users.username Username of the user.
 * @apiSuccess {String} users.email Email of the user.
 *
 * @apiError {String} error Unable to fetch users.
 */
userRouter.route('/')
  .get(authenticateToken, getUsers)

// Create a new user
/**
 * @api {post} /api/users Create User
 * @apiName CreateUser
 * @apiGroup User
 *
 * @apiBody {String} email The email address of the user.
 * @apiBody {String} username The username for the user (3-20 characters).
 * @apiBody {String} password The password for the user (min 8 characters).
 *
 * @apiSuccess {Object} user The created user object.
 * @apiSuccess {Number} user.id The ID of the new user.
 * @apiSuccess {String} user.username The username of the new user.
 * @apiSuccess {String} user.email The email of the new user.
 *
 * @apiError {String} error Invalid input or failed user creation.
 */
userRouter.route('/')
  .post(
    body('email').trim().isEmail(),
    body('username').trim().isLength({ min: 3, max: 20 }).isAlphanumeric(),
    body('password').trim().isLength({ min: 8, max: 64 }),
    validationErrorHandler,
    addUser);

// Get user by ID
/**
 * @api {get} /api/users/:id Get User by ID
 * @apiName GetUserById
 * @apiGroup User
 *
 * @apiParam {Number} id The unique ID of the user.
 *
 * @apiSuccess {Number} id The ID of the user.
 * @apiSuccess {String} username The username of the user.
 * @apiSuccess {String} email The email of the user.
 *
 * @apiError {String} error User not found.
 */
userRouter.route('/:id')
  .get(getUserById);

// Update user by ID
/**
 * @api {put} /api/users/:id Update User
 * @apiName UpdateUser
 * @apiGroup User
 *
 * @apiParam {Number} id The unique ID of the user.
 * @apiBody {String} [username] The username of the user (optional, 3-30 characters).
 * @apiBody {String} [email] The email address of the user (optional).
 * @apiBody {String} [password] The password of the user (optional, at least 8 characters).
 *
 * @apiSuccess {Object} user The updated user object.
 * @apiSuccess {Number} user.id The ID of the updated user.
 * @apiSuccess {String} user.username The username of the updated user.
 * @apiSuccess {String} user.email The email of the updated user.
 *
 * @apiError {String} error User not found or invalid input.
 */
userRouter.route('/:id')
  .put(authenticateToken,
    body('username').optional().isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters'),
    body('email').optional().isEmail().withMessage('Invalid email format'),
    body('password').optional().isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
      .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
      .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
      .matches(/[0-9]/).withMessage('Password must contain at least one number'),
    putUser);

export default userRouter;



