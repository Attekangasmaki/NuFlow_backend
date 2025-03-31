import { getAllUsers, selectUserById, insertUser, insertUserinfo} from "../models/user-model.js";
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

  const { email, password } = req.body;

  if (!email || !password) {
    return next(customError("Missing required fields", 400));
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = { email, password: hashedPassword };

    const result = await insertUser(newUser);

    const token = jwt.sign(
      { id: result, email: email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(201).json({
      message: 'User added. id: ' + result,
      token,
      user: { id: result, email: email }
    });
  } catch (error) {
    console.error("Virhe käyttäjän luomisessa:", error.message);
    if (next) return next(customError(error.message, 400)); // Varmistetaan, että next on olemassa
    res.status(500).json({ error: error.message }); // Fallback vastaus
  }
};

const addUserinfo = async (req, res, next) => {
  console.log('addUserInfo request body', req.body);

  const { user_id, first_name, last_name, birthday, height, weight, gender } = req.body;

  // Tarkistetaan, että käyttäjän ID ja vähintään yksi lisätieto on annettu
  if (!user_id || (!first_name && !last_name && !birthday && !height && !weight && !gender)) {
    return next(customError("Missing required fields", 400));
  }

  try {
    const userInfo = { first_name, last_name, birthday, height, weight, gender };
    const updatedRows = await insertUserinfo(user_id, userInfo);

    if (updatedRows === 0) {
      return res.status(404).json({ message: "User not found or no changes applied" });
    }

    return res.status(200).json({
      message: `User info updated for user ID: ${user_id}`,
      user: { user_id, ...userInfo }
    });
  } catch (error) {
    console.error("Virhe käyttäjätietojen päivityksessä:", error.message);
    if (next) return next(customError(error.message, 400)); // Varmistetaan, että next on olemassa
    res.status(500).json({ error: error.message }); // Fallback vastaus
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

export{ addUser, addUserinfo, getUserById, getUsers, putUser };

