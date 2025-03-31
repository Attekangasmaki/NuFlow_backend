import promisePool from '../utils/database.js';



const getAllUsers = async () => {
  const [rows] = await promisePool.query(
    'SELECT email, first_name, last_name, birthday, height, weight, gender FROM Users WHERE user_level = user',
  );
  console.log('getAllUser', rows);
  return rows;
}

const getAllProfessionals = async () => {
  const [rows] = await promisePool.query(
    'SELECT email, first_name, last_name FROM Users WHERE user_level = professional',
  );
  console.log('getAllUser', rows);
  return rows;
}

//Käyttäjän tietojen haku ID:n perusteella
const selectUserById = async (userId) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    console.log("🛠 Haetaan käyttäjää ID:", userId);

    const [rows] = await promisePool.query(
      'SELECT user_id, email, password, first_name, last_name, birthday, height, weight, gender, user_level FROM Users WHERE user_id = ?',
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
    console.error(error);
    throw new Error('database error');
  }
};

//Käyttäjän rekistöröinti
const insertUser = async (user) => {
  try {
    const [result] = await promisePool.query(
      'INSERT INTO Users (email, password) VALUES (?, ?)',
      [user.email, user.password],
    );
    console.log('insertUser', result);
    // return only first item of the result array
    return result.insertId;
  } catch (error) {
    console.error(error);
    throw new Error('database error');
  }
};

//Käyttäjän tietojen lisäys rekistöröitymisen/ensimmäisen kirjautumisen jälkeen
const insertUserinfo = async (user_id, user) => {
  try {
    const [result] = await promisePool.query(
      `UPDATE Users
       SET first_name = ?,
           last_name = ?,
           birthday = ?,
           height = ?,
           weight = ?,
           gender = ?
       WHERE user_id = ?`,
      [user.first_name, user.last_name, user.birthday, user.height, user.weight, user.gender, user_id]
    );

    console.log('User info updated', result);
    return result.affectedRows; // Palautetaan päivitettyjen rivien määrä
  } catch (error) {
    console.error(error);
    throw new Error('Database error');
  }
};



const selectUserByEmailAndPassword = async (email, password) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT user_id, email, password, first_name, last_name, birthday, height, weight, gender, user_level FROM Users WHERE email =? AND password = ?',
      [email, password]
    );
    return rows[0];
  } catch (error) {
    console.error(error);
    throw new Error('database error');
  }
};


const selectUserByEmail = async (email) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT user_id, email, password, first_name, last_name, birthday, height, weight, gender, user_level FROM Users WHERE email=?',
      [email],
    );
    console.log(rows);
    // return only first item of the result array
    return rows[0];
  } catch (error) {
    console.error(error);
    throw new Error('database error');
  }
};

export { getAllUsers, getAllProfessionals, selectUserById, insertUser, insertUserinfo, selectUserByEmailAndPassword, selectUserByEmail };

