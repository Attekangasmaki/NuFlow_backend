import express from 'express';
import cors from 'cors';
import userRouter from './routes/user-router.js';
import metricsRouter from './routes/metrics-router.js';
import entryRouter from './routes/entries-router.js';
import authRouter from './routes/auth-router.js';
import { notFoundHandler, errorHandler } from '../middlewares/error-handler.js';
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
app.use('/api/metrics', metricsRouter);

// 404 Not Found
app.use(notFoundHandler);
//Yleinen virhevastausten lähettäjä kaikkia virhetilanteita varten
app.use(errorHandler);


app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});


