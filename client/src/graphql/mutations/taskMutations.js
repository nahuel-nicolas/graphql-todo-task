import { gql } from '@apollo/client';

const ADD_TASK = gql`
  mutation AddTask(
    $title: String!
    $description: String!
    $status: TaskStatus!
    $userId: ID
  ) {
    addTask(
      title: $title
      description: $description
      status: $status
      userId: $userId
    ) {
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

const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id) {
      id
    }
  }
`;

const UPDATE_TASK = gql`
  mutation UpdateTask(
    $id: ID!
    $title: String!
    $description: String!
    $status: TaskStatusUpdate!
    $userId: ID
  ) {
    updateTask(
      id: $id
      title: $title
      description: $description
      status: $status
      userId: $userId
    ) {
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

export { ADD_TASK, DELETE_TASK, UPDATE_TASK };
