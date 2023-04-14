import { useQuery, useMutation } from '@apollo/client';
import { useEffect, useState } from "react";

import { DELETE_TASK } from "../../mutations/taskMutations";
import { GET_TASKS } from "../../queries/taskQueries";
import { log } from '../../../utils/utils';


export default function DeleteTask({ deleteTaskData }) {
  const [taskToDelete, setTaskToDelete] = useState({...deleteTaskData, id: ''})
  const { loading, error, data } = useQuery(GET_TASKS);
  const [deleteTask] = useMutation(DELETE_TASK, {
    variables: { id: taskToDelete.id },
    refetchQueries: [{ query: GET_TASKS }],
  });

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error(error)
    return <p>Something Went Wrong</p>;
  }

  useEffect(() => {
    if (taskToDelete.id) {
      deleteTaskHelper(taskToDelete)
    }
  }, [taskToDelete])

  const deleteTaskHelper = async () => {
    log.debug(['DeleteTask.deleteTaskHelper()', {
      taskToDeleteId: taskToDelete.id,
      taskToDeleteTitle: taskToDelete.title
    }])
    return await deleteTask(taskToDelete.id)
  }

  const handleDeleteTask = (e) => {
    const { tasks } = data;
    if (tasks.length) {
      const task = tasks.find(task => task.title=== deleteTaskData.title)
      if (task) setTaskToDelete(task)
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
              <td>{taskToDelete.id}</td>
              <td>{taskToDelete.title}</td>
            </tr>
          </tbody>
        </table>
        <button role='delete-task-button' onClick={handleDeleteTask}>Delete Task</button>
        </>
      )}
    </>
  );
}