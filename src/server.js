const mongoose = require('mongoose')
const {ApolloServer, gql} = require('apollo-server')

const {
  DB_USERNAME = 'admin',
  DB_PASSWORD = 'secret',
  DB_HOST = '172.17.0.2', // docker inspect mongodb
  DB_PORT = 27017, // Default port for Mongo
  DB_NAME = 'chat'
} = process.env

mongoose.connect(`mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`)
  .then(() => {
    // This is a collection of books I'll be able to query
    // the GraphQL server for.  A more complete example might fetch
    // from an existing data source like a REST API or database.
    const books = [
      {
        title: 'Harry Potter and the Chamber of Secrets',
        author: 'J.K. Rowling'
      },
      {
        title: 'Jurassic Park',
        author: 'Michael Crichton'
      }
    ]

    // Type definitions define the "shape" of my data and specify
    // which ways the data can be fetched from the GraphQL server.
    const typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.

  # This "Book" type can be used in other type declarations.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is the root of all GraphQL queries.
  # (A "Mutation" type will be covered later on.)
  type Query {
    books: [Book]
  }
`

    // Resolvers define the technique for fetching the types in the
    // schema.  I'll retrieve books from the "books" array above.
    const resolvers = {
      Query: {
        books: () => books
      }
    }

    // In the most basic sense, the ApolloServer can be started
    // by passing type definitions (typeDefs) and the resolvers
    // responsible for fetching the data for those types.
    const server = new ApolloServer({ typeDefs, resolvers })

    // This `listen` method launches a web-server.  Existing apps
    // can utilize middleware options, which we'll discuss later.
    server.listen().then(({ url }) => {
      console.log(`🚀  Server ready at ${url}`)
    })
  })
    .catch(err => console.error)
