import { render, screen, waitFor, fireEvent, cleanup } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ApolloProvider, ApolloClient, InMemoryCache, useQuery, useMutation } from '@apollo/client';

import AddUser from "./AddUser";
import GetUsers from "./GetUsers";
import UpdateUser from "./UpdateUser";
import DeleteUser from "./DeleteUser";
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

const addUserData = {
  username: 'testUsername1',
  password: 'testPassword1'
}

const updateUserData = {
  username: 'testUpdateUsername1',
  password: 'testPassword1'
}

describe.skip('test AddUser', () => {
  it('should render AddUser', () => {
    const ProvidedAddUser = getApolloProvidedComponent(<AddUser addUserData={addUserData} />)
    render(ProvidedAddUser, { wrapper: MemoryRouter })
  })

  it('should wait for apolloData and add user', async () => {
    await waitFor(() => {
      const submitButton = screen.getByRole('submit-button')
      submitButton.click() 
    })
  })
})

describe.skip('test GetUsers', () => {
  beforeAll(() => {
    cleanup()
  })

  it('should render GetUsers', () => {
    const ProvidedGetUsers = getApolloProvidedComponent(<GetUsers />)
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

describe.skip('test UpdateUser', () => {
  beforeAll(() => {
    cleanup()
  })

  it('should render UpdateUser', () => {
    const ProvidedUpdateUser = getApolloProvidedComponent(
      <UpdateUser addUserData={addUserData} updateUserData={updateUserData} />
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

describe.skip('test DeleteUser', () => {
  beforeAll(() => {
    cleanup()
  })

  it('should render DeleteUser', () => {
    const ProvidedDeleteUser = getApolloProvidedComponent(<DeleteUser deleteUserData={updateUserData} />)
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