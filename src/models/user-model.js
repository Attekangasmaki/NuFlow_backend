import promisePool from '../utils/database.js';


// Hakee käyttäjätiedot sähköpostin perusteella
const selectUserByEmail = async (email) => {
  try {
    const sql = 'SELECT * FROM users WHERE email=?';
    const params = [email];
    const [rows] = await promisePool.query(sql, params);
    // console.log(rows);
    // if nothing is found with the user id, result array is empty []
    if (rows.length === 0) {
      return {error: 404, message: 'user not found'};
    }
    // Remove password property from result
    delete rows[0].password;
    return rows[0];
  } catch (error) {
    console.error('selectUserByEmail', error);
    return {error: 500, message: 'db error'};
  }
};


//Käyttäjän tietojen haku ID:n perusteella
const selectUserById = async (userId) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    console.log("🛠 Haetaan käyttäjää ID:", userId);

    const [rows] = await promisePool.query(
      'SELECT user_id, email, password, first_name, last_name, birthday, height, weight, gender, user_level FROM users WHERE user_id = ?',
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

//Käyttäjän rekisteröinti
const insertUser = async (user) => {
  try {
    const [result] = await promisePool.query(
      'INSERT INTO users (email, password) VALUES (?, ?)',
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
      `UPDATE users
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

//Käyttäjän avatarin lisäys
const insertAvatarUrl = async (user_id, user) => {
  try {
    const [result] = await promisePool.query(
      `UPDATE users
      SET avatar_url = ?
      WHERE user_id = ?`,
      [user.avatar_url, user_id]
    );

    console.log('User avatar updated', result);
    return result.affectedRows; // Palautetaan päivitettyjen rivien määrä
  } catch (error) {
    console.error(error);
    throw new Error('Database error');
  }
};

//Hakee käyttäjän tiedot sähköpostin ja salasanan perusteella
const selectUserByEmailAndPassword = async (email, password) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT user_id, email, password, first_name, last_name, birthday, height, weight, gender, user_level FROM users WHERE email =? AND password = ?',
      [email, password]
    );
    return rows[0];
  } catch (error) {
    console.error(error);
    throw new Error('database error');
  }
};


//Hakee käyttäjän avatarin URL:n käyttäjän ID:n perusteella
const selectAvatarUrl= async (userId) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT avatar_url FROM users WHERE user_id = ?',
      [userId]
    );
    return rows[0];
  } catch (error) {
    console.error(error);
    throw new Error('database error');
  }
};

//Poistaa käyttäjän ID:n perusteella
const deleteUserById = async (userId) => {
  try {
    const [result] = await promisePool.query(
      'DELETE FROM users WHERE user_id = ?',
      [userId]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Virhe tietokantaa käytettäessä:', error);
    throw new Error('Database error');
  }
};

export { selectUserById, insertUser, insertUserinfo, selectUserByEmailAndPassword, selectUserByEmail, deleteUserById, insertAvatarUrl, selectAvatarUrl };

