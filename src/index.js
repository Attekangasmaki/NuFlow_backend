import express from 'express';
import cors from 'cors';
import {getItems, getItemById, addItem, updateItem, deleteItem} from './items.js';

import userRouter from './routes/user-router.js';
console.log("✅ userRouter imported successfully");

import entryRouter from './routes/entries-router.js';
import authRouter from './routes/auth-router.js';
console.log("✅ entryRouter imported successfully");
const hostname = '127.0.0.1';
const app = express();
const port = 5000;


app.use(cors());
app.use('/', express.static('public'));
app.use(express.json());


app.get('/api/', (req, res) => {
  console.log('get-pyyntö apin juureen havaittu');
  console.log(req.url);
  res.send('Welcome to my REST API!');
});

app.use('/api/users', userRouter);
app.use('/api/entries', entryRouter);
app.use('/api/auth', authRouter);

app.get('/api/items', getItems);
app.get('/api/items/:id', getItemById);
app.post('/api/items', addItem);
app.put('/api/items/:id/', updateItem);
app.delete('/api/items/:id/', deleteItem);





app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
