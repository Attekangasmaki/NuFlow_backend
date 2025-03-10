import promisePool from '../utils/database.js';


const getAllEntries = async () => {
  const [rows] = await promisePool.query('SELECT entry_id, user_id, entry_date, mood, weight, sleep_hours, notes, created_at FROM DiaryEntries');
  console.log(rows);
  return rows;
};
const selectEntryById  = async (entryId, next) => {
  try {
    if (!entryId) {
      throw new Error("User ID is required");
    }

    const [rows] = await promisePool.query(
      'SELECT * FROM diaryentries WHERE entry_id = ?',
      [entryId]
    );

    return rows;
  } catch (error) {
    next(error);
  }
};


const selectEntriesByUserId = async (userId, next) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const [rows] = await promisePool.query(
      'SELECT * FROM diaryentries WHERE user_id = ?',
      [userId]
    );

    return rows; // Palautetaan kaikki käyttäjän merkinnät
  } catch (error) {
    next(error);
  }
};
const insertEntry = async (entry, next) => {
  try {
    const [result] = await promisePool.query(
      'INSERT INTO diaryentries (user_id, entry_date, mood, weight, sleep_hours, notes) VALUES (?, ?, ?, ?, ?, ?)',
      [entry.user_id, entry.entry_date, entry.mood, entry.weight, entry.sleep_hours, entry.notes],
    );
    console.log('insertUser', result);
    // return only first item of the result array
    return result.insertId;
  } catch (error) {
    next(error);
  }
};
const updateEntry = async (entryId, entry, next) => {
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
    next(error);
  }
};

const delEntry = async (entryId, next) => {
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
    next(error);
  }
};
export { selectEntryById, selectEntriesByUserId, getAllEntries, insertEntry, updateEntry, delEntry};
