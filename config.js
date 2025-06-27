require('dotenv').config();

module.exports = {
    MONGODB: process.env.MONGODB_URI,
    SECRET_KEY: process.env.SECRET_KEY
};