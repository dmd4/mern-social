import { ApolloServer, PubSub } from 'apollo-server';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';
import { MONGODB } from './config';

const pubsub = new PubSub();

const PORT = process.env.PORT || 5000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }: { req: any }) => ({ req, pubsub }),
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://your-frontend-app.onrender.com', 'https://social-media-dmd.netlify.app']
      : ['http://localhost:3000'],
    credentials: true
  },
  introspection: process.env.NODE_ENV !== 'production',
  playground: process.env.NODE_ENV !== 'production'
});

mongoose
  .connect(MONGODB)
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
