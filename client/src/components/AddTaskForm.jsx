import { useState } from 'react';
import { Select, Form, Button } from 'semantic-ui-react';

import { addTaskRequest } from "../services/TaskService";


function AddTaskForm({ statusOptions, userOptions, isOpenForm }) {
    const [state, setState] = useState({
        title: '',
        description: '',
        status: '',
        userId: ''
    })

    const handleChange = event => {
        setState({
            ...state,
            [event.target.name]: event.target.value
        });
    };
    
    const handleSelectChange = (event, props) => {
        setState({
            ...state,
            [props.name]: props.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault()

        await addTaskRequest(state)

        setState({
            title: '',
            description: '',
            status: '',
            userId: ''
        })
        isOpenForm(false)
    } 

    return (
        <Form>
            <Form.Input 
                label='title' 
                name='title'
                role='add-task-title-input' 
                value={state.title} 
                onChange={handleChange} 
            />
            <Form.TextArea 
                label='descripton' 
                name='description'
                role='add-task-description-textarea'   
                value={state.description}
                onChange={handleChange} 
            />
            <Select
                label='Status' 
                placeholder='Select task status' 
                name='status'
                data-testid='add-task-status-select'  
                options={statusOptions} 
                value={state.status}
                onChange={handleSelectChange} 
            />
            <Select 
                placeholder='Assign a user' 
                name='userId'
                data-testid='add-task-userid-select'  
                options={userOptions} 
                value={state.userId}
                onChange={handleSelectChange} 
            />
            <Button type='submit' onClick={handleSubmit} role='submit-button'>Submit</Button>
        </Form>
    )
}

export default AddTaskForm;