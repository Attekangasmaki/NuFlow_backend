import {getAllEntries, insertEntry, selectEntryById, delEntry, updateEntry} from "../models/entries-model.js";


const getEntries = async (req, res) => {
  const entries = await getAllEntries();
  res.json(entries);
};

const getEntryById = async (req, res) => {
  console.log('getEntryById', req.params.id);
  try{
    const entry = await selectEntryById(req.params.id);
    console.log('Entry found:', entry)
    if (entry) {
      res.json(entry);
    } else {
      res.status(404).json({message: "Entry not found"});
    }
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

const postEntry = async (req, res) => {
  // req.user.user_id
  const newEntry = req.body;
  newEntry.user_id = req.user.user_id;
  console.log(newEntry);
  insertEntry(newEntry);
  res.status(201)({message: 'Kaikki ok, entry added'});
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

export{getEntries, getEntryById, postEntry, putEntry, deleteEntry};
