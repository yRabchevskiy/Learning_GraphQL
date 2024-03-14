const { ApolloServer } = require('apollo-server')

const users = [];
let _id = 0;

const typeDefs = `
    enum SexType {
        MALE
        FEMALE
    }
    type User {
        id: ID!
        name: String!
        age: Int!
        sexType: SexType!
    }
    input PostUserInput {
        name: String!
        age: Int!
        sexType: SexType=MALE
    }
    type Query {
        totalUsers: Int!
        getUsers: [User]
    }
    type Mutation {
        addUser(input: PostUserInput!): User!
    }
`

const resolvers = {
    Query: {
        totalUsers: () => users.length,
        getUsers: () => users
    },
    Mutation: {
        addUser(parent, args) {
            console.log(args)
            let user = {
                id: _id++,
                ...args.input
            }
            users.push(user);
            return user;
        }
    }

    /**
     * Тривіальний розпізнавач
     * Photo: {
     *  url: parent => `http://somesite.com/img/${parent.id}.jpg`
     * }
     */
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