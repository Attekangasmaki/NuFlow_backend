import promisePool from '../utils/database.js';


const getAllEntries = async () => {
  const [rows] = await promisePool.query('SELECT entry_id, user_id, entry_date, mood, weight, sleep_hours, notes, created_at FROM DiaryEntries');
  console.log(rows);
  return rows;
};

/**
 * Fetch user by id
 * using prepared statement (recommended way)
 * example of error handling
 * @param {number} userId id of the user
 * @returns {object} user found or undefined if not
 */

const selectEntryById = async (entryId) => {
  try {
    if (!entryId) {
      throw new Error("Entry ID is required");
    }

    const [rows] = await promisePool.query(
      'SELECT * FROM diaryentries WHERE user_id = ?',
      [entryId]
    );

    if (rows.length === 0) {
      throw new Error("Entry not found");
    }

    return rows[0];
  } catch (error) {
    console.error("Error fetching user:", error.message);
    return null;
  }
};
const insertEntry = async (entry) => {
  try {
    const [result] = await promisePool.query(
      'INSERT INTO diaryentries (user_id, entry_date, mood, weight, sleep_hours, notes) VALUES (?, ?, ?, ?, ?, ?)',
      [entry.user_id, entry.entry_date, entry.mood, entry.weight, entry.sleep_hours, entry.notes],
    );
    console.log('insertUser', result);
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
      'UPDATE diaryentries SET user_id = ?, entry_date = ?, mood = ?, weight = ?, sleep_hours = ?, notes = ? WHERE entry_id = ?',
      [entry.user_id, entry.entry_date, entry.mood, entry.weight, entry.sleep_hours, entry.notes, entryId]
    );
    if (result.affectedRows === 0) {
      throw new Error("Entry not found or no changes made");
    }
    console.log('putEntry', result);
    return result;
  } catch (error) {
    console.error(error);
    throw new Error('Database error');
  }
};

const delEntry = async (entryId) => {
  try {
    const [result] = await promisePool.query(
      'DELETE FROM diaryentries WHERE entry_id = ?',
      [entryId]
    );
    if (result.affectedRows === 0) {
      throw new Error("Entry not found");
    }
    console.log('deleteEntry', result);
    return result;
  } catch (error) {
    console.error(error);
    throw new Error('Database error');
  }
};
export {selectEntryById, getAllEntries, insertEntry, updateEntry, delEntry};
