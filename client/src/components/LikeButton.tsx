import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { Button, Text } from '@chakra-ui/react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

import MyPopup from '../util/MyPopup';
import { User, Like } from '../types';

interface LikeButtonProps {
  user: User | null;
  post: {
    id: string;
    likeCount: number;
    likes: Like[];
  };
}

function LikeButton({ user, post: { id, likeCount, likes } }: LikeButtonProps) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (user && likes.find((like) => like.username === user.username)) {
      setLiked(true);
    } else setLiked(false);
  }, [user, likes]);

  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id }
  });

  const likeButton = user ? (
    <Button
      colorScheme="teal"
      variant={liked ? 'solid' : 'outline'}
      leftIcon={liked ? <FaHeart /> : <FaRegHeart />}
      onClick={likePost as any}
      size="sm"
    >
      <Text ml={1}>{likeCount}</Text>
    </Button>
  ) : (
    <Button
      as={Link}
      to="/login"
      colorScheme="teal"
      variant="outline"
      leftIcon={<FaRegHeart />}
      size="sm"
    >
      <Text ml={1}>{likeCount}</Text>
    </Button>
  );

  return (
    <MyPopup content={liked ? 'Unlike' : 'Like'}>
      {likeButton}
    </MyPopup>
  );
}

const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        username
      }
      likeCount
    }
  }
`;

export default LikeButton;
