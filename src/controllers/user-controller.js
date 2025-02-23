//figure out and add correct status codes and corresponding messages or data to the responses
//use POST method to create a new user
//use GET method to get a specific user
//create a dummy login endpoint using POST method
//check that the username and password match and return a success message if they do or an error message if they don't

import { getAllUsers, selectUserById, insertUser} from "../models/user-model.js";

import bcrypt from 'bcryptjs';



const getUsers = async (req, res) => {
  const users = await getAllUsers();
  res.json(users);
};

const addUser = async (req, res) => {
  console.log('addUser request body', req.body);
  const {username, password, email} = req.body;
  if (username && password && email) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = {username, password: hashedPassword, email,};
    try {
      const result = await insertUser(newUser);
      res.status(201);
      return res.json({message: 'User added. id: ' + result});
    } catch (error) {
      console.error("🔥 Database error:", error);
      return res.status(500).json({message: 'DB error: ' + error.message});


    }

  }
  res.status(400);
  return res.json({message: 'Request is missing some property.'});

};


const getUserById = async (req, res) => {
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
    console.error("❌ Virhe getUserById-funktiossa:", error.message);
    res.status(500).json({ message: error.message });
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

