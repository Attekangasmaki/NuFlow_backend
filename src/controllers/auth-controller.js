import jwt from 'jsonwebtoken';
import {selectUserByEmail} from '../models/user-model.js';
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { customError } from '../../middlewares/error-handler.js';

const userLogin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email) {
    return next(customError('Email missing.', 400));
  }

  const user = await selectUserByEmail(email);

  if (user) {
    console.log('Löytyi käyttäjä:', user);
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      const token = jwt.sign(
        { user_id: user.user_id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
      return res.json({ message: 'login ok', user: { id: user.user_id, email: user.email }, token });
    }
  }
  return res.status(401).json({ error: 'Bad email/password.' });
};


const getMe = (req, res) => {
  const user = req.user;
  res.json(user);
}

export{userLogin, getMe};
