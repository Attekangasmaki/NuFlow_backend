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

const selectHrvByUserId = async (userId) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const [rows] = await promisePool.query(
      `SELECT hrv.hrv_date, hrv.heart_rate, hrv.rmssd, hrv.mean_rr, hrv.sdnn, hrv.pns_index, hrv.sns_index
       FROM hrv_data hrv
       JOIN diary_entries d ON hrv.entry_id = d.entry_id
       WHERE d.user_id = ?`,
      [userId]
    );

    return rows; // Palautetaan haetut tiedot
  } catch (error) {
    console.error(error);
    throw new Error('Database error');
  }
};

const selectHrvByDate = async (userId, date) => {
  try {
    if (!userId || !date) {
      throw new Error("User ID and date are required");
    }

    const [rows] = await promisePool.query(
      `SELECT hrv.heart_rate, hrv.rmssd, hrv.mean_rr, hrv.sdnn, hrv.pns_index, hrv.sns_index
       FROM hrv_data hrv
       JOIN diary_entries d ON hrv.entry_id = d.entry_id
       WHERE d.user_id = ? AND hrv.hrv_date = ?`,
      [userId, date]
    );

    return rows; // Palautetaan haetut tiedot
  } catch (error) {
    console.error(error);
    throw new Error('Database error');
  }
};

const insertHrvEntry = async ({
  entry_id,
  hrv_date,
  heart_rate,
  rmssd,
  mean_rr,
  sdnn,
  pns_index,
  sns_index
}) => {
  try {
    const [result] = await promisePool.query(
      `INSERT INTO hrv_data (entry_id, hrv_date, heart_rate, rmssd, mean_rr, sdnn, pns_index, sns_index)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [entry_id, hrv_date, heart_rate, rmssd, mean_rr, sdnn, pns_index, sns_index]
    );

    return result;
  } catch (error) {
    console.error(error);
    throw new Error('Database error');
  }
};

const insertEntry = async (entry) => {
  try {
    const [result] = await promisePool.query(
      'INSERT INTO diary_entries (user_id, entry_date, time_of_day, sleep_duration, sleep_notes, current_mood, activity) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [entry.user_id, entry.entry_date, entry.time_of_day, entry.sleep_duration, entry.sleep_notes, entry.current_mood, entry.activity],
    );
    console.log('insertEntry', result);
    // return only first item of the result array
    return result.insertId;
  } catch (error) {
    console.error(error);
    throw new Error('database error');
  }
};

const updateEntry = async (entryId, entryData) => {
  try {
    console.log('Updating entry with data:', entryData);

    const [result] = await promisePool.query(
      'UPDATE diary_entries SET entry_date = ?, time_of_day = ?, sleep_duration = ?, sleep_notes = ?, current_mood = ?, activity = ? WHERE entry_id = ?',
      [
        entryData.entry_date,
        entryData.time_of_day,
        entryData.sleep_duration,
        entryData.sleep_notes,
        entryData.current_mood,
        entryData.activity,
        entryId  // Käytetään erillistä entryId:tä request-parametrista
      ]
    );

    console.log('updateEntry query result:', result);
    return result;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Database error');
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




export { selectEntryById, selectEntriesByUserId, selectHrvByUserId, getAllEntries, selectHrvByDate, insertHrvEntry, insertEntry, updateEntry, delEntry };
