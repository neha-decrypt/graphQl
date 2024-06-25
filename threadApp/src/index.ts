const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const bodyParser = require('body-parser');


async function startServer() {
    const app = express();

    // Define typeDefs and resolvers
    const typeDefs = `
     type Query{
        hello:String
        say(name:String):String
     }  
    `;

    const resolvers = {
        Query: {
            hello: () => "Go To Hell",
            say: (_: { _: any }, { name }: { name: String }) => "Hi Neha" + name
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
