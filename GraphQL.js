const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const CONNECTION_URL = "mongodb+srv://example:JsnMl5Ja9.@nraboy-sample-cgn3u.mongodb.net/test?retryWrites=true";
const DATABASE_NAME = "Denzel";
const DENZEL_IMDB_ID = 'nm0000243';
const imdb = require('./src/imdb');

var { buildSchema } = require('graphql');

// Create an express server and a GraphQL endpoint
var app = Express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

var database, collection;

// Connect to Mongo DB
MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
    if(error) {
        throw error;
    }
    database = client.db(DATABASE_NAME);
    collection = database.collection("Denzel");
    console.log("Connected to `" + DATABASE_NAME + "`!");
});
// => GET /movies/search
// search_Movie(limit: Int, metascore: Int): [Movie]

// GraphQL schema
var schema = buildSchema(`
  type Movie {
    id: ID!
    link: String
    metascore: Int
    poster: String
    rating: Int
    synopsis: String
    title: String
    votes: Int
    year: Int
  }
  
  type Query {
    message: String
    populate: Int    # GET /movies/populate
    fecth_random_movie: [Movie]   # => GET /movies | Random movies
    fecth_specific_movie : Movie  # => GET /movies/:id
    post_Movie(_id: String, date: String, review: String): String  # => POST /movies/:id
  }

  schema {
    query: Query
  }

`);

// Root resolver
var root = {
    Query: {
       message: () => 'Hello World!',
      // GET /movies/populate
      populate: async () => {
        // Get movies From the RestAPI
       const DENZEL_IMDB_ID = 'nm0000243';
       const sandbox = require('./sandbox')
       // const movies = await imdb(DENZEL_IMDB_ID);
       const movies = await sandbox.movies;
        collection.insertMany(
        movies);
            return collection.countDocuments();
      },
      // => GET /movies | Random movies
      fetch_random_movie: async () => {
        const random_movie = collection.find({}).toArray((error, result) => {
            const random = Math.floor(Math.random() * Math.floor(result.length));
            response.send(result[random]);
        })
        //const movies = collection.aggregate([{$sample: {size: 1}}]).toArray();
        return random_movie;
      },
      // => GET /movies/:id
      fecth_specific_movie: async() => {
        const ObjectId = require("mongodb").ObjectID;
        const movie = collection.findOne({ "_id": new ObjectId(request.params.id)});
        return movie;
        //return await collection.findOne({"_id": _id});
      },
      // => GET /movies/search
      /*search_Movie: async () => {
        if(limit == undefined) {
          limit = 5;
        }
        if(metascore == undefined) {
          metascore = 0;
        }
        return collection.aggregate([{$match: {"metascore": {$gte: Number(metascore)}}}, {$limit: Number(limit)}, {$sort: {"metascore": -1}}]).toArray();
      },*/
      // => POST /movies/:id
      // Function to post movie
      post_Movie: async () => {
        collection.updateOne({ "_id": new ObjectId(request.params.id) },{$set : {"date": date, "review": review}});
      //  collection.updateOne({"id": _id}, {$set: {"date": date, "review": review}});
        return "Post of "+ review + "at "+ date+"related to id: "+new ObjectId(request.params.id) +" done ! ";
      },
    }
  };

// Create a GraphQL endpoint
app.use('/graphql', require('express-graphql') ({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

// Listen to localhost:9292
app.listen(9292, () => console.log('Express GraphQL Server Now Running On localhost:9292/graphql'));
