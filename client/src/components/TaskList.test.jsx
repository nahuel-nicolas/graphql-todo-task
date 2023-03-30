import { render, screen } from "@testing-library/react";
import { describe, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'

import TaskList from "./TaskList";


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

describe('test TaskList', () => {
    it('should render TaskList', () => {
        render(<TaskList tasks={tasks} />, { wrapper: MemoryRouter })
    })

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