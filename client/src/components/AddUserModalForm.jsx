import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Modal, Form, Button } from 'semantic-ui-react';

import { ADD_USER } from '../graphql/mutations/userMutations';
import { GET_USERS } from '../graphql/queries/userQueries';


export default function AddUserModalForm() {
    const [user, setUserData] = useState({
        username: '',
        password: ''
    })
    const [open, setOpen] = useState(false)
    const [addUser] = useMutation(ADD_USER, {
        variables: {
          username: user.username,
          password: user.password
        },
        update(cache, { data: { addUser } }) {
          const cacheData = cache.readQuery({ query: GET_USERS });
          const users = cacheData?.users;
          if (users) {
            cache.writeQuery({
              query: GET_USERS,
              data: { users: [...users, addUser] },
            });
          }
        },
    });

    const handleChange = event => {
        setUserData({
            ...user,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault()

        addUser(user.username, user.password)

        setUserData({
            username: '',
            password: ''
        })
        setOpen(false)
    }
    
    const handleClose = async (e) => {
        e.preventDefault()
        setUserData({
            username: '',
            password: ''
        })
        setOpen(false)
    }

    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            trigger={<Button>Add User</Button>}
        >
            <Modal.Header>Add User</Modal.Header>
            <Modal.Content>
                <Form>
                    <Form.Input 
                        label='username' 
                        name='username'
                        role='add-user-username-input' 
                        value={user.username} 
                        onChange={handleChange} 
                    />
                    <Form.Input 
                        label='password' 
                        name='password'
                        role='add-user-password-input' 
                        value={user.password}
                        onChange={handleChange} 
                    />
                    <Button type='submit' onClick={handleSubmit} role='submit-button'>Submit</Button>
                    <Button type='submit' onClick={handleClose} role='close-button'>Close</Button>
                </Form>
            </Modal.Content>
        </Modal>
    )
}