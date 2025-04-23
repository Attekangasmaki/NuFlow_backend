import jwt from 'jsonwebtoken';
import { selectUserByEmail } from '../models/user-model.js';
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { customError } from '../../middlewares/error-handler.js';

const professionalLogin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(customError('Email and password are required.', 400));
  }

  const user = await selectUserByEmail(email);

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  if (user.user_level !== 'professional') {
    return res.status(403).json({ error: 'Access denied: only professionals can log in.' });
  }

  const token = jwt.sign(
    { user_id: user.user_id, user_level: user.user_level },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return res.json({
    message: 'Login successful',
    user: {
      id: user.user_id,
      email: user.email,
      level: user.user_level,
    },
    token,
  });
};



const getMe = (req, res) => {
  const user = req.user;
  res.json(user);
}

export{ professionalLogin, getMe };
