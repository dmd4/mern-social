import React, { useContext } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Avatar, Heading, Text, Flex, Box, Button, HStack, Image, useColorModeValue } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { FaComment } from 'react-icons/fa';

import { AuthContext } from '../context/auth';
import LikeButton from './LikeButton';
import DeleteButton from './DeleteButton';
import MyPopup from '../util/MyPopup';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
}

const extractImageUrl = (text: string): { textWithoutUrl: string; imageUrl?: string } => {
  const urlRegex = /(https?:\/\/[^\s]+?\.(?:png|jpg|jpeg|gif|webp|svg))/i;
  const match = text.match(urlRegex);
  if (match) {
    return {
      imageUrl: match[0],
      textWithoutUrl: text.replace(match[0], '').trim()
    };
  }
  return { textWithoutUrl: text };
};

function PostCard({
  post: { body, createdAt, id, username, likeCount, commentCount, likes }
}: PostCardProps) {
  const { user } = useContext(AuthContext);
  const { textWithoutUrl, imageUrl } = extractImageUrl(body);
  const avatarUrl = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(username)}`;

  const cardBg = useColorModeValue('white', 'gray.800');
  const cardBorder = useColorModeValue('gray.200', 'gray.700');
  const bodyTextColor = useColorModeValue('gray.800', 'gray.100');
  const timeTextColor = useColorModeValue('gray.500', 'gray.400');

  return (
    <Card
      bg={cardBg}
      border="1px solid"
      borderColor={cardBorder}
      borderRadius="lg"
      boxShadow="md"
      _hover={{ shadow: 'xl', transform: 'translateY(-2px)' }}
      transition="all 0.2s"
      height="100%"
    >
      <CardHeader pb={2}>
        <Flex align="center" justify="space-between">
          <Flex flex="1" gap="3" alignItems="center">
            <Avatar name={username} src={avatarUrl} size="sm" bg="teal.500" />
            <Box>
              <Heading size="sm">{username}</Heading>
              <Text fontSize="xs" color={timeTextColor} as={Link} to={`/posts/${id}`}>
                {moment(createdAt).fromNow(true)} ago
              </Text>
            </Box>
          </Flex>
          {user && user.username === username && <DeleteButton postId={id} />}
        </Flex>
      </CardHeader>
      <CardBody py={2}>
        {textWithoutUrl && (
          <Text color={bodyTextColor} fontSize="md" mb={imageUrl ? 3 : 0}>
            {textWithoutUrl}
          </Text>
        )}
        {imageUrl && (
          <Image
            src={imageUrl}
            alt="Post media"
            borderRadius="md"
            maxH="250px"
            w="100%"
            objectFit="cover"
            fallbackSrc="https://via.placeholder.com/400x200?text=Image+Unavailable"
          />
        )}
      </CardBody>
      <CardFooter pt={2}>
        <HStack spacing={3}>
          <LikeButton user={user} post={{ id, likes, likeCount }} />
          <MyPopup content="Comment on post">
            <Button
              as={Link}
              to={`/posts/${id}`}
              colorScheme="blue"
              variant="outline"
              leftIcon={React.createElement(FaComment as any)}
              size="sm"
            >
              <Text ml={1}>{commentCount}</Text>
            </Button>
          </MyPopup>
        </HStack>
      </CardFooter>
    </Card>
  );
}

export default PostCard;
