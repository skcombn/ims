const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const serverless = require('serverless-http');
const { query } = require('./schema/query');
const { mutation } = require('./schema/mutation');

const { GraphQLSchema } = require('graphql');

const schema = new GraphQLSchema({
  query,
  mutation,
});

// enable cors
var corsOptions = {
  origin: 'http://localhost:4000/graphql',
  credentials: true, // <-- REQUIRED backend setting
};

const app = express();
// app.use(cors());
app.use(bodyParser.json());
app.use(
  '/',
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

module.exports.handler = serverless(app);
