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
  type Query {
        message: String
        populate: Int
        fetch_random_movie: [Movie]
        fetch_specific_movie(_id: String): Movie
        post_Movie(_id: String, date: String, review: String): String
    }

    type Movie {
      id:ID!
      link: String
      metascore: Int
      rating: Int
      title: String
      year: Int
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
      await collection.insertMany(
      movies);
          return collection.countDocuments();
    },
    // => GET /movies | Random movies
    fetch_random_movie: async () => {
      const random_movie = await collection.aggregate([{$sample: {size: 1}}]).toArray();
      return random_movie;
    },
    // => GET /movies/:id
    fetch_specific_movie: async(root,{_id}) => {
      const movie = await collection.findOne({ "id":_id});
      return movie;
    },
    post_Movie: async(root, {_id, date, review}) => {

      await collection.updateOne({ "id": _id },{$set : {"date": date, "review": review}});
      return "Post of "+ review + "at "+ date+"related to id: "+_id +" done ! ";
    //  return review + date+_id ;
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
