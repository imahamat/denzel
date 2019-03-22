var Express = require('express');
var express_graphql = require('express-graphql');
var { buildSchema } = require('graphql');

const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const CONNECTION_URL = "mongodb+srv://example:JsnMl5Ja9.@nraboy-sample-cgn3u.mongodb.net/test?retryWrites=true";
const DATABASE_NAME = "Denzel";
const DENZEL_IMDB_ID = 'nm0000243';
const imdb = require('./src/imdb');

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

// GraphQL schema
var schema = buildSchema(`
  type Movie {
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
        populate: Int
        fecth_random_movie: [Movie]
        fecth_specific_movie : Movie
        post_Movie(_id: String, date: String, review: String): String
    }

`);
// Root resolver
var root = {
    message: () => 'Hello World!',
    // GET /movies/populate
    populate: async () => {
      // Get movies From the RestAPI
     const DENZEL_IMDB_ID = 'nm0000243';
     const movies = await imdb(DENZEL_IMDB_ID);
      collection.insertMany(
      movies);
          return collection.countDocuments();
    },
    // => GET /movies | Random movies
    fetch_random_movie: async () => {
      const random_movie = collection.aggregate([{$sample: {size: 1}}]).toArray();
      return random_movie;
    },
    // => GET /movies/:id
    fecth_specific_movie: async() => {
      const ObjectId = require("mongodb").ObjectID;
      const movie = collection.findOne({ "_id": new ObjectId(request.params.id)});
      return movie;
      //return await collection.findOne({"_id": _id});
    },
    post_Movie: async(root, {_id, date, review}) => {
      collection.updateOne({ "id": _id },{$set : {"date": date, "review": review}});
      return "Post of "+ review + "at "+ date+"related to id: "+_id +" done ! ";
    }
};
// Create an express server and a GraphQL endpoint
var app = Express();
app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));
app.listen(9292, () => console.log('Express GraphQL Server Now Running On localhost:9292/graphql'));
