import { gql } from '@apollo/client';

const GET_USERS = gql`
  query getUsers {
    users {
      id
      username
    }
  }
`;

const GET_USER = gql`
  query getUser($id: ID!) {
    user(id: $id) {
      id
      username
    }
  }
`;

export { GET_USERS, GET_USER };
