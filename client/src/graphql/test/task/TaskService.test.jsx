import { render, screen, waitFor, fireEvent, cleanup } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ApolloProvider, ApolloClient, InMemoryCache, useQuery, useMutation } from '@apollo/client';

import AddTask from "./AddTask";
import GetTasks from "./GetTasks";
import UpdateTask from "./UpdateTask";
import DeleteTask from "./DeleteTask";


const cache = new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          users: {
            merge(existing, incoming) {
              return incoming;
            },
          },
          tasks: {
            merge(existing, incoming) {
              return incoming;
            },
          },
        },
      },
    },
});

const client = new ApolloClient({
    uri: 'http://localhost:3002/graphql',
    cache    
});

const addTaskData = {
  title: 'testAddTask',
  description: 'testAddTaskDescription',
  status: 'new',
  userId: null
}

const updateTaskData = {
  title: 'testUpdateTask',
  description: 'testUpdateTaskDescription',
  status: 'progress',
  userId: null
}

describe('test AddTask', () => {
  it('should render AddTask', () => {
    const ProvidedAddTask = (
      <ApolloProvider client={client}>
          <Routes>
              <Route path='/' element={
                <AddTask taskData={addTaskData} />
              } />
          </Routes>
      </ApolloProvider>
    )
    render(ProvidedAddTask, { wrapper: MemoryRouter })
  })

  it('should wait for apolloData and add task', async () => {
    await waitFor(() => {
      const submitButton = screen.getByRole('submit-button')
      submitButton.click() 
    })
  })
})


describe('test GetTasks', () => {
  beforeAll(() => {
    cleanup()
  })

  it('should render GetTasks', () => {
    const ProvidedGetTasks = (
        <ApolloProvider client={client}>
            <Routes>
                <Route path='/' element={
                  <GetTasks />
                } />
            </Routes>
        </ApolloProvider>
    )
    render(ProvidedGetTasks, { wrapper: MemoryRouter })
  })

  it('should wait for GetTasks to fetch tasks', async () => {
    await waitFor(() => {
      screen.getByText('Id')
      // screen.debug()
    })
  })
})

describe('test UpdateTask', () => {
  beforeAll(() => {
    cleanup()
  })

  it('should render UpdateTask', () => {
    const ProvidedUpdateTask = (
        <ApolloProvider client={client}>
            <Routes>
                <Route path='/' element={
                  <UpdateTask addTaskData={addTaskData} updateTaskData={updateTaskData} />
                } />
            </Routes>
        </ApolloProvider>
    )
    render(ProvidedUpdateTask, { wrapper: MemoryRouter })
  })

  it('should wait for UpdateTask to fetch tasks', async () => {
    await waitFor(() => {
      screen.getByRole('update-task-button').click()
      // screen.debug()
    })
  })
})

describe('test DeleteTask', () => {
  beforeAll(() => {
    cleanup()
  })

  it('should render DeleteTask', () => {
    const ProvidedDeleteTask = (
        <ApolloProvider client={client}>
            <Routes>
                <Route path='/' element={
                  <DeleteTask deleteTaskData={updateTaskData} />
                } />
            </Routes>
        </ApolloProvider>
    )
    render(ProvidedDeleteTask, { wrapper: MemoryRouter })
  })

  it('should wait for DeleteTask to fetch tasks', async () => {
    await waitFor(() => {
      screen.getByRole('delete-task-button').click()
      // screen.debug()
    })
  })
})
cleanup()
