import express from 'express';
import routes from './routes';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', routes);
app.get('/', (_req, res) => {
  res.send('Hello World!');
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log('Server is running on port ', PORT);
});