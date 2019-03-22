const resolvers = {
  Query: {
    // GET /movies/populate
    populate: async () => {
      // Get movies From the RestAPI
     const movies = await imdb(DENZEL_IMDB_ID);
			collection.insertMany(
			movies);
          return "Document inserted : "+collection.countDocuments();
    },
    // => GET /movies | Random movies
    fetch_random_movie: async () => {
      const random_movie = collection.find({}).toArray((error, result) => {
          const random = Math.floor(Math.random() * Math.floor(result.length));
          response.send(result[random]);
      });
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
  },
};
export default resolvers;
