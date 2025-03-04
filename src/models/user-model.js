import promisePool from '../utils/database.js';

/**
 * Fetch all userdata except passwords from database
 * @returns
 */

const getAllUsers = async () => {
  const [rows] = await promisePool.query(
    'SELECT user_id, username, email, created_at, user_level FROM Users',
  );
  console.log('getAllUser', rows);
  return rows;
}


/**
 * Fetch user by id
 * using prepared statement (recommended way)
 * example of error handling
 * @param {number} userId id of the user
 * @returns {object} user found or undefined if not
 */


const selectUserById = async (userId, next) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    console.log("🛠 Haetaan käyttäjää ID:", userId);

    const [rows] = await promisePool.query(
      'SELECT user_id, username, email, created_at, user_level FROM users WHERE user_id = ?',
      [userId]
    );

    console.log("🔍 Query tulokset:", rows);

    if (rows.length === 0) {
      console.log("❌ Käyttäjää ei löytynyt!");
      throw new Error("User not found");
    }

    console.log("✅ Käyttäjä löytyi:", rows[0]);
    return rows[0];
  } catch (error) {
    next(error);
  }
};


const insertUser = async (user, next) => {
  try {
    const [result] = await promisePool.query(
      'INSERT INTO Users (username, password, email) VALUES (?, ?, ?)',
      [user.username, user.password, user.email],
    );
    console.log('insertUser', result);
    // return only first item of the result array
    return result.insertId;
  } catch (error) {
    next(error);
  }
};

const selectUserByNameAndPassword = async (username, password, next) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT user_id, username, email, created_at, user_level FROM users WHERE username =? AND password = ?',
      [username, password]
    );
    return rows[0];
  } catch(error) {
    next(error);
  }
};
const selectUserByUsername = async (username, next) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT user_id, username, password, email, created_at, user_level FROM users WHERE username =?',
      [username]
    );
    return rows[0];
  } catch(error) {
    next(error);
  }
};

export {getAllUsers, selectUserById, insertUser, selectUserByNameAndPassword, selectUserByUsername};

