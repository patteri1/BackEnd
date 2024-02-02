import express from 'express'
import { ApolloServer } from '@apollo/server'
import cors from 'cors'
import { expressMiddleware } from '@apollo/server/express4'

import { schema } from './graphql/schema'
import { connectToDatabase, initializeRoles, sequelize } from './util/db'

const app = express();
const port = 3000;

const start = async () => {
  // check that .env is correctly setup
  if (!process.env.SECRET) {
    console.error('ERROR: SECRET is not set in dotenv.');
    process.exit(1);
  }


  // set up Apollo Server
  const apollo = new ApolloServer({
    schema,
  })

  // start apollo
  await apollo.start()

  // set up middleware
  app.use(cors());
  app.use(express.json())
  app.use('/graphql', expressMiddleware(apollo))

  // set up database
  await connectToDatabase()
  await sequelize.sync() // create or update tables in the database to match model definitions
  await initializeRoles()

  // start express
  app.listen(port, () => {
    console.log(`🚅 Express is running at http://localhost:${port}`);
    console.log(`🚀 Apollo is running at http://localhost:${port}/graphql`);
  });
}

start()