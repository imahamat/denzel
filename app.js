const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

const DENZEL_IMDB_ID = 'nm0000243';
const imdb = require('./src/imdb');
const sandbox = require('./sandbox');

const CONNECTION_URL = "mongodb+srv://example:JsnMl5Ja9.@nraboy-sample-cgn3u.mongodb.net/test?retryWrites=true";
const DATABASE_NAME = "Denzel";

var app = Express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

var database, collection;

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

// Implementation of REST endpoints

// => GET /movies/populate
// Populate the database with all the Denzel's movies from IMDb.
app.get("/movies/populate", async(request, response) => {
    // Get movies
    const movie = await imdb(DENZEL_IMDB_ID);
    //const movies = await sandbox.movies;
    collection = database.collection("Denzel");
    // Insert movies
    collection.insertMany(movie, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result.result);
    });
});

// => GET /movies

// Fetch a random must-watch movie.

app.get("/movies", (request, response) => {
    collection.find({}).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        const random_movie = Math.floor(Math.random() * Math.floor(result.length));
        response.send(result[random_movie]);
    });
});

// => GET /movies/:id
// Fetch a specific movie

app.get("/movies/:id", (request, response) => {
    collection = database.collection("Denzel");
    collection.findOne({ "_id": new ObjectId(request.params.id) }, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});



// => POST /movies/:id
// Save a watched date and a review

app.post("/movies/:id", (request, response) => {
    // register the date and the review from the body
    // date - the watched date
    const date = request.body.date;
    // review - the personal review
    const review = request.body.review;
    collection = database.collection("Denzel");
    collection.updateOne({ "_id": new ObjectId(request.params.id) },{$set : {"date": date, "review": review}}, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});


// => GET /movies/search
// Search for Denzel's movies

app.get("/movies/search", (request, response) => {
  // limit - number of movies to return (default: 5)
  var limit = request.query.limit;
  // metascore - filter by metascore (default: 0)
  var metascore = request.query.metascore;
  if(limit==undefined) {
    limit = 5;
  }
  if(metascore==undefined) {
    metascore = 0;
  }
   collection = database.collection("Denzel");
  // and we use aggreate function
    collection.aggregate([{$match: {"metascore": {$gte: Number(metascore)}}}, {$limit: Number(limit)}, {$sort: {"metascore": -1}}]).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});



// => GraphQL endpoints to implement
// Same definition as REST API with /graphql endpoint


// Populate the database


// Fetch a random must-watch movie


// Fetch a specific movie


// Search for Denzel's movies


// Save a watched date and review


// => Client Side
// ...............
// ....
