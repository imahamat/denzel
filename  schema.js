const typeDefs = `
type Movie {
  id: ID! # the ! means that every author object _must_ have an id
  link: String
  methascore: Int
  """
  the list of Posts by this author
  """
  poster: String
  rating: Int
  synopsis: String
  title: String
  votes: Int
  year: Int
}

# the schema allows the following query:
type Query {
  movie(_id: String): Movie
  RandomMovie: [Movie]
  FetchMovie(limit: Int, metascore: Int): [Movie]
  PostMovie(_id: String, date: String, review: String): String
  populate: Int
}

# we need to tell the server which types represent the root query
# and root mutation types. We call them RootQuery and RootMutation by convention.
schema {
  query: Query
  movie: Movie
}
`;

export default typeDefs;
