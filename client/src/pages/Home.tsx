import React, { useContext, useState } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import {
  SimpleGrid,
  Heading,
  Spinner,
  Box,
  Center,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
  Text,
  useColorModeValue
} from '@chakra-ui/react';
import { FaSearch, FaTimes } from 'react-icons/fa';

import { AuthContext } from '../context/auth';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { FETCH_POSTS_QUERY, SEARCH_POSTS_QUERY } from '../util/graphql';
import { Post } from '../types';

function Home() {
  const { user } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState('');

  const inputBg = useColorModeValue('white', 'gray.800');
  const inputBorder = useColorModeValue('gray.200', 'gray.700');

  const {
    loading: initialLoading,
    data: initialData
  } = useQuery<{ getPosts: Post[] }>(FETCH_POSTS_QUERY);

  const [executeSearch, { loading: searchLoading, data: searchData }] = useLazyQuery<{
    searchPosts: Post[];
  }>(SEARCH_POSTS_QUERY);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (val.trim() !== '') {
      executeSearch({ variables: { searchTerm: val } });
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const isSearching = searchTerm.trim() !== '';
  const posts = isSearching
    ? searchData?.searchPosts
    : initialData?.getPosts;
  const isLoading = isSearching ? searchLoading : initialLoading;

  return (
    <Box>
      <Heading as="h1" size="xl" mb={6} textAlign="center" color="teal.600">
        Recent Posts
      </Heading>

      <Box maxW="md" mx="auto" mb={6}>
        <InputGroup size="lg">
          <InputLeftElement pointerEvents="none">
            {React.createElement(FaSearch as any, { color: 'gray.400' })}
          </InputLeftElement>
          <Input
            placeholder="Search posts (powered by Inverted Index)..."
            value={searchTerm}
            onChange={handleSearchChange}
            bg={inputBg}
            borderColor={inputBorder}
            focusBorderColor="teal.400"
            borderRadius="full"
            shadow="sm"
          />
          {searchTerm && (
            <InputRightElement>
              <IconButton
                aria-label="Clear search"
                icon={React.createElement(FaTimes as any)}
                size="sm"
                variant="ghost"
                borderRadius="full"
                onClick={handleClearSearch}
              />
            </InputRightElement>
          )}
        </InputGroup>
      </Box>

      {user && <PostForm />}

      {isLoading ? (
        <Center py={10}>
          <Spinner size="xl" color="teal.500" thickness="4px" />
        </Center>
      ) : posts && posts.length > 0 ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {posts.map((post) => (
            <Box key={post.id}>
              <PostCard post={post} />
            </Box>
          ))}
        </SimpleGrid>
      ) : (
        <Center py={10}>
          <Text color="gray.500" fontSize="lg">
            {isSearching ? `No posts found matching "${searchTerm}"` : 'No posts yet.'}
          </Text>
        </Center>
      )}
    </Box>
  );
}

export default Home;
