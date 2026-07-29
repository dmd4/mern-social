import dotenv from 'dotenv';
dotenv.config();

export const MONGODB = process.env.MONGODB_URI || '';
export const SECRET_KEY = process.env.SECRET_KEY || 'some secret key';
