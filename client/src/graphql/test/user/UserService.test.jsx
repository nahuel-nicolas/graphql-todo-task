import { render, screen, waitFor, fireEvent, cleanup } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ApolloProvider, ApolloClient, InMemoryCache, useQuery, useMutation } from '@apollo/client';

import AddUser from "./AddUser";
import GetUsers from "./GetUsers";
import UpdateUser from "./UpdateUser";
import DeleteUser from "./DeleteUser";


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

const addUserData = {
  username: 'testUsername1',
  password: 'testPassword1'
}

const updateUserData = {
  username: 'testUpdateUsername1',
  password: 'testPassword1'
}

describe('test AddUser', () => {
  it('should render AddUser', () => {
    const ProvidedAddUser = (
      <ApolloProvider client={client}>
          <Routes>
              <Route path='/' element={
                <AddUser />
              } />
          </Routes>
      </ApolloProvider>
    )
    render(ProvidedAddUser, { wrapper: MemoryRouter })
  })

  it('should wait for apolloData and add user', async () => {
    await waitFor(() => {
      const usernameInput = screen.getByRole('username-input')
      const passwordInput = screen.getByRole('password-input')
      const submitButton = screen.getByRole('submit-button')
      fireEvent.change(usernameInput, { target: { value: addUserData.username } })
      fireEvent.change(passwordInput, { target: { value: addUserData.password } })
      submitButton.click() 
    })
  })
})

describe('test GetUsers', () => {
  beforeAll(() => {
    cleanup()
  })

  it('should render GetUsers', () => {
    const ProvidedGetUsers = (
        <ApolloProvider client={client}>
            <Routes>
                <Route path='/' element={
                  <GetUsers />
                } />
            </Routes>
        </ApolloProvider>
    )
    render(ProvidedGetUsers, { wrapper: MemoryRouter })
  })

  it('should wait for GetUsers to fetch users', async () => {
    await waitFor(() => {
      screen.getByText('Id')
      // screen.getByText(addUserData.username)
      // screen.debug()
    })
  })
})

describe('test UpdateUser', () => {
  beforeAll(() => {
    cleanup()
  })

  it('should render UpdateUser', () => {

    const ProvidedUpdateUser = (
        <ApolloProvider client={client}>
            <Routes>
                <Route path='/' element={
                  <UpdateUser addUserData={addUserData} updateUserData={updateUserData} />
                } />
            </Routes>
        </ApolloProvider>
    )
    render(ProvidedUpdateUser, { wrapper: MemoryRouter })
  })

  it('should wait for UpdateUser to fetch users', async () => {
    await waitFor(() => {
      screen.getByRole('update-user-button').click()
      // screen.debug()
    })
  })
})

describe('test DeleteUser', () => {
  beforeAll(() => {
    cleanup()
  })

  it('should render DeleteUser', () => {
    const ProvidedDeleteUser = (
        <ApolloProvider client={client}>
            <Routes>
                <Route path='/' element={
                  <DeleteUser deleteUserData={updateUserData} />
                } />
            </Routes>
        </ApolloProvider>
    )
    render(ProvidedDeleteUser, { wrapper: MemoryRouter })
  })

  it('should wait for DeleteUser to fetch users', async () => {
    await waitFor(() => {
      screen.getByRole('delete-user-button').click()
      // screen.debug()
    })
  })
})
cleanup()