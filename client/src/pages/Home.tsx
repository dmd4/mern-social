import React, { useContext } from 'react';
import { useQuery } from '@apollo/client';
import { SimpleGrid, Heading, Spinner, Box, Center } from '@chakra-ui/react';

import { AuthContext } from '../context/auth';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { FETCH_POSTS_QUERY } from '../util/graphql';
import { Post } from '../types';

function Home() {
  const { user } = useContext(AuthContext);
  const {
    loading,
    data: { getPosts: posts } = {}
  } = useQuery<{ getPosts: Post[] }>(FETCH_POSTS_QUERY);

  return (
    <Box>
      <Heading as="h1" size="xl" mb={6} textAlign="center" color="teal.600">
        Recent Posts
      </Heading>
      {user && <PostForm />}
      {loading ? (
        <Center py={10}>
          <Spinner size="xl" color="teal.500" thickness="4px" />
        </Center>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {posts &&
            posts.map((post) => (
              <Box key={post.id}>
                <PostCard post={post} />
              </Box>
            ))}
        </SimpleGrid>
      )}
    </Box>
  );
}

export default Home;
