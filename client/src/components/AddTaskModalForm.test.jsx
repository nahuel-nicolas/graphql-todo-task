import { useState, useEffect } from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import * as apolloClient from '@apollo/client';
import { MemoryRouter, Routes, Route } from 'react-router-dom'

import AddTaskModalForm from './AddTaskModalForm';
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
    uri: 'grapqhel_url',
    cache
});

const statusOptionsExample = [
    { value: "new", text: "Not Started" },
    { value: "progress", text: "In Progress" },
    { value: "completed", text: "Completed" }
]

const userOptionsExample = [
    { value: null, text: "unassigned" },
    { value: "userid123", text: "username1" },
    { value: "3242", text: "username2" },
]

const taskData = {
    title: 'title1',
    description: 'description1',
    status: 'new',
    userId: '3242'
}

const expectedSelectedStatusText = statusOptionsExample.find(option => option.value === taskData.status).text;
const expectedSelectedUsername = userOptionsExample.find(option => option.value === taskData.userId).text;

function useQueryMock(query, options) {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    useEffect(() => {
        expect(getQueryName(query)).toEqual('getUsers')
        setData({ 
            users: [
                {
                    id: "userid123",
                    username: "username1"
                },
                {
                    id: "3242",
                    username: "username2"
                }
            ] 
        })
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
    return [
        async (title, description, status, userId) => {
            const requestDataTask = { title, description, status, userId }
            log.debug(['AddTaskModalForm.useMutationMock', requestDataTask])
            expect(requestDataTask).toEqual(taskData)
            return {
                ...requestDataTask,
                id: '123'
            }
        }
    ]
}

describe('Test AddTaskModalForm', () => {
    beforeAll(() => {
        vi.spyOn(apolloClient, 'useQuery').mockImplementation(useQueryMock)
        vi.spyOn(apolloClient, 'useMutation').mockImplementation(useMutationMock)
    })

    afterAll(() => {
        vi.restoreAllMocks();
    })

    it('should render', () => {
        const ProvidedAddTaskModalForm = (
            <ApolloProvider client={client}>
                <Routes>
                    <Route path='/' element={
                        <AddTaskModalForm />
                    } />
                </Routes>
            </ApolloProvider>
        )
        render(ProvidedAddTaskModalForm, { wrapper: MemoryRouter })
    })

    it('should open modal', () => {
        screen.getByText('Add Task').click()
    })

    it('should set title', () => {
        const titleInput = screen.getByRole('add-task-title-input')
        fireEvent.change(titleInput, { target: { value: taskData.title } })
    })

    it('should set description', () => {
        const descriptionInput = screen.getByRole('add-task-description-textarea')
        fireEvent.change(descriptionInput, { target: { value: taskData.description } })
    })

    it('should set status', () => {
        const statusSelect = screen.getByTestId('add-task-status-select')
        const options = within(statusSelect).getAllByRole('option')
        expect(Array.isArray(options)).toBeTruthy()
        options.find(option => option.textContent === expectedSelectedStatusText).click()
    })

    it('should set userId', () => {
        const userIdSelect = screen.getByTestId('add-task-userid-select')
        const options = within(userIdSelect).getAllByRole('option')
        expect(Array.isArray(options)).toBeTruthy()
        options.find(option => option.textContent === expectedSelectedUsername).click()
    })

    it('should submit', () => {
        screen.getByRole('submit-button').click()
    })
})