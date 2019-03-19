const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

const DENZEL_IMDB_ID = 'nm0000243';
const imdb = require('./src/imdb');

const CONNECTION_URL = "mongodb+srv://example:JsnMl5Ja9.@nraboy-sample-cgn3u.mongodb.net/test?retryWrites=true";
const DATABASE_NAME = "Denzel";

var app = Express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

var database, collection;

// Import schema and resolvers
import { makeExecutableSchema } from 'graphql-tools';

const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// use(homepath, graphqlhttp)
app.use('/graphql', require('express-graphql')) {
  schema: executableSchema,
  graphql: true
}

// Listen to localhost:9292
app.listen(9292, () => {
    MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
        collection = database.collection("Denzel");
        console.log("Connected to `" + DATABASE_NAME + "`!");
    });
});
