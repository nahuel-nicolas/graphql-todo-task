import { Button } from 'semantic-ui-react';
import { useMutation } from '@apollo/client';

import { GET_USERS } from '../graphql/queries/userQueries';
import { GET_TASKS } from '../graphql/queries/taskQueries';
import { DELETE_USER } from '../graphql/mutations/userMutations';


export default function UserListItem({ userData }) {
    const [deleteUser] = useMutation(DELETE_USER, {
        variables: { id: userData.id },
        refetchQueries: [{ query: GET_USERS }, { query: GET_TASKS }],
    });

    const handleSubmit = (e) => {
        e.preventDefault()
        deleteUser(userData.id)
    }

    return (
        <div className="user-list-item">
            <span>{userData.username}</span>
            <Button type='submit' onClick={handleSubmit} role='delete-button'>Delete</Button>
        </div>
    )
}