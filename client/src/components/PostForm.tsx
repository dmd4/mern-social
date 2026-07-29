import React from 'react';
import {
  Button,
  FormControl,
  Input,
  VStack,
  Alert,
  AlertIcon,
  Heading,
  Card,
  CardBody,
  useToast
} from '@chakra-ui/react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';

import { useForm } from '../util/hooks';
import { FETCH_POSTS_QUERY } from '../util/graphql';

function PostForm() {
  const toast = useToast();
  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    body: ''
  });

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      const data: any = proxy.readQuery({
        query: FETCH_POSTS_QUERY
      });
      if (data && data.getPosts) {
        proxy.writeQuery({
          query: FETCH_POSTS_QUERY,
          data: {
            getPosts: [result.data.createPost, ...data.getPosts]
          }
        });
      }
      values.body = '';
      toast({
        title: 'Post Created',
        description: 'Your post has been published successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right'
      });
    }
  });

  function createPostCallback() {
    createPost();
  }

  return (
    <Card mb={6} shadow="md" borderRadius="lg">
      <CardBody>
        <Heading size="md" mb={4} color="teal.600">
          Create a post:
        </Heading>
        <form onSubmit={onSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl isInvalid={!!error}>
              <Input
                placeholder="What's on your mind?"
                name="body"
                onChange={onChange}
                value={values.body}
                focusBorderColor="teal.400"
              />
            </FormControl>
            <Button type="submit" colorScheme="teal" alignSelf="flex-start">
              Submit
            </Button>
          </VStack>
        </form>
        {error && (
          <Alert status="error" mt={4} borderRadius="md">
            <AlertIcon />
            {(error.graphQLErrors &&
              error.graphQLErrors[0] &&
              error.graphQLErrors[0].message) ||
              error.message}
          </Alert>
        )}
      </CardBody>
    </Card>
  );
}

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likeCount
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`;

export default PostForm;
