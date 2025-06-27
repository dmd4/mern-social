# Social Media website with React, Node.js

## Website: 
[https://mern-social-dd.netlify.app/](https://mern-social-dd.netlify.app/)

**Note**: Backend is hosted on Render's free tier and may take 20-30 seconds to wake up on first request after inactivity.

## Features
- Sign up, log in (hash password, token)    
- Make a new post         
- Like, comment on a posts       
- To be developed: Follow and Unfollow; Private/public posts; Profile customization; Post picture, audio; Direct Messaging; Share; Save post; Report post/user; Two-factor authenticator; etc.  

## Tech stack
- React
- Node.js
- GraphQL 
- MongoDB for database
- Render + Netlify + Git for cloud deployment

## Set up on local server
```bash
git clone git@bitbucket.org:xdmd/web.git
cd web
npm start
```
If you have all the required packages (node, MongoDB, etc.), the server now starts at http://localhost:5000  

Next, open a new terminal to start client
```bash
cd web/client
npm start
```
The website is at http://localhost:3000  
You can register a new username, log in, make a post, like and comment.  

## Environment Variables

### Backend Environment Variables
Create a `.env` file in the root directory with:
```
MONGODB_URI=your_mongodb_atlas_connection_string
SECRET_KEY=your_jwt_secret_key
NODE_ENV=development
PORT=5000
```

**Where to find these:**
- **MONGODB_URI**: Get from [MongoDB Atlas](https://cloud.mongodb.com) → Connect → Connect your application
- **SECRET_KEY**: Any secure random string (e.g., `my_super_secret_jwt_key_2024`)
- **NODE_ENV**: `development` for local, `production` for deployment
- **PORT**: Server port (default: 5000)

### Frontend Environment Variables
Create a `.env` file in the `client` directory with:
```
REACT_APP_GRAPHQL_URI=http://localhost:5000
```

For production deployment, set:
```
REACT_APP_GRAPHQL_URI=https://your-render-backend-url.onrender.com
```

## Deployment

### Backend (Render)
1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Use these settings:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
4. Add environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `SECRET_KEY`: Your JWT secret key
   - `NODE_ENV`: production

### Frontend (Netlify)
1. Build the client: `cd client && npm run build`
2. Deploy the `build` folder to Netlify
3. Update the GraphQL endpoint in your React app to point to your Render backend URL

#### Tags
full-stack, front-end, back-end, Node.js, GraphQL, MongoDB, React, Render    

## Screenshots

### User Registration & Authentication
![Registration error when username already exists](/images/Register.PNG)   
*Registration form showing validation error when attempting to create an account with an existing username*

![Login error with incorrect credentials](/images/Login.PNG)   
*Login form displaying error message when user enters wrong username or password*

### Post Creation & Interaction
![Creating a new post](/images/CreatePost.PNG)   
*Post creation interface where users can write and publish new posts to their feed*

![Liking and commenting on posts](/images/LikeComment.PNG)   
*Post interaction features showing like/unlike functionality and comment system in action* 