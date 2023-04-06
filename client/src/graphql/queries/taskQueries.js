import { gql } from '@apollo/client';

const GET_TASKS = gql`
  query getTasks {
    tasks {
      id
      title
      description
      status
      user {
        id
        username
      }
    }
  }
`;

const GET_TASK = gql`
  query getTask($id: ID!) {
    task(id: $id) {
      id
      title
      description
      status
      user {
        id
        username
      }
    }
  }
`;

export { GET_TASKS, GET_TASK };
