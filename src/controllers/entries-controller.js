import { insertEntry, selectEntryById, selectEntriesByUserId, delEntry, updateEntry } from "../models/entries-model.js";
import promisePool from '../utils/database.js';


//Hakee merkinnät ID:n perusteella
const getEntriesById = async (req, res, next) => {
  const entryId = req.params.id;
  console.log('Haetaan aktiviteetti ID:', entryId);

  try {
    const entry = await selectEntryById(entryId);
    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }
    res.json(entry);
  } catch (error) {
    next(error);
  }
};

//Hakee merkinnät käyttäjätunnuksen perusteella
const getEntriesByUserId = async (req, res, next) => {
  console.log('getEntriesByUserId kutsuttu', req.user); // Debuggausta

  try {
    const userId = req.user.userId; // Haetaan käyttäjän ID autentikaatiosta
    if (!userId) {
      return res.status(400).json({ message: "User ID is missing" });
    }

    const entries = await selectEntriesByUserId(userId, next);
    console.log('Entries found:', entries);

    res.json(entries); // Lähetetään kaikki merkinnät käyttäjälle
  } catch (error) {
    next(error);
  }
};

//Lisää uuden merkinnän
const postEntry = async (req, res, next) => {
  const newEntry = req.body;
  newEntry.user_id = req.user.userId;

  try {
    console.log('✅ Validated entry:', newEntry);

    // Tarkista, onko merkintä jo olemassa samalle päivälle ja kellonajalle käyttäjällä
    const [existing] = await promisePool.query(
      'SELECT entry_id FROM diary_entries WHERE user_id = ? AND entry_date = ?',
      [newEntry.user_id, newEntry.entry_date]
    );

    if (existing.length > 0) {
      // Päivitä olemassa oleva merkintä
      const entryId = existing[0].entry_id;
      await updateEntry(entryId, newEntry);
      res.status(200).json({ message: 'Entry updated' });
    } else {
      // Lisää uusi merkintä
      await insertEntry(newEntry);
      res.status(201).json({ message: 'Entry added' });
    }
  } catch (error) {
    next(error);
  }
};

//Päivittää olemassa olevan merkinnän
 const putEntry = async (req, res) => {
  try {
    await updateEntry(req.params.id, req.body);
    res.json({ message: "Entry updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Poistaa merkinnän
const deleteEntry = async (req, res) => {
  try {
    await delEntry(req.params.id);
    res.json({ message: "Entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export{ getEntriesById, getEntriesByUserId, postEntry, putEntry, deleteEntry };
