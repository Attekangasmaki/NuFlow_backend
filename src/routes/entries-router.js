import express from 'express';
import {
  getEntries,
  getEntryById,
  postEntry,
  putEntry,
  deleteEntry,
} from '../controllers/entries-controller.js';
import { authenticateToken } from '../../middlewares/authentication.js';


const entriesRouter = express.Router();

entriesRouter.route('/')
  .get(authenticateToken, getEntries)


entriesRouter.route('/:id')
.get(getEntryById)

entriesRouter.post('/insert', authenticateToken, postEntry);

entriesRouter.route('/:id')
.put(authenticateToken, putEntry)

entriesRouter.route('/:id')
.delete(authenticateToken, deleteEntry)

export default entriesRouter;



