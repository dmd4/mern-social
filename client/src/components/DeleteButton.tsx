import React, { useState, useRef } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import {
  IconButton,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button
} from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa';

import { FETCH_POSTS_QUERY } from '../util/graphql';
import MyPopup from '../util/MyPopup';

interface DeleteButtonProps {
  postId: string;
  commentId?: string;
  callback?: () => void;
}

function DeleteButton({ postId, commentId, callback }: DeleteButtonProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

  const [deletePostOrMutation] = useMutation(mutation, {
    update(proxy) {
      setConfirmOpen(false);
      if (!commentId) {
        const data: any = proxy.readQuery({
          query: FETCH_POSTS_QUERY
        });
        if (data && data.getPosts) {
          proxy.writeQuery({
            query: FETCH_POSTS_QUERY,
            data: {
              getPosts: data.getPosts.filter((p: any) => p.id !== postId)
            }
          });
        }
      }
      if (callback) callback();
    },
    variables: {
      postId,
      commentId
    }
  });

  return (
    <>
      <MyPopup content={commentId ? 'Delete comment' : 'Delete post'}>
        <IconButton
          aria-label="Delete"
          icon={React.createElement(FaTrash as any)}
          colorScheme="red"
          variant="ghost"
          size="sm"
          onClick={() => setConfirmOpen(true)}
        />
      </MyPopup>

      <AlertDialog
        isOpen={confirmOpen}
        leastDestructiveRef={cancelRef as any}
        onClose={() => setConfirmOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirm Delete
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this {commentId ? 'comment' : 'post'}?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setConfirmOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={deletePostOrMutation as any} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;

export default DeleteButton;
