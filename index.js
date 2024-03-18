const { ApolloServer } = require('apollo-server');
const { GraphQLScalarType } = require('graphql');

const users = [
    { id: 1, name: "Yura", age: 35, rang: "SOLDIER" },
    { id: 2, name: "Oksana", age: 37, rang: "SOLDIER" },
    { id: 3, name: "Yurii", age: 38, rang: "OFFICER" }
];
const tasks = [
    { id: 1, name: "Teach", start: '2007-12-03T10:15:30Z', end: '2007-12-03T10:15:30Z', category: "STUDY", ownerId: 1 },
    { id: 2, name: "Test", start: '2007-12-03T10:15:30Z', end: '2007-12-03T10:15:30Z', category: "WORK", ownerId: 2 },
    { id: 3, name: "Develop", start: '2007-12-03T10:15:30Z', end: '2007-12-03T10:15:30Z', category: "STUDY", ownerId: 3 },
    { id: 4, name: "Eat", start: '2007-12-03T10:15:30Z', end: '2007-12-03T10:15:30Z', category: "WORK", ownerId: 1 },
];
let _userId = 0;
let _taskId = 0;

const typeDefs = `
    enum RangType {
        SOLDIER
        OFFICER
    }
    enum TaskCategoryType {
        WORK
        STUDY
    }
    scalar DateTime
    type Task {
        id: ID!
        name: String!
        start: DateTime!
        end: DateTime!
        category: TaskCategoryType!
        createdBy: User!
    }
    type User {
        id: ID!
        name: String!
        age: Int!
        rang: RangType!
        tasks: [Task!]!
    }
    input PostUserInput {
        name: String!
        age: Int!
        rang: RangType=SOLDIER
    }
    type Query {
        totalUsers: Int!
        getUsers: [User]
        getTasks: [Task]
        getUserById(id: Int!): User!
    }
    type Mutation {
        addUser(input: PostUserInput!): User!
    }
`

const resolvers = {
    Query: {
        totalUsers: () => users.length,
        getUsers: () => users,
        getTasks: () => tasks,
        getUserById: (parent, { id }) => {
            return users.find(u => u.id === id)
        }
    },
    Mutation: {
        addUser(parent, args) {
            console.log(args)
            let user = {
                id: _userId++,
                ...args.input
            }
            users.push(user);
            return user;
        }
    },
    User: {
        tasks: parent => {
            return tasks.filter(u => u.ownerId === parent.id);
        }
    },
    Task: {
        createdBy: parent => {
            return users.find(t => t.id === parent.ownerId);
        }
    },
    DateTime: new GraphQLScalarType({
        name: "DateTime",
        description: 'Valid datetime',
        parseValue: value => new Date(value),
        parseLiteral: data => data.value,
        serialize: value => new Date(value).toISOString()
    })

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