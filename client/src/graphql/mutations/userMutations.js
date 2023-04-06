import { gql } from '@apollo/client';

const ADD_USER = gql`
  mutation addUser($username: String!, $password: String!) {
    addUser(username: $username, password: $password) {
      id
      username
    }
  }
`;

const DELETE_USER = gql`
  mutation deleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
      username
      password
    }
  }
`;

const UPDATE_USER = gql`
  mutation updateUser($id: ID!, $username: String!, $password: String!) {
    updateUser(id: $id, username: $username, password: $password) {
      id
      username
    }
  }
`;


export { ADD_USER, DELETE_USER, UPDATE_USER };
