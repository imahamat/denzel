const typeDefs = `
type Movie {
  id: ID! #
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
  # GET /movies/populate
  populate: Int

  # => GET /movies | Random movies
  fecth_random_movie: [Movie]

  # => GET /movies/:id
  fecth_specific_movie : Movie

  # => GET /movies/search
  # search_Movie(limit: Int, metascore: Int): [Movie]

  # => POST /movies/:id
  post_Movie(_id: String, date: String, review: String): String
}

schema {
  query: Query
}
`;

export default typeDefs;
