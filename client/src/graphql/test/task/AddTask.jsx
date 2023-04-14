import { useMutation, useQuery } from '@apollo/client';
import { useEffect, useState } from "react";

import { ADD_TASK } from "../../mutations/taskMutations"
import { GET_TASKS } from "../../queries/taskQueries";
import { GET_USERS } from "../../queries/userQueries";
import { log } from '../../../utils/utils';


export default function AddTask({ taskData, userData }) {
  const { loading, error, data } = useQuery(GET_USERS);
  const [task, setTask] = useState({
    title: taskData.title,
    description: taskData.description,
    status: taskData.status,
    userId: taskData.userId
  })

  useEffect(() => {
    const userId = getUserId()
    log.debug(['AddTask.useEffect[]', { userId }])
    setTask({
      ...task,
      userId: userId
    })
  }, [])

  const [addTask] = useMutation(ADD_TASK, {
    variables: {
      title: task.title,
      description: task.description,
      status: task.status,
      userId: task.userId
    },
    update(cache, { data: { addTask } }) {
      const cacheData = cache.readQuery({ query: GET_TASKS });
      const tasks = cacheData?.tasks;
      if (tasks) {
        cache.writeQuery({
          query: GET_TASKS,
          data: { tasks: [...tasks, addTask] },
        });
      }
    },
  });

  const getUserId = () => {
    if (userData) {
      const usersResponseData = data
      return usersResponseData.users.find(user => user.username === userData.username).id
    }
    return null
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    log.debug(['AddTask.handleSubmit()', { taskData: task }])
    addTask(
      task.title,
      task.description,
      task.status,
      task.userId
    )
  }

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error(error)
    return <p>Something Went Wrong</p>;
  }

  return (
    <>
      <p>{task.title}</p>
      <p>{task.description}</p>
      <p>{task.status}</p>
      <p>{task.userId}</p>
      <button role="submit-button" onClick={handleSubmit}>Add Task</button>
    </>
  )
}