import { useQuery, useMutation } from '@apollo/client';
import { useEffect, useState } from "react";

import { UPDATE_TASK } from "../../mutations/taskMutations"
import { GET_TASKS, GET_TASK } from "../../queries/taskQueries";
import { log } from '../../../utils/utils';


export default function UpdateTask({ addTaskData, updateTaskData }) {
    const [taskToUpdate, setTaskToUpdate] = useState({ ...updateTaskData, id: '' })
    const { loading, error, data } = useQuery(GET_TASKS);
    const [updateTask] = useMutation(UPDATE_TASK, {
      variables: { 
        id: taskToUpdate.id, 
        title: updateTaskData.title,
        description: updateTaskData.description,
        status: updateTaskData.status,
        userId: updateTaskData.userId
      },
      refetchQueries: [{ query: GET_TASK, variables: { id: taskToUpdate.id } }],
    });
  
    if (loading) return <p>Loading...</p>;
    if (error) {
      console.error(error)
      return <p>Something Went Wrong</p>;
    }
  
    useEffect(() => {
      if (taskToUpdate.id) {
        updateTaskHelper(taskToUpdate)
      }
    }, [taskToUpdate])
  
    const updateTaskHelper = async () => {
      log.debug(['UpdateTask.updateTaskHelper()', { ...updateTaskData, id: taskToUpdate.id }])
  
      return await updateTask(
        taskToUpdate.id,
        updateTaskData.title,
        updateTaskData.description,
        updateTaskData.status,
        updateTaskData.userId
      )
    }
  
    const handleUpdateTask = (e) => {
      const { tasks } = data;
      if (tasks.length) {
        const task = tasks.find(task => task.title === addTaskData.title)
        if (task) {
          setTaskToUpdate(task)
        }
      }
    }
  
    return (
      <>
        {!loading && !error && (
          <>
          <table>
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{taskToUpdate.id}</td>
                <td>{taskToUpdate.title}</td>
              </tr>
            </tbody>
          </table>
          <button role='update-task-button' onClick={handleUpdateTask}>Update Task</button>
          </>
        )}
      </>
    );
  }