import { AuthenticationError } from 'apollo-server';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config';

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  iat?: number;
  exp?: number;
}

export interface GraphQLContext {
  req: {
    headers: {
      authorization?: string;
      [key: string]: any;
    };
  };
  pubsub?: any;
}

export const checkAuth = (context: GraphQLContext): AuthUser => {
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split('Bearer ')[1];
    if (token) {
      try {
        const user = jwt.verify(token, SECRET_KEY) as AuthUser;
        return user;
      } catch (err) {
        throw new AuthenticationError('Invalid/Expired token');
      }
    }
    throw new Error("Authentication token must be 'Bearer [token]'");
  }
  throw new Error('Authorization header must be provided');
};

export default checkAuth;
