import { describe } from "vitest"

export async function addTaskRequest(taskData) {
    return await Promise.all({
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        user: {
            id: taskData.userId
        }
    })
}

const addTaskData = {
    title: 'testTaskTitle1',
    description: 'testTaskDescription1',
    status: 'new',
    userId: null
}

describe.skip('test TaskService', () => {
    
})