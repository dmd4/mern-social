# Social Media website with React, Chakra UI, Node.js & GraphQL

## Website 
[https://mern-social-dd.netlify.app/](https://mern-social-dd.netlify.app/)

**Note**: Backend is hosted on Render's free tier and may take 20-30 seconds to wake up on first request after inactivity.

## Features
- **Authentication**: Sign up & Log in with hashed passwords (bcrypt) and JWT tokens
- **Social Feed**: Create posts with instant UI cache updates
- **Interactions**: Like/unlike posts and comment on posts
- **UI/UX System**: Modern **Chakra UI** components, Dark/Light Mode toggle, responsive grids, and floating toast notifications
- **Testing**: Native Node.js backend unit tests and React Testing Library frontend component tests

## Tech Stack
- **Frontend**: TypeScript, React, **Chakra UI**, Apollo Client (`@apollo/client`), React Router
- **Backend**: Node.js, Express, GraphQL (**Apollo Server**), MongoDB (Mongoose)
- **Authentication**: JWT, bcryptjs
- **Testing**: Node.js Native Test Runner (`tsx --test`), React Testing Library, Jest
- **Cloud Deployment**: Render (Backend) + Netlify (Frontend) + MongoDB Atlas

## Local Development Setup

### 1. Backend Setup
```bash
# Install dependencies
npm install

# Run backend server in development mode
npm run dev

# Run backend unit tests
npm test
```
The backend server runs at `http://localhost:5000` (GraphQL endpoint at `http://localhost:5000`).

### 2. Frontend Setup
```bash
# Navigate to client directory
cd client

# Install dependencies
npm install --legacy-peer-deps

# Start React app
npm start

# Run frontend tests
npm test -- --watchAll=false
```
The frontend application runs at `http://localhost:3000`.

## Environment Variables

### Backend (`.env` in root directory)
```env
MONGODB_URI=your_mongodb_atlas_connection_string
SECRET_KEY=your_jwt_secret_key
NODE_ENV=development
PORT=5000
```

### Frontend (`.env` in `client/` directory)
```env
REACT_APP_GRAPHQL_URI=http://localhost:5000
```

## Deployment

### Backend (Render)
1. Create a Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Settings:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment Variables**: Set `MONGODB_URI`, `SECRET_KEY`, `NODE_ENV=production`

### Frontend (Netlify)
1. Build client: `cd client && npm run build`
2. Deploy the `build` folder to Netlify
3. Configure `REACT_APP_GRAPHQL_URI` to point to your deployed Render URL

---

#### Tags
full-stack, front-end, back-end, TypeScript, Node.js, GraphQL, Apollo-Client, Apollo-Server, Chakra-UI, MongoDB, React, Render, Netlify