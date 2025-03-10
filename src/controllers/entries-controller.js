import {getAllEntries, insertEntry, selectEntryById, selectEntriesByUserId, delEntry, updateEntry} from "../models/entries-model.js";


const getEntries = async (req, res) => {
  const entries = await getAllEntries();
  res.json(entries);
};
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
const getEntriesByUserId = async (req, res, next) => {
  console.log('getEntriesByUserId kutsuttu', req.user); // Debuggausta

  try {
    const userId = req.user.user_id; // Haetaan käyttäjän ID autentikaatiosta
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


const postEntry = async (req, res, next) => {
  // req.user.user_id
  const newEntry = req.body;
  newEntry.user_id = req.user.user_id;
  try {
    console.log(newEntry);
    await insertEntry(newEntry);
    res.status(201).json({message: 'Entry added'});
  } catch (error) {
    next(error);
  }
 };

 const putEntry = async (req, res) => {
  try {
    await updateEntry(req.params.id, req.body);
    res.json({ message: "Entry updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEntry = async (req, res) => {
  try {
    await delEntry(req.params.id);
    res.json({ message: "Entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export{ getEntries, getEntriesById, getEntriesByUserId, postEntry, putEntry, deleteEntry };
