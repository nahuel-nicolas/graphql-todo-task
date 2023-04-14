import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import * as apolloClient from '@apollo/client';

import UserListItem from "./UserListItem";
import { getQueryName } from "../utils/utils";
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

const userData = {
    id: '1234',
    username: 'username1'
}

let isDeleteButtonClicked = false

function useMutationMock(query, options) {
    expect(getQueryName(query)).toEqual('deleteUser')
    return [(id) => {
        isDeleteButtonClicked = true
        expect(options.variables.id).toEqual(userData.id)
        return [userData]
    }]
}

describe('test UserListItem', () => {
    beforeAll(() => {
        vi.spyOn(apolloClient, 'useMutation').mockImplementation(useMutationMock)
    })

    afterAll(() => {
        vi.restoreAllMocks();
    })

    it('should render', () => {
        const ProvidedUserListItem = (
            <ApolloProvider client={client}>
                <Routes>
                    <Route path='/' element={
                        <UserListItem userData={userData} />
                    } />
                </Routes>
            </ApolloProvider>
        )
        render(ProvidedUserListItem, { wrapper: MemoryRouter })
    })

    it('should find username', () => {
        screen.getByText(userData.username)
    })

    it('should click delete button', () => {
        expect(isDeleteButtonClicked).toBeFalsy()
        screen.getByRole('delete-button').click()
        expect(isDeleteButtonClicked).toBeTruthy()
    })
})