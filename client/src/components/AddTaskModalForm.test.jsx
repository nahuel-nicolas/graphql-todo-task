import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'

import * as TaskService from '../services/TaskService';
import AddTaskModalForm from './AddTaskModalForm';


const statusOptionsExample = [
    { value: "new", text: "Not Started" },
    { value: "progress", text: "In Progress" },
    { value: "completed", text: "Completed" }
]

const userOptionsExample = [
    { value: "", text: "unassigned" },
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

async function addTaskRequestMock(argumentTaskData) {
    expect(argumentTaskData).toEqual(taskData)
    return {
        title: argumentTaskData.title,
        description: argumentTaskData.description,
        status: argumentTaskData.status,
        userId: argumentTaskData.userId
    }
}

describe('Test AddTaskModalForm', () => {
    beforeAll(() => {
        vi.spyOn(TaskService, 'addTaskRequest').mockImplementation(addTaskRequestMock)
    })

    afterAll(() => {
        vi.restoreAllMocks();
    })

    it('should render', () => {
        render(
            <AddTaskModalForm 
                statusOptions={statusOptionsExample}
                userOptions={userOptionsExample}
            />
        )
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