import { getAllUsers, selectUserById, insertUser, deleteUserById } from "../models/user-model.js";
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



const removeUser = async (req, res, next) => {
  console.log('removeUser request params', req.params);

  const userId = req.params.id;

  if (!userId) {
    return next(customError("Missing user ID", 400));
  }

  try {
    const wasDeleted = await deleteUserById(userId);

    if (!wasDeleted) {
      return next(customError("User not found or already deleted", 404));
    }

    return res.status(200).json({
      message: `User with ID ${userId} deleted successfully.`,
    });
  } catch (error) {
    console.error("Virhe käyttäjää poistettaessa:", error.message);
    if (next) return next(customError(error.message, 500));
    res.status(500).json({ error: error.message });
  }
};


export{ addUser, getUserById, getUsers, removeUser };

