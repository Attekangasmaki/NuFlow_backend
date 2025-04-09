import {getAllEntries, insertEntry, selectEntryById, selectEntriesByUserId, delEntry, updateEntry, insertHrvEntry} from "../models/entries-model.js";


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

// const getHrvByUserId = async (req, res, next) => {
//   console.log('getHrvByUserId kutsuttu', req.user); // Debuggausta

//   try {
//     const userId = req.user.user_id; // Haetaan käyttäjän ID autentikaatiosta
//     if (!userId) {
//       return res.status(400).json({ message: "User ID is missing" });
//     }

//     const hrvData = await selectHrvByUserId(userId, next);
//     console.log('HRV-data found:', hrvData);

//     res.json(hrvData); // Lähetetään kaikki merkinnät käyttäjälle
//   } catch (error) {
//     next(error);
//   }
// };


// const getHrvByDate = async (req, res, next) => {
//   console.log('getHrvByDate kutsuttu', req.user); // Debug-logi

//   try {
//     const userId = req.user.user_id; // Haetaan käyttäjän ID autentikaatiosta
//     const { date } = req.params; // Haetaan päivä URL-parametreista

//     if (!userId || !date) {
//       return res.status(400).json({ message: "User ID or date is missing" });
//     }

//     const hrvData = await selectHrvByDate(userId, date);
//     console.log('HRV Data found:', hrvData);

//     res.json(hrvData); // Lähetetään HRV-tiedot takaisin
//   } catch (error) {
//     next(error);
//   }
// };

const addHrvEntry = async (req, res, next) => {
  console.log('addHrvEntry kutsuttu', req.user); // Debug-logi

  try {
    const userId = req.user.userId; // Haetaan käyttäjän ID autentikaatiosta
    const {
      entry_id,
      hrv_date,
      heart_rate,
      rmssd,
      mean_rr,
      sdnn,
      pns_index,
      sns_index
    } = req.body; // Haetaan tiedot requestin bodystä

    if (!userId || !entry_id || !hrv_date || !heart_rate || !rmssd || !mean_rr || !sdnn || !pns_index || !sns_index) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const result = await insertHrvEntry({
      entry_id,
      hrv_date,
      heart_rate,
      rmssd,
      mean_rr,
      sdnn,
      pns_index,
      sns_index
    });

    res.status(201).json({ message: "HRV entry added successfully", hrv_id: result.insertId });
  } catch (error) {
    next(error);
  }
};

const postEntry = async (req, res, next) => {
  // req.user.user_id
  const newEntry = req.body;
  newEntry.user_id = req.user.userId;
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

export{ getEntries, getEntriesById, getEntriesByUserId, postEntry, putEntry, deleteEntry, addHrvEntry };
