import { getAllUsers, selectUserById, insertUser, deleteUserById, insertAvatarUrl, selectAvatarUrl } from "../models/user-model.js";
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

const getAvatarUrl = async (req, res) => {
  try {
    const user_id = req.user?.userId || req.user?.user_id;

    if (!user_id) {
      return res.status(401).json({ error: 'User ID missing from token' });
    }

    const result = await selectAvatarUrl(user_id);

    if (!result || !result.avatar_url) {
      return res.status(404).json({ error: 'Avatar not found' });
    }

    return res.status(200).json({ avatar_url: result.avatar_url });
  } catch (error) {
    console.error('Error retrieving avatar URL:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


// Controller-funktio avatarin päivittämiselle
const updateAvatarUrl = async (req, res) => {
  const { avatar_url } = req.body;
  const user_id = req.user?.userId || req.user?.user_id; // Hae user_id tokenista

  // Tarkistetaan että tarvittavat tiedot ovat saatavilla
  if (!user_id) {
    return res.status(401).json({ error: 'User ID missing from token' });
  }

  if (!avatar_url) {
    return res.status(400).json({ error: 'Avatar URL is required' });
  }

  try {
    const affectedRows = await insertAvatarUrl(user_id, { avatar_url });

    if (affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ message: 'Avatar updated successfully' });
  } catch (error) {
    console.error('Error updating avatar:', error);
    return res.status(500).json({ error: 'Error updating avatar' });
  }
};


export{ addUser, getUserById, getUsers, removeUser, getAvatarUrl, updateAvatarUrl };

