const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const bodyParser = require('body-parser');
const axios = require('axios');
const { TODOS, USERS } = require('./data');

async function startServer() {
    const app = express();

    // Define typeDefs and resolvers
    const typeDefs = `
        type User {
            id: ID!
            username: String!
            website: String!
            name: String!
            email: String!
        }
        type Todo {
            id: ID!
            userId: Int
            title: String!
            completed: Boolean
            user: User
        }
        type Query {
            getTodos: [Todo]
            getUsers: [User]
            getUserById(id: ID!): User
        }
    `;

    const resolvers = {
        Todo: {
            user: (todo) => {
                try {
                    return USERS.find((u) => u.id == todo.userId)
                } catch (error) {
                    console.error(`Failed to fetch user for todo with id ${todo.id}`, error);
                    throw new Error('Failed to fetch user');
                }
            }
        },
        Query: {
            getTodos: () => {
                try {
                    return TODOS
                } catch (error) {
                    console.error('Failed to fetch todos', error);
                    throw new Error('Failed to fetch todos');
                }
            },
            getUsers: () => {
                try {
                    return USERS
                } catch (error) {
                    console.error('Failed to fetch users', error);
                    throw new Error('Failed to fetch users');
                }
            },
            getUserById: async (parent, { id }) => {
                try {
                    return USERS.find((u) => u.id == id)
                } catch (error) {
                    console.error(`Failed to fetch user with id ${id}`, error);
                    throw new Error('Failed to fetch user');
                }
            }
        }
    };

    // Initialize Apollo Server
    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });

    await server.start();

    // Apply middleware
    app.use(cors());
    app.use(bodyParser.json());
    app.use('/graphql', expressMiddleware(server));

    // Start server
    app.listen(8000, () => {
        console.log('Server Started At Port 8000');
    });
}

startServer();
