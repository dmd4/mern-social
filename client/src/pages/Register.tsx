import React, { useContext, useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Alert,
  AlertIcon,
  Card,
  CardBody,
  Container
} from '@chakra-ui/react';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { RouteComponentProps } from 'react-router-dom';

import { AuthContext } from '../context/auth';
import { useForm } from '../util/hooks';

function Register(props: RouteComponentProps) {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { onChange, onSubmit, values } = useForm(registerUser, {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(
      _,
      {
        data: { register: userData }
      }
    ) {
      context.login(userData);
      props.history.push('/');
    },
    onError(err) {
      const graphQLErrors = err.graphQLErrors;
      if (graphQLErrors && graphQLErrors.length > 0) {
        const ext = graphQLErrors[0].extensions as any;
        if (ext && ext.exception && ext.exception.errors) {
          setErrors(ext.exception.errors);
          return;
        }
      }
      setErrors({ general: err.message });
    },
    variables: values
  });

  function registerUser() {
    addUser();
  }

  return (
    <Container maxW="md" py={8}>
      <Card shadow="md" borderRadius="lg">
        <CardBody>
          <Heading size="lg" mb={6} textAlign="center" color="teal.600">
            Register
          </Heading>
          <form onSubmit={onSubmit} noValidate>
            <VStack spacing={4}>
              <FormControl isInvalid={!!errors.username}>
                <FormLabel>Username</FormLabel>
                <Input
                  placeholder="Username.."
                  name="username"
                  type="text"
                  value={values.username}
                  onChange={onChange}
                  focusBorderColor="teal.400"
                />
              </FormControl>
              <FormControl isInvalid={!!errors.email}>
                <FormLabel>Email</FormLabel>
                <Input
                  placeholder="Email.."
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={onChange}
                  focusBorderColor="teal.400"
                />
              </FormControl>
              <FormControl isInvalid={!!errors.password}>
                <FormLabel>Password</FormLabel>
                <Input
                  placeholder="Password.."
                  name="password"
                  type="password"
                  value={values.password}
                  onChange={onChange}
                  focusBorderColor="teal.400"
                />
              </FormControl>
              <FormControl isInvalid={!!errors.confirmPassword}>
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  placeholder="Confirm Password.."
                  name="confirmPassword"
                  type="password"
                  value={values.confirmPassword}
                  onChange={onChange}
                  focusBorderColor="teal.400"
                />
              </FormControl>
              <Button
                type="submit"
                colorScheme="teal"
                width="full"
                isLoading={loading}
                mt={2}
              >
                Register
              </Button>
            </VStack>
          </form>
          {Object.keys(errors).length > 0 && (
            <VStack mt={4} align="stretch" spacing={2}>
              {Object.values(errors).map((value) => (
                <Alert status="error" borderRadius="md" key={value}>
                  <AlertIcon />
                  {value}
                </Alert>
              ))}
            </VStack>
          )}
        </CardBody>
      </Card>
    </Container>
  );
}

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Register;
