const resolvers = {
  Query: {
    movie: async(root, {_id}) => {
      return await collection.findOne({"id": _id});
    },
    RandomMovie: async () => {
      const movies = collection.aggregate([{$sample: {size: 1}}]).toArray();
      return movies;
    },
    FetchMovie: async () => {
      if(limit == undefined) {
        limit = 5;
      }
      if(metascore == undefined) {
        metascore = 0;
      }
      return collection.aggregate([{$match: {"metascore": {$gte: Number(metascore)}}}, {$limit: Number(limit)}, {$sort: {"metascore": -1}}]).toArray();
    },
    PostMovie: async () => {
      collection.updateOne({"id": _id}, {$set: {"date": date, "review": review}});
      return "insert into "+_id +" of the element "+date+" "+review+" succesfully";
    },
    populate: async () => {
    const sandbox = require('./sandbox');
    }
  },
};

export default resolvers;
