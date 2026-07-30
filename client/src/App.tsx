import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ChakraProvider, Container, Box } from '@chakra-ui/react';

import './App.css';

import { AuthProvider } from './context/auth';
import AuthRoute from './util/AuthRoute';

import MenuBar from './components/MenuBar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SinglePost from './pages/SinglePost';
import UserProfile from './pages/UserProfile';

function App() {
  return (
    <ChakraProvider>
      <AuthProvider>
        <Router>
          <Container maxW="container.lg" py={4}>
            <MenuBar />
            <Box mt={6}>
              <Route exact path="/" component={Home} />
              <AuthRoute exact path="/login" component={Login} />
              <AuthRoute exact path="/register" component={Register} />
              <Route exact path="/posts/:postId" component={SinglePost as any} />
              <Route exact path="/users/:username" component={UserProfile as any} />
            </Box>
          </Container>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
