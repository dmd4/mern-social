import React, { useContext, useState, useRef } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/client';
import moment from 'moment';
import { RouteComponentProps } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  Input,
  Text,
  Avatar,
  VStack,
  HStack,
  Spinner,
  Center,
  Divider,
  Image
} from '@chakra-ui/react';
import { FaComment } from 'react-icons/fa';

import { AuthContext } from '../context/auth';
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';
import MyPopup from '../util/MyPopup';
import { Post } from '../types';

interface MatchParams {
  postId: string;
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

function SinglePost(props: RouteComponentProps<MatchParams>) {
  const postId = props.match.params.postId;
  const { user } = useContext(AuthContext);
  const commentInputRef = useRef<HTMLInputElement>(null);

  const [comment, setComment] = useState('');

  const {
    data: { getPost } = {}
  } = useQuery<{ getPost: Post }>(FETCH_POST_QUERY, {
    variables: {
      postId
    }
  });

  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update() {
      setComment('');
      if (commentInputRef.current) {
        commentInputRef.current.blur();
      }
    },
    variables: {
      postId,
      body: comment
    }
  });

  function deletePostCallback() {
    props.history.push('/');
  }

  if (!getPost) {
    return (
      <Center py={10}>
        <Spinner size="xl" color="teal.500" thickness="4px" />
      </Center>
    );
  }

  const {
    id,
    body,
    createdAt,
    username,
    comments,
    likes,
    likeCount,
    commentCount
  } = getPost;

  const { textWithoutUrl, imageUrl } = extractImageUrl(body);
  const avatarUrl = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(username)}`;

  return (
    <Box maxW="container.md" mx="auto" py={4}>
      <Card borderRadius="lg" boxShadow="md" mb={6}>
        <CardHeader pb={2}>
          <Flex align="center" justify="space-between">
            <Flex gap={3} align="center">
              <Avatar name={username} src={avatarUrl} size="md" bg="teal.500" />
              <Box>
                <Heading size="md">{username}</Heading>
                <Text fontSize="sm" color="gray.500">
                  {moment(createdAt).fromNow()}
                </Text>
              </Box>
            </Flex>
            {user && user.username === username && (
              <DeleteButton postId={id} callback={deletePostCallback} />
            )}
          </Flex>
        </CardHeader>

        <CardBody py={3}>
          {textWithoutUrl && (
            <Text fontSize="lg" color="gray.800" mb={imageUrl ? 4 : 0}>
              {textWithoutUrl}
            </Text>
          )}
          {imageUrl && (
            <Image
              src={imageUrl}
              alt="Post image"
              borderRadius="md"
              maxH="450px"
              w="100%"
              objectFit="cover"
              fallbackSrc="https://via.placeholder.com/600x300?text=Image+Unavailable"
            />
          )}
        </CardBody>

        <Divider color="gray.200" />

        <CardFooter pt={3}>
          <HStack spacing={4}>
            <LikeButton user={user} post={{ id, likeCount, likes }} />
            <MyPopup content="Comment on post">
              <Button
                colorScheme="blue"
                variant="outline"
                leftIcon={<FaComment />}
                size="sm"
              >
                <Text ml={1}>{commentCount}</Text>
              </Button>
            </MyPopup>
          </HStack>
        </CardFooter>
      </Card>

      {user && (
        <Card borderRadius="lg" boxShadow="sm" mb={6}>
          <CardBody>
            <Text fontWeight="semibold" mb={3} color="teal.700">
              Post a comment
            </Text>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitComment();
              }}
            >
              <HStack>
                <Input
                  placeholder="Write a comment..."
                  name="comment"
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  ref={commentInputRef}
                  focusBorderColor="teal.400"
                />
                <Button
                  type="submit"
                  colorScheme="teal"
                  isDisabled={comment.trim() === ''}
                >
                  Submit
                </Button>
              </HStack>
            </form>
          </CardBody>
        </Card>
      )}

      <VStack spacing={4} align="stretch">
        {comments.map((comment) => {
          const commentAvatarUrl = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(comment.username)}`;
          return (
            <Card key={comment.id} borderRadius="md" boxShadow="xs" bg="gray.50">
              <CardBody py={3}>
                <Flex align="center" justify="space-between">
                  <Flex gap={3} align="flex-start">
                    <Avatar name={comment.username} src={commentAvatarUrl} size="sm" />
                    <Box>
                      <Heading size="xs">{comment.username}</Heading>
                      <Text fontSize="xs" color="gray.500" mb={1}>
                        {moment(comment.createdAt).fromNow()}
                      </Text>
                      <Text fontSize="sm">{comment.body}</Text>
                    </Box>
                  </Flex>
                  {user && user.username === comment.username && (
                    <DeleteButton postId={id} commentId={comment.id} />
                  )}
                </Flex>
              </CardBody>
            </Card>
          );
        })}
      </VStack>
    </Box>
  );
}

const SUBMIT_COMMENT_MUTATION = gql`
  mutation($postId: String!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        createdAt
        username
      }
      commentCount
    }
  }
`;

const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

export default SinglePost;
