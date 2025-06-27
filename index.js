const { ApolloServer, PubSub } = require('apollo-server');
const mongoose = require('mongoose');
require('dotenv').config();

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const { MONGODB } = require('./config');

const pubsub = new PubSub();

const PORT = process.env.PORT || 5000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub }),
  // CORS configuration for Render
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://your-frontend-app.onrender.com', 'https://social-media-dmd.netlify.app']
      : ['http://localhost:3000'],
    credentials: true
  },
  // Security settings
  introspection: process.env.NODE_ENV !== 'production',
  playground: process.env.NODE_ENV !== 'production'
});

mongoose
  .connect(MONGODB, { 
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('MongoDB Connected');
    return server.listen({ port: PORT });
  })
  .then((res) => {
    console.log(`Server running at ${res.url}`);
  })
  .catch(err => {
    console.error('Error starting server:', err);
    process.exit(1);
  });
