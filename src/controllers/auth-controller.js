import jwt from 'jsonwebtoken';
import {selectUserByUsername} from '../models/user-model.js';
import 'dotenv/config';
import bcrypt from 'bcryptjs';

const userLogin = async (req, res) => {
  const {username, password} = req.body;
  if (!username) {
    return res.status(401).json({message: 'Username missing.'});
  }
  const user = await selectUserByUsername(username);

  if (user) {
    console.log("Löytyi käyttäjä:", user);
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      const token = jwt.sign(user, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});
      return res.json({message: 'login ok', user, token});
    }
  }
  res.status(401).json({message: 'Bad username/password.'});
};

const getMe = (req, res) => {
  const user = req.user;
  res.json(user);
}

export{userLogin, getMe};
