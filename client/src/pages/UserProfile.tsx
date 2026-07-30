import React from 'react';
import { useQuery } from '@apollo/client';
import { RouteComponentProps } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  Avatar,
  SimpleGrid,
  Spinner,
  Center,
  HStack,
  Badge,
  Card,
  CardBody,
  useColorModeValue
} from '@chakra-ui/react';

import PostCard from '../components/PostCard';
import { FETCH_POSTS_QUERY } from '../util/graphql';
import { Post } from '../types';

interface MatchParams {
  username: string;
}

function UserProfile(props: RouteComponentProps<MatchParams>) {
  const username = props.match.params.username;

  const cardBg = useColorModeValue('white', 'gray.800');
  const cardBorder = useColorModeValue('gray.200', 'gray.700');

  const {
    loading,
    data: { getPosts: allPosts } = {}
  } = useQuery<{ getPosts: Post[] }>(FETCH_POSTS_QUERY);

  if (loading) {
    return (
      <Center py={10}>
        <Spinner size="xl" color="teal.500" thickness="4px" />
      </Center>
    );
  }

  const userPosts = allPosts ? allPosts.filter((post) => post.username === username) : [];
  const totalLikes = userPosts.reduce((acc, post) => acc + post.likeCount, 0);
  const avatarUrl = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(username)}`;

  return (
    <Box maxW="container.lg" mx="auto">
      <Card bg={cardBg} border="1px solid" borderColor={cardBorder} borderRadius="xl" boxShadow="md" mb={8} p={4}>
        <CardBody>
          <HStack spacing={6} align="center">
            <Avatar name={username} src={avatarUrl} size="2xl" border="4px solid" borderColor="teal.400" />
            <Box>
              <Heading size="lg" color="teal.500">
                {username}
              </Heading>
              <Text color="gray.500" fontSize="sm" mt={1}>
                User Profile
              </Text>
              <HStack spacing={3} mt={4}>
                <Badge colorScheme="teal" px={3} py={1} borderRadius="full" fontSize="sm">
                  {userPosts.length} {userPosts.length === 1 ? 'Post' : 'Posts'}
                </Badge>
                <Badge colorScheme="pink" px={3} py={1} borderRadius="full" fontSize="sm">
                  {totalLikes} {totalLikes === 1 ? 'Like' : 'Likes'} Received
                </Badge>
              </HStack>
            </Box>
          </HStack>
        </CardBody>
      </Card>

      <Heading size="md" mb={4} color="teal.600">
        Posts by @{username}
      </Heading>

      {userPosts.length === 0 ? (
        <Text color="gray.500" py={6}>
          This user hasn't created any posts yet.
        </Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {userPosts.map((post) => (
            <Box key={post.id}>
              <PostCard post={post} />
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
}

export default UserProfile;
