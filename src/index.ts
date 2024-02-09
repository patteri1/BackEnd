import express from 'express'
import { ApolloServer } from '@apollo/server'
import cors from 'cors'
import { expressMiddleware } from '@apollo/server/express4'

import { schema } from './graphql/schema'
import { connectToDatabase, initializeAdminUser, initializeRoles, sequelize } from './util/db'
import { insertTestData } from './util/insertTestData'
import { PostalCode, User } from './model/index'
import { createContext } from './graphql/context'

const app = express();
const port = 3000;

const start = async () => {
  // check that .env is correctly setup
  if (!process.env.SECRET) {
    console.error('ERROR: SECRET is not set in dotenv.');
    process.exit(1);
  }

  if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
    console.error('ERROR: ADMIN_USERNAME or ADMIN_PASSWORD is not set in dotenv.');
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
  app.use('/graphql', expressMiddleware(apollo, { context: createContext }))

  // set up database
  await connectToDatabase()
  await sequelize.sync({ force: true }) // create or update tables in the database to match model definitions
  await initializeRoles()
  await initializeAdminUser()
  
  // insert testdata
  await insertTestData()

  // start express
  app.listen(port, () => {
    console.log(`🚅 Express is running at http://localhost:${port}`);
    console.log(`🚀 Apollo is running at http://localhost:${port}/graphql`);
  });
}

start()