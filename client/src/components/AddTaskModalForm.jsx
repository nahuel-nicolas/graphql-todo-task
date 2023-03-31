import { useState } from 'react';
import { Modal, Select, Form, Button } from 'semantic-ui-react';

import { addTaskRequest } from "../services/TaskService";


function AddTaskModalForm({ statusOptions, userOptions }) {
    const [taskData, setTaskData] = useState({
        title: '',
        description: '',
        status: '',
        userId: ''
    })
    const [open, setOpen] = useState(false)

    const handleChange = event => {
        setTaskData({
            ...taskData,
            [event.target.name]: event.target.value
        });
    };
    
    const handleSelectChange = (event, props) => {
        setTaskData({
            ...taskData,
            [props.name]: props.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault()

        await addTaskRequest(taskData)

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
                        label='title' 
                        name='title'
                        role='add-task-title-input' 
                        value={taskData.title} 
                        onChange={handleChange} 
                    />
                    <Form.TextArea 
                        label='descripton' 
                        name='description'
                        role='add-task-description-textarea'   
                        value={taskData.description}
                        onChange={handleChange} 
                    />
                    <Select
                        label='Status' 
                        placeholder='Select task status' 
                        name='status'
                        data-testid='add-task-status-select'  
                        options={statusOptions} 
                        value={taskData.status}
                        onChange={handleSelectChange} 
                    />
                    <Select 
                        placeholder='Assign a user' 
                        name='userId'
                        data-testid='add-task-userid-select'  
                        options={userOptions} 
                        value={taskData.userId}
                        onChange={handleSelectChange} 
                    />
                    <Button type='submit' onClick={handleSubmit} role='submit-button'>Submit</Button>
                    <Button type='submit' onClick={handleClose} role='close-button'>Close</Button>
                </Form>
            </Modal.Content>
        </Modal>
    )
}

export default AddTaskModalForm;