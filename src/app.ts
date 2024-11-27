import express, { Application } from 'express';
import routes from './routes';
import cors from 'cors';

const app: Application = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({message: 'Hello World!'});
});

app.use('/api', routes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});