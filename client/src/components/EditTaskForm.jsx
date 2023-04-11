import { useEffect, useState, useCallback } from "react"
import { useQuery, useMutation } from "@apollo/client"
import { useNavigate } from 'react-router-dom'
import { Select, Form, Button } from 'semantic-ui-react';

import { GET_TASK, GET_TASKS } from "../graphql/queries/taskQueries"
import { GET_USERS } from "../graphql/queries/userQueries"
import { UPDATE_TASK, DELETE_TASK } from "../graphql/mutations/taskMutations"
import { statusOptions, initUserOptions } from "../utils/options"
import { getOptionsFromApolloUseQueryResponse } from "../utils/utils"


export default function EditTaskForm({ taskId }) {
    const navigateTo = useNavigate()
    const [userOptions, setUserOptions] = useState([])
    const [task, setTask] = useState({
        id: '',
        title: '',
        description: '',
        status: '',
        userId: ''
    })

    // as per https://github.com/apollographql/react-apollo/issues/4008 recomends using useCallback
    // const onCompletedGetUsers = useCallback((data) => {
    //     console.log(['EditTaskForm.onCompletedGetUsers', data])
    //     if (data) {
    //         setUserOptions([
    //             ...initUserOptions,
    //             ...getOptionsFromApolloUseQueryResponse(data.users, 'id', 'username')
    //         ])
    //     }
    // }, [])
    // const onCompletedGetTask = useCallback((data) => {
    //     console.log(['EditTaskForm.onCompletedGetTask', data])
    //     if (data) {
    //         setTask(data.task)
    //     }
    // }, [])

    const onCompletedGetUsers = (data) => {
        console.log(['EditTaskForm.onCompletedGetUsers', data])
        if (data) {
            setUserOptions([
                ...initUserOptions,
                ...getOptionsFromApolloUseQueryResponse(data.users, 'id', 'username')
            ])
        }
    }
    const onCompletedGetTask = (data) => {
        console.log(['EditTaskForm.onCompletedGetTask', data])
        if (data) {
            setTask(data.task)
        }
    }
    
    const { loagin: usersLoading, error: usersError, data: users } = useQuery(
        GET_USERS, { 
            onCompleted: onCompletedGetUsers
        }
    );

    const { loagin: taskLoading, error: taskError, data: taskData } = useQuery(
        GET_TASK, 
        { 
            variables: { id: taskId }, 
            onCompleted: onCompletedGetTask
        }
    );

    const [deleteTask] = useMutation(DELETE_TASK, {
        variables: { id: task.id },
        refetchQueries: [{ query: GET_TASKS }],
    });
    const [updateTask] = useMutation(UPDATE_TASK, {
        variables: { 
          id: task.id, 
          title: task.title,
          description: task.description,
          status: task.status,
          userId: task.userId
        },
        refetchQueries: [{ query: GET_TASK, variables: { id: task.id } }],
    });

    const handleChange = event => {
        setTask({
            ...task,
            [event.target.name]: event.target.value
        });
    };
    
    const handleSelectChange = (event, props) => {
        setTask({
            ...task,
            [props.name]: props.value
        });
    };

    const handleBack = (e) => {
        e.preventDefault()
        navigateTo('/')
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        updateTask(
            task.id, 
            task.title, 
            task.description, 
            task.status, 
            task.userId
        )
    }
    
    const handleDelete = (e) => {
        e.preventDefault()
        deleteTask(task.id) 
    }

    if (usersLoading || taskLoading) return <p>Loading...</p>;
    if (usersError || taskError) {
        console.error(usersError || taskError)
        return <p>Something Went Wrong</p>;
    }

    return (
        <Form>
            <Form.Input 
                label='title' 
                name='title'
                role='title-input' 
                value={task.title} 
                onChange={handleChange} 
            />
            <Form.TextArea 
                label='descripton' 
                name='description'
                role='description-textarea'   
                value={task.description}
                onChange={handleChange} 
            />
            <Select
                label='Status' 
                placeholder='Select task status' 
                name='status'
                data-testid='status-select'  
                options={statusOptions} 
                value={task.status}
                onChange={handleSelectChange} 
            />
            <Select 
                placeholder='Assign a user' 
                name='userId'
                data-testid='user-select'  
                options={userOptions} 
                value={task.userId}
                onChange={handleSelectChange} 
            />
            <Button type='submit' onClick={handleBack} role='back-button'>Back</Button>
            <Button type='submit' onClick={handleSubmit} role='submit-button'>Submit</Button>
            <Button type='submit' onClick={handleDelete} role='delete-button'>Delete</Button>
        </Form>
    )
}