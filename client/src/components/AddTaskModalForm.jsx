import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Modal, Select, Form, Button } from 'semantic-ui-react';

import { ADD_TASK } from '../graphql/mutations/taskMutations';
import { GET_TASKS } from '../graphql/queries/taskQueries';
import { GET_USERS } from '../graphql/queries/userQueries';
import { getOptionsFromApolloUseQueryResponse, getNewErrors } from '../utils/utils';
import { statusOptions, initUserOptions } from '../utils/options';


function AddTaskModalForm() {
    const [userOptions, setUserOptions] = useState(initUserOptions)
    const [task, setTaskData] = useState({
        title: '',
        description: '',
        status: '',
        userId: ''
    })
    const [open, setOpen] = useState(false)
    const onCompletedGetUsers = ({ users }) => {
        setUserOptions([
            ...userOptions,
            ...getOptionsFromApolloUseQueryResponse(users, 'id', 'username')
        ])
    }
    const { loading: usersLoading, error: usersError, data: usersData } = useQuery(
        GET_USERS, { onCompleted: onCompletedGetUsers }
    );
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

    const [errors, setErrors] = useState({
        title: null,
        status: null,
        userId: null
    })

    const handleChange = event => {
        setTaskData({
            ...task,
            [event.target.name]: event.target.value
        });
    };
    
    const handleSelectChange = (event, props) => {
        setTaskData({
            ...task,
            [props.name]: props.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!task.title || !task.status || !task.userId) {
            const newErrors = getNewErrors(errors, task, ['title', 'status', 'userId'])
            setErrors(newErrors)
            return null;
        }

        addTask(task.title, task.description, task.status, task.userId)

        setTaskData({
            title: '',
            description: '',
            status: '',
            userId: ''
        })
        setOpen(false)
    }
    
    const handleClose = async (e) => {
        e.preventDefault()
        setTaskData({
            title: '',
            description: '',
            status: '',
            userId: ''
        })
        setOpen(false)
    }

    if (usersLoading) return <p>Loading...</p>;
    if (usersError) {
        console.error(usersError)
        return <p>Something Went Wrong</p>;
    }

    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            trigger={<Button>Add Task</Button>}
        >
            <Modal.Header>Add Task</Modal.Header>
            <Modal.Content>
                <Form>
                    <Form.Input
                        required 
                        label='title' 
                        name='title'
                        role='add-task-title-input' 
                        value={task.title} 
                        onChange={handleChange}
                        error={errors.title} 
                    />
                    <Form.TextArea 
                        label='descripton' 
                        name='description'
                        role='add-task-description-textarea'   
                        value={task.description}
                        onChange={handleChange} 
                    />
                    <Select
                        required
                        label='Status' 
                        placeholder='Select task status' 
                        name='status'
                        data-testid='add-task-status-select'  
                        options={statusOptions} 
                        value={task.status}
                        onChange={handleSelectChange}
                        error={errors.status}
                    />
                    <Select
                        required 
                        placeholder='Assign a user' 
                        name='userId'
                        data-testid='add-task-userid-select'  
                        options={userOptions} 
                        value={task.userId}
                        onChange={handleSelectChange}
                        error={errors.userId}
                    />
                    <Button type='submit' onClick={handleSubmit} role='submit-button'>Submit</Button>
                    <Button type='submit' onClick={handleClose} role='close-button'>Close</Button>
                </Form>
            </Modal.Content>
        </Modal>
    )
}

export default AddTaskModalForm;