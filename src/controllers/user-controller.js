import { getAllUsers, selectUserById, insertUser} from "../models/user-model.js";
//import {validationResult} from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import 'dotenv/config';
import { customError } from '../../middlewares/error-handler.js';


const getUsers = async (req, res) => {
  const users = await getAllUsers();
  res.json(users);
};


const addUser = async (req, res, next) => {
  console.log('addUser request body', req.body);

  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return next(customError("Missing required fields", 400)); // Virhe, jos kenttiä puuttuu
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = { username, password: hashedPassword, email };

    const result = await insertUser(newUser);

    // Luo JWT-token käyttäjälle
    const token = jwt.sign(
      { id: result, username: username },
      process.env.JWT_SECRET,  // Käytetään oikeaa ympäristömuuttujaa
      { expiresIn: '1h' }
    );

    // Palautetaan token ja käyttäjän tiedot
    return res.status(201).json({
      message: 'User added. id: ' + result,
      token,
      user: { id: result, username: username }
    });
  } catch (error) {
    // Virheenkäsittely keskitetysti
    console.error("Virhe käyttäjän luomisessa:", error.message);
    return next(customError(error.message, 400)); // Käytetään next() virheenkäsittelyyn
  }
};



const getUserById = async (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  console.log("🛠 Kutsuttiin getUserById ID:llä", id);

  try {
    const user = await selectUserById(id);
    console.log("🔍 selectUserById palautti:", user);

    if (user) {
      res.json(user);
    } else {
      console.log("❌ selectUserById ei löytänyt käyttäjää!");
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    next(error);
  }
};


const putUser = async (req, res) => {
  // get user id from token
  const token_user_id = req.user.user_id;
  // get user id from request
  const user_id = req.params.id;
  // check that user is updating own data
  if (token_user_id !== user_id) {
    return res.status(403).json({error: 403, message: 'forbidden'});
  }
}

export{addUser, getUserById, getUsers, putUser};

