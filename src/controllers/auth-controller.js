import jwt from 'jsonwebtoken';
import {selectUserByUsername} from '../models/user-model.js';
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { customError } from '../../middlewares/error-handler.js';

const userLogin = async (req, res, next) => {
  const {username, password} = req.body;

  if (!username) {
    return next(customError("Username missing.", 400));
  }

  const user = await selectUserByUsername(username);

  if (user) {
    console.log("Löytyi käyttäjä:", user);
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      // Varmistetaan, että user.id on olemassa ja tallennetaan se
      const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

      // Palautetaan vain tarvittavat tiedot
      return res.json({ message: 'login ok', user: { id: user.user_id, username: user.username }, token });
    }
  }

  res.status(401).json({ message: 'Bad username/password.' });
  next(customError('Bad username/password.', 401));
};


const getMe = (req, res) => {
  const user = req.user;
  res.json(user);
}

export{userLogin, getMe};
