import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserInputError } from 'apollo-server';

import {
  validateRegisterInput,
  validateLoginInput
} from '../../util/validators';
import { SECRET_KEY } from '../../config';
import User, { IUser } from '../../models/User';

function generateToken(user: { id?: any; _id?: any; email: string; username: string }) {
  return jwt.sign(
    {
      id: user.id || user._id,
      email: user.email,
      username: user.username
    },
    SECRET_KEY,
    { expiresIn: '1h' }
  );
}

export const usersResolvers = {
  Mutation: {
    async login(_: any, { username, password }: any) {
      const { errors, valid } = validateLoginInput(username, password);

      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      const user = await User.findOne({ username });

      if (!user) {
        errors.general = 'Wrong crendetials';
        throw new UserInputError('Wrong crendetials', { errors });
      }

      const match = await bcrypt.compare(password, user.password || '');
      if (!match) {
        errors.general = 'Wrong crendetials';
        throw new UserInputError('Wrong crendetials', { errors });
      }

      const token = generateToken(user);

      return {
        ...(user as any)._doc,
        id: user._id,
        token
      };
    },
    async register(
      _: any,
      {
        registerInput: { username, email, password, confirmPassword }
      }: any
    ) {
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }
      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError('Unavailable username', {
          errors: {
            username: 'This username is unvailable'
          }
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        username,
        password: hashedPassword,
        createdAt: new Date().toISOString()
      });

      const res = await newUser.save();

      const token = generateToken(res);

      return {
        ...(res as any)._doc,
        id: res._id,
        token
      };
    }
  }
};

export default usersResolvers;
