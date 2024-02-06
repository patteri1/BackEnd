import express from 'express'
import { ApolloServer } from '@apollo/server'
import cors from 'cors'
import { expressMiddleware } from '@apollo/server/express4'

import { schema } from './graphql/schema'
import { connectToDatabase, sequelize } from './util/db'
import { insertTestData } from './util/insertTestData'
import { PostalCode } from './model/PostalCode'

const app = express();
const port = 3000;

const start = async () => {

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

  // connect and synchronise database
  await connectToDatabase()
  await sequelize.sync({ force: true }) // create or update tables in the database to match model definitions
  await PostalCode.sync();

  // insert testdata
  insertTestData()

  // start express
  app.listen(port, () => {
    console.log(`🚅 Express is running at http://localhost:${port}`);
    console.log(`🚀 Apollo is running at http://localhost:${port}/graphql`);
  });
}

start()