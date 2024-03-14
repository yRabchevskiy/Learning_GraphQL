const { ApolloServer } = require('apollo-server')

const users = [];

const typeDefs = `
    type User {
        name: String!
        age: Int!
    }
    type Query {
        totalUsers: Int!
        getUsers: [User]
    }
    type Mutation {
        addUser(name: String! age: Int!): Boolean!
    }
`

const resolvers = {
    Query: {
        totalUsers: () => users.length,
        getUsers: () => users
    },
    Mutation: {
        addUser(parent, args) {
            users.push(args);
            return true;
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
});

server
    .listen()
    .then(({url}) => {
        console.log(`Server is running on ${url}`)
    })