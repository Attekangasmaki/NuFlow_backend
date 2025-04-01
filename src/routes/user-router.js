import express from 'express';
import {
  addUser,
  addUserinfo,
  getUserById,
  getUsers,
  putUser,
} from '../controllers/user-controller.js';
import { authenticateToken } from '../../middlewares/authentication.js';
import { body } from 'express-validator';
import { validationErrorHandler } from '../../middlewares/error-handler.js';
const userRouter = express.Router();

userRouter.route('/')
  .get(authenticateToken, getUsers);


userRouter.route('/')
  .post(
    body('email').trim().isEmail(),
    body('password').trim().isLength({ min: 8, max: 64 }),
    validationErrorHandler,
    addUser);

    userRouter.route('/userinfo/:id')
    .post(
      body('first_name'),
      body('last_name'),
      body('birthday').isDate(),
      body('height'),
      body('weight'),
      body('gender'),
      validationErrorHandler,
      addUserinfo);



userRouter.route('/:id')
  .get(getUserById);


userRouter.route('/:id')
  .put(authenticateToken,
    putUser);

export default userRouter;



