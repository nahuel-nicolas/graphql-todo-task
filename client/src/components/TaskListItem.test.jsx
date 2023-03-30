import { render, screen, cleanup } from "@testing-library/react";
import { expect, describe, it, afterAll } from 'vitest'
import { MemoryRouter } from 'react-router-dom'

import TaskListItem from "./TaskListItem";


const taskData = {
    id: '123456',
    title: 'testTaskTitle',
    description: 'testTaskDescription',
    status: 'In Progress',
    user: {
        username: 'Nahuel'
    }
}

const taskData2 = {
    id: '123456',
    title: 'testTaskTitle',
    description: 'testTaskDescription',
    status: 'Not Started',
    user: null
}

describe('test TaskListItem', () => {
    afterAll(() => {
        cleanup()
    })

    it('should render TaskListItem', () => {
        render(<TaskListItem taskData={taskData} />, { wrapper: MemoryRouter })
    })

    it('should find first 4 id digits', () => {
        screen.getByText(taskData.id.slice(0, 4))
    })

    it('should find title', () => {
        screen.getByText(taskData.title)
    })

    it('should find status', () => {
        screen.getByText('Status: ' + taskData.status)
    })

    it('should find username', () => {
        screen.getByText('Assigned to: ' + taskData.user.username)
    })

    it('checks link', () => {
        expect(screen.getByText('View').closest('a').href)
            .toMatch('/task/' + taskData.id)
    })
})

describe('test TaskListItem with null user', () => {
    afterAll(() => {
        cleanup()
    })

    it('should render testTaskTitle', () => {
        render(<TaskListItem taskData={taskData2} />, { wrapper: MemoryRouter })
    })

    it('should find first 4 id digits', () => {
        screen.getByText(taskData2.id.slice(0, 4))
    })

    it('should find title', () => {
        screen.getByText(taskData2.title)
    })

    it('should find status', () => {
        screen.getByText('Status: ' + taskData2.status)
    })

    it('checks link', () => {
        expect(screen.getByText('View').closest('a').href)
            .toMatch('/task/' + taskData2.id)
    })
})