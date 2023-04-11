const express = require('express');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema');
const connectDB = require('./db');


connectDB();
const port = process.env.PORT || 3002;

const app = express();
app.use(cors());
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true
  })
);

const appProcess = app.listen(port, console.log(`Server running on port ${port}`));