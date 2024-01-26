import express, { Request, Response } from 'express';
import { connectToDatabase, sequelize } from './util/db';

const app = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript Express!');
});

const start = async () => {
  await connectToDatabase()
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

start()