import promisePool from '../utils/database.js';


const getAllEntries = async () => {
  const [rows] = await promisePool.query('SELECT entry_id, user_id, entry_date, time_of_day, sleep_duration, sleep_notes, current_mood, activity, professional_comment FROM diary_entries');
  console.log(rows);
  return rows;
};

const selectEntryById  = async (entryId) => {
  try {
    if (!entryId) {
      throw new Error("User ID is required");
    }

    const [rows] = await promisePool.query(
      'SELECT * FROM diary_entries WHERE entry_id = ?',
      [entryId]
    );

    return rows;
  } catch (error) {
    console.error(error);
    throw new Error('database error');
  }
};


const selectEntriesByUserId = async (userId) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const [rows] = await promisePool.query(
      'SELECT * FROM diary_entries WHERE user_id = ?',
      [userId]
    );

    return rows; // Palautetaan kaikki käyttäjän merkinnät
  } catch (error) {
    console.error(error);
    throw new Error('database error');
  }
};
const insertEntry = async (entry) => {
  try {
    const [result] = await promisePool.query(
      'INSERT INTO diary_entries (user_id, entry_date, time_of_day, sleep_duration, sleep_notes, current_mood, activity) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [entry.user_id, entry.entry_date, entry.mood, entry.weight, entry.sleep_hours, entry.notes],
    );
    console.log('insertEntry', result);
    // return only first item of the result array
    return result.insertId;
  } catch (error) {
    console.error(error);
    throw new Error('database error');
  }
};
const updateEntry = async (entryId, entry) => {
  try {
    const [result] = await promisePool.query(
      'UPDATE diary_entries SET user_id = ?, entry_date = ?, time_of_day = ?, sleep_duration = ?, sleep_notes = ?, current_mood = ?, activity = ? WHERE entry_id = ?',
      [entry.user_id, entry.entry_date, entry.mood, entry.weight, entry.sleep_hours, entry.notes, entryId]
    );
    if (result.affectedRows === 0) {
      throw new Error("Entry not found or no changes made");
    }
    console.log('updateEntry', result);
    return result;
  } catch (error) {
    console.error(error);
    throw new Error('database error');
  }
};

const delEntry = async (entryId) => {
  try {
    const [result] = await promisePool.query(
      'DELETE FROM diary_entries WHERE entry_id = ?',
      [entryId]
    );
    if (result.affectedRows === 0) {
      throw new Error("Entry not found");
    }
    console.log('deleteEntry', result);
    return result;
  } catch (error) {
    console.error(error);
    throw new Error('database error');
  }
};
export { selectEntryById, selectEntriesByUserId, getAllEntries, insertEntry, updateEntry, delEntry};
