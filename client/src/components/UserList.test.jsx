import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, vi, beforeAll, afterAll, expect } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import * as apolloClient from '@apollo/client';

import UserList from "./UserList";
import { getQueryName } from "../utils/utils"
import { graphql_url } from "../config";


const { ApolloProvider, ApolloClient, InMemoryCache } = apolloClient

const cache = new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          clients: {
            merge(existing, incoming) {
              return incoming;
            },
          },
          projects: {
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

const users = [
    {
        id: '123456',
        username: 'username1'
    },
    {
        id: '234',
        username: 'username2'
    },
    {
        id: '234324242342',
        username: 'username3'
    }
]

function useQueryMock(query) {
    expect(getQueryName(query)).toEqual('getUsers')
    return {
        error: null,
        loading: false,
        data: {
            users
        }
    }
}

describe('test UserList', () => {
    beforeAll(() => {
        vi.spyOn(apolloClient, 'useQuery').mockImplementation(useQueryMock)
    })

    afterAll(() => {
        vi.restoreAllMocks();
    })

    it('should render UserList', () => {
        const ProvidedUserList = (
            <ApolloProvider client={client}>
                <Routes>
                    <Route path='/' element={<UserList users={users} />} />
                </Routes>
            </ApolloProvider>
        )
        render(ProvidedUserList, { wrapper: MemoryRouter })
    })

    it('should wait for apolloData', async () => {
        await waitFor(() => {
        
            it('should find usernames', () => {
                users.forEach(user => screen.getByText(user.username))
            }) 
        })
    })
})