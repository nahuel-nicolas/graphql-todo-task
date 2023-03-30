export async function addTaskRequest(taskData) {
    return Promise.all({
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        user: {
            id: taskData.userId
        }
    })
}