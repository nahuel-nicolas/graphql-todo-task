import { useState, useEffect } from "react";
import { render, screen, fireEvent, within, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import * as apolloClient from '@apollo/client';
import * as ReactRouterDom from "react-router-dom";

import EditTaskForm from "./EditTaskForm";
import { statusOptions } from "../utils/options";
import { getQueryName } from "../utils/utils";


const { ApolloProvider, ApolloClient, InMemoryCache } = apolloClient
const { MemoryRouter, Routes, Route } = ReactRouterDom

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
    uri: 'http://localhost:3002/graphql',
    cache
});

const initTaskData = {
    id: 'taskId123',
    title: 'testEditTaskForm',
    description: 'test edit task form description',
    status: 'new',
    userId: 'userId123'
}

const finalTaskData = {
    id: 'taskId123',
    title: 'testEditTaskForm Final',
    description: 'test edit task form description final',
    status: 'completed',
    userId: 'userId456'
}

const users = [
    {
        id: 'userId123',
        username: 'username1'
    },
    {
        id: 'userId456',
        username: 'username2'
    },
    {
        id: 'userId789',
        username: 'username3'
    }
]

const initStatusText = statusOptions.find(statusOption => statusOption.value === initTaskData.status).text
const initUsername = users.find(user => user.id === initTaskData.userId).username
const finalStatusText = statusOptions.find(statusOption => statusOption.value === finalTaskData.status).text
const finalUsername = users.find(user => user.id === finalTaskData.userId).username

let goBackButtonClicked = false
let submitButtonClicked = false
let deleteButtonClicked = false

function useQueryMock(query, options) {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    useEffect(() => {
        const queryName = getQueryName(query)
        console.log(['EditTaskForm.test.useQueryMock.useEffect[]', queryName])

        if (queryName === 'getUsers') {
            setData({ users })
        } else {
            setData({ task: initTaskData })
        }
        setLoading(false)
    }, [])
    useEffect(() => {
        if (data) options.onCompleted(data)
    }, [data])
    
    return {
        loading,
        error,
        data
    }
}

function useMutationMock(mutation) {
    const mutationName = getQueryName(mutation)
    if (mutationName === 'UpdateTask') {
        return [
            async (id, title, description, status, userId) => {
                submitButtonClicked = true
                const requestDataTask = { id, title, description, status, userId }
                console.log(['EditTaskForm.useMutationMock.UpdateTask', requestDataTask])
                expect(requestDataTask).toEqual(finalTaskData)
                return requestDataTask
            }
        ]
    }
    return [
        async (id) => {
            deleteButtonClicked = true
            console.log(['EditTaskForm.useMutationMock.DeleteTask', id])
            expect(id).toEqual(finalTaskData.id)
            return finalTaskData
        }
    ]
}

function useNavigateMock() {
    return (navigateToUrl) => {
        goBackButtonClicked = true
    }
}

vi.mock('react-router-dom', async (importOriginal) => {
    const reactRouterDom = await importOriginal()
    return {
        ...reactRouterDom, // since you still want to use the actual MemoryRouter
        useNavigate: useNavigateMock
    }
})

describe('test EditTaskForm', () => {
    beforeAll(() => {
        vi.spyOn(apolloClient, 'useQuery').mockImplementation(useQueryMock)
        vi.spyOn(apolloClient, 'useMutation').mockImplementation(useMutationMock)
        // vi.spyOn(ReactRouterDom, 'useNavigate').mockImplementation(useNavigateMock)
    })

    afterAll(() => {
        vi.restoreAllMocks();
    })

    it('should render', () => {
        const ProvidedEditTaskForm = (
            <ApolloProvider client={client}>
                <Routes>
                    <Route path='/' element={
                        <EditTaskForm taskId={initTaskData.id} />
                    } />
                </Routes>
            </ApolloProvider>
        )
        render(ProvidedEditTaskForm, { wrapper: MemoryRouter })
    })

    it('should wait component compound', async () => {
        await waitFor(() => {
            
        })
    })

    it('should be able to get initTaskData from screen', () => {
        expect(screen.getByRole('title-input').defaultValue).toEqual(initTaskData.title)

        expect(screen.getByRole('description-textarea').defaultValue).toEqual(initTaskData.description)

        const statusSelect = screen.getByTestId('status-select')
        expect(within(statusSelect).getByRole('alert').textContent).toEqual(initStatusText)

        const userSelect = screen.getByTestId('user-select')
        expect(within(userSelect).getByRole('alert').textContent).toEqual(initUsername)
    })

    it('should type title and description inputs', () => {
        const titleInput = screen.getByRole('title-input')
        const descriptionInput = screen.getByRole('description-textarea')
        fireEvent.change(titleInput, { target: { value: finalTaskData.title } })
        fireEvent.change(descriptionInput, { target: { value: finalTaskData.description } })
    })

    it('should change status', () => {
        const statusSelect = screen.getByTestId('status-select')
        const options = within(statusSelect).getAllByRole('option')
        expect(Array.isArray(options)).toBeTruthy()
        options.find(option => option.textContent === finalStatusText).click()
    })

    it('should change user', () => {
        const userSelect = screen.getByTestId('user-select')
        const options = within(userSelect).getAllByRole('option')
        expect(Array.isArray(options)).toBeTruthy()
        options.find(option => option.textContent === finalUsername).click()
    })

    it('should go back', () => {
        expect(goBackButtonClicked).toBeFalsy()
        screen.getByRole('back-button').click()
        expect(goBackButtonClicked).toBeTruthy()
    })

    it('should submit changes', () => {
        expect(submitButtonClicked).toBeFalsy()
        screen.getByRole('submit-button').click()
        expect(submitButtonClicked).toBeTruthy()
    })

    it('should delete task', () => {
        expect(deleteButtonClicked).toBeFalsy()
        screen.getByRole('delete-button').click()
        expect(deleteButtonClicked).toBeTruthy()
    })
})