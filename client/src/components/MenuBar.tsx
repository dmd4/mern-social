import React, { useContext, useState } from 'react';
import { Flex, Button, HStack, Text, Spacer, IconButton, useColorMode } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { FaSun, FaMoon } from 'react-icons/fa';

import { AuthContext } from '../context/auth';

function MenuBar() {
  const { user, logout } = useContext(AuthContext);
  const { colorMode, toggleColorMode } = useColorMode();
  const location = useLocation();

  const path = location.pathname === '/' ? 'home' : location.pathname.substring(1);
  const [activeItem, setActiveItem] = useState(path);

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding={4}
      bg="teal.500"
      color="white"
      borderRadius="md"
      boxShadow="sm"
      mb={6}
    >
      <Flex align="center" mr={5}>
        <Text fontSize="xl" fontWeight="bold" letterSpacing="wide">
          <Link to="/" onClick={() => setActiveItem('home')}>
            MERN Social
          </Link>
        </Text>
      </Flex>

      <Spacer />

      <HStack spacing={3}>
        <IconButton
          aria-label="Toggle Color Mode"
          icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
          onClick={toggleColorMode}
          variant="ghost"
          colorScheme="teal"
          color="white"
          _hover={{ bg: 'teal.600' }}
        />

        {user ? (
          <>
            <Text fontWeight="semibold" color="teal.100">
              {user.username}
            </Text>
            <Button
              colorScheme="teal"
              variant="outline"
              _hover={{ bg: 'teal.600' }}
              onClick={logout}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button
              as={Link}
              to="/"
              variant={activeItem === 'home' ? 'solid' : 'ghost'}
              colorScheme="teal"
              _hover={{ bg: 'teal.600' }}
              onClick={() => setActiveItem('home')}
            >
              Home
            </Button>
            <Button
              as={Link}
              to="/login"
              variant={activeItem === 'login' ? 'solid' : 'ghost'}
              colorScheme="teal"
              _hover={{ bg: 'teal.600' }}
              onClick={() => setActiveItem('login')}
            >
              Login
            </Button>
            <Button
              as={Link}
              to="/register"
              variant={activeItem === 'register' ? 'solid' : 'ghost'}
              colorScheme="teal"
              _hover={{ bg: 'teal.600' }}
              onClick={() => setActiveItem('register')}
            >
              Register
            </Button>
          </>
        )}
      </HStack>
    </Flex>
  );
}

export default MenuBar;
