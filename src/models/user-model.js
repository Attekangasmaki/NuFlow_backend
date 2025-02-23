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


const selectUserById = async (userId) => {
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
    console.error("❌ Error fetching user:", error.message);
    return null;
  }
};


const insertUser = async (user) => {
  try {
    const [result] = await promisePool.query(
      'INSERT INTO Users (username, password, email) VALUES (?, ?, ?)',
      [user.username, user.password, user.email],
    );
    console.log('insertUser', result);
    // return only first item of the result array
    return result.insertId;
  } catch (error) {
    console.error(error);
    throw new Error('database error');
  }
};

const selectUserByNameAndPassword = async (username, password) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT user_id, username, email, created_at, user_level FROM users WHERE username =? AND password = ?',
      [username, password]
    );
    return rows[0];
  } catch(error) {
    console.error("Error fetching user:", error.message);
    return null;
  }
};
const selectUserByUsername = async (username) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT user_id, username, password, email, created_at, user_level FROM users WHERE username =?',
      [username]
    );
    return rows[0];
  } catch(error) {
    console.error("Error fetching user:", error.message);
    return null;
  }
};

export {getAllUsers, selectUserById, insertUser, selectUserByNameAndPassword, selectUserByUsername};

