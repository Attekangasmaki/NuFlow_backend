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

userRouter.route('/')
  .get(authenticateToken, getUsers)
  .post(
    body('email').trim().isEmail(),
    body('username').trim().isLength({min: 3, max: 20}).isAlphanumeric(),
    body('password').trim().isLength({min: 8, max: 64}),
    validationErrorHandler,
    addUser);

userRouter.route('/:id')
.get(getUserById);


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



