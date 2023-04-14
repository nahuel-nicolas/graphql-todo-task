import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, vi, beforeAll, afterAll } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import * as apolloClient from '@apollo/client';

import TaskList from "./TaskList";
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

const tasks = [
    {
        id: '123456',
        title: 'testTaskTitle1',
        description: 'testTaskDescription1',
        status: 'In Progress',
        user: {
            username: 'Nahuel'
        }
    },
    {
        id: '234',
        title: 'testTaskTitle2',
        description: 'testTaskDescription2',
        status: 'Not Started',
        user: null
    },
    {
        id: '234324242342',
        title: 'testTaskTitle3',
        description: 'testTaskDescription3',
        status: 'Completed',
        user: {
            username: 'John'
        }
    }
]

function useQueryMock(query) {
    return {
        error: null,
        loading: false,
        data: {
            tasks
        }
    }
}

describe('test TaskList', () => {
    beforeAll(() => {
        vi.spyOn(apolloClient, 'useQuery').mockImplementation(useQueryMock)
    })

    afterAll(() => {
        vi.restoreAllMocks();
    })

    it('should render TaskList', () => {
        const ProvidedTaskList = (
            <ApolloProvider client={client}>
                <Routes>
                    <Route path='/' element={<TaskList tasks={tasks} />} />
                </Routes>
            </ApolloProvider>
        )
        render(ProvidedTaskList, { wrapper: MemoryRouter })
    })

    it('should wait for apolloData', async () => {
        await waitFor(() => {
            it('should find first 4 id digits', () => {
                tasks.forEach(task => screen.getByText(task.id.slice(0, 4)))
            })
        
            it('should find title', () => {
                tasks.forEach(task => screen.getByText(task.title))
            })
        
            it('should find status', () => {
                tasks.forEach(task => screen.getByText('Status: ' + task.status))
            })
            
        })
    })
})