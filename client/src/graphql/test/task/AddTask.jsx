import { useMutation } from '@apollo/client';
import { useState } from "react";

import { ADD_TASK } from "../../mutations/taskMutations"
import { GET_TASKS } from "../../queries/taskQueries";


export default function AddTask({ taskData }) {
    const [task, setTask] = useState({
      title: taskData.title,
      description: taskData.description,
      status: taskData.status,
      userId: taskData.userId
    })
  
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
  
    const handleSubmit = (e) => {
      e.preventDefault()
      addTask(
        task.title,
        task.description,
        task.status,
        task.userId
      )
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