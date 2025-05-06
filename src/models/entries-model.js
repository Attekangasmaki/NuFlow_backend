import promisePool from '../utils/database.js';


// Hakee kaikki merkinnät tietokannasta
const getAllEntries = async () => {
  const [rows] = await promisePool.query('SELECT entry_id, user_id, entry_date, time_of_day, sleep_duration, sleep_notes, current_mood, activity, professional_comment FROM diary_entries');
  console.log(rows);
  return rows;
};


// Hakee merkinnän ID:n perusteella
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

//Hakee merkinnät käyttäjän ID:n perusteella
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


// Lisää uuden merkinnän
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

// Päivittää olemassa olevan merkinnän
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

//Poistaa merkinnän ID:n perusteella
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




export { selectEntryById, selectEntriesByUserId, getAllEntries, insertEntry, updateEntry, delEntry };
