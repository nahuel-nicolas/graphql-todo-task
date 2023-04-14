import { render, screen, waitFor, fireEvent, cleanup } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

import AddTask from "./AddTask";
import GetTasks from "./GetTasks";
import UpdateTask from "./UpdateTask";
import DeleteTask from "./DeleteTask";
import AddUser from "../user/AddUser";
import DeleteUser from "../user/DeleteUser";
import { graphql_url } from "../../../config";


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
    uri: graphql_url,
    cache    
});

function getApolloProvidedComponent(component) {
  return (
      <ApolloProvider client={client}>
          <Routes>
              <Route path='/' element={component} />
          </Routes>
      </ApolloProvider>
  )
}

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

describe.skip('test AddTask', () => {
  it('should render AddTask', () => {
    const ProvidedAddTask = getApolloProvidedComponent(<AddTask taskData={addTaskData} />)
    render(ProvidedAddTask, { wrapper: MemoryRouter })
  })

  it('should wait for apolloData and add task', async () => {
    await waitFor(() => {
      const submitButton = screen.getByRole('submit-button')
      submitButton.click() 
    })
  })
})


describe.skip('test GetTasks', () => {
  beforeAll(() => {
    cleanup()
  })

  it('should render GetTasks', () => {
    const ProvidedGetTasks = getApolloProvidedComponent(<GetTasks />)
    render(ProvidedGetTasks, { wrapper: MemoryRouter })
  })

  it('should wait for GetTasks to fetch tasks', async () => {
    await waitFor(() => {
      screen.getByText('Id')
      // screen.debug()
    })
  })
})

describe.skip('test UpdateTask', () => {
  beforeAll(() => {
    cleanup()
  })

  it('should render UpdateTask', () => {
    const ProvidedUpdateTask = getApolloProvidedComponent(
      <UpdateTask addTaskData={addTaskData} updateTaskData={updateTaskData} />
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

describe.skip('test DeleteTask', () => {
  beforeAll(() => {
    cleanup()
  })

  it('should render DeleteTask', () => {
    const ProvidedDeleteTask = getApolloProvidedComponent(<DeleteTask deleteTaskData={updateTaskData} />)
    render(ProvidedDeleteTask, { wrapper: MemoryRouter })
  })

  it('should wait for DeleteTask to fetch tasks', async () => {
    await waitFor(() => {
      screen.getByRole('delete-task-button').click()
      // screen.debug()
    })
  })
})

const addUserData = {
  username: 'usernameAssignedToTaskTest',
  password: 'hi1234'
}

const addTaskWithUser = {
  title: 'addTaskWithUserTest',
  description: 'Add task with user test description',
  status: 'new',
  userId: null
}

describe.skip('test AddTask with user', () => {
  beforeAll(() => {
    cleanup()
  })

  it('should render AddUser', () => {
    const ProvidedAddUser = getApolloProvidedComponent(<AddUser addUserData={addUserData} />)
    render(ProvidedAddUser, { wrapper: MemoryRouter })
  })

  it('should wait for addUser compund and submit user create request', async () => {
    await waitFor(() => {
      const submitButton = screen.getByRole('submit-button')
      submitButton.click() 
    })
  })

  it('should render AddTask', () => {
    cleanup()
    const ProvidedAddTask = getApolloProvidedComponent(
      <AddTask taskData={addTaskWithUser} userData={addUserData} />
    )
    render(ProvidedAddTask, { wrapper: MemoryRouter })
  })

  it('should wait for addTask compund and then submit addTaskData with user', async () => {
    await waitFor(() => {
      const submitButton = screen.getByRole('submit-button')
      submitButton.click()
    })
  })

  it('should render DeleteTask', () => {
    cleanup()
    const ProvidedDeleteTask = getApolloProvidedComponent(<DeleteTask deleteTaskData={addTaskWithUser} />)
    render(ProvidedDeleteTask, { wrapper: MemoryRouter })
  })

  it('should wait for DeleteTask to fetch tasks', async () => {
    await waitFor(() => {
      screen.getByRole('delete-task-button').click()
      // screen.debug()
    })
  })

  it('should render DeleteUser', () => {
    cleanup()
    const ProvidedDeleteUser = getApolloProvidedComponent(<DeleteUser deleteUserData={addUserData} />)
    render(ProvidedDeleteUser, { wrapper: MemoryRouter })
  })

  it('should wait for DeleteUser to fetch users', async () => {
    await waitFor(() => {
      screen.getByRole('delete-user-button').click()
      // screen.debug()
    })
  })
})