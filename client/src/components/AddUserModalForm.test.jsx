import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import * as apolloClient from '@apollo/client';
import { MemoryRouter, Routes, Route } from 'react-router-dom'

import AddUserModalForm from './AddUserModalForm';
import { getQueryName, log } from "../utils/utils";
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
    username: 'username1',
    password: 'password1'
}

let isSubmitButtonClicked = false

function useMutationMock(mutation) {
    expect(getQueryName(mutation)).toEqual('addUser')
    return [
        async (username, password) => {
            isSubmitButtonClicked = true
            const requestDataUser = { username, password }
            log.debug(['AddUserModalForm.useMutationMock', requestDataUser])
            expect(requestDataUser).toEqual(userData)
            return {
                ...requestDataUser,
                id: '123'
            }
        }
    ]
}

describe('Test AddUserModalForm', () => {
    beforeAll(() => {
        vi.spyOn(apolloClient, 'useMutation').mockImplementation(useMutationMock)
    })

    afterAll(() => {
        vi.restoreAllMocks();
    })

    it('should render', () => {
        const ProvidedAddUserModalForm = (
            <ApolloProvider client={client}>
                <Routes>
                    <Route path='/' element={
                        <AddUserModalForm />
                    } />
                </Routes>
            </ApolloProvider>
        )
        render(ProvidedAddUserModalForm, { wrapper: MemoryRouter })
    })

    it('should open modal', () => {
        screen.getByText('Add User').click()
    })

    it('should set username', () => {
        const usernameInput = screen.getByRole('add-user-username-input')
        fireEvent.change(usernameInput, { target: { value: userData.username } })
    })

    it('should set password', () => {
        const passwordInput = screen.getByRole('add-user-password-input')
        fireEvent.change(passwordInput, { target: { value: userData.password } })
    })

    it('should submit', () => {
        expect(isSubmitButtonClicked).toBeFalsy()
        screen.getByRole('submit-button').click()
        expect(isSubmitButtonClicked).toBeTruthy()
    })
})