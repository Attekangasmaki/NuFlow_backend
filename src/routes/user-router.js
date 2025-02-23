import express from 'express';
import {
  addUser,
  getUserById,
  getUsers,
  putUser,
} from '../controllers/user-controller.js';
import { authenticateToken } from '../../middlewares/authentication.js';
const userRouter = express.Router();

userRouter.route('/')
  .get(authenticateToken, getUsers)
  .post(addUser);

userRouter.route('/:id')
.get(getUserById);


userRouter.route('/:id')
.put(authenticateToken, putUser);


export default userRouter;



