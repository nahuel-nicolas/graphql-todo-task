import { useQuery, useMutation } from '@apollo/client';
import { useEffect, useState } from "react";

import { DELETE_USER } from "../../mutations/userMutations";
import { GET_USERS } from "../../queries/userQueries";
import { GET_TASKS } from "../../queries/taskQueries";
import { log } from '../../../utils/utils';


export default function DeleteUser({ deleteUserData }) {
    const [userToDelete, setUserToDelete] = useState({...deleteUserData, id: ''})
    const { loading, error, data } = useQuery(GET_USERS);
    const [deleteUser] = useMutation(DELETE_USER, {
      variables: { id: userToDelete.id },
      refetchQueries: [{ query: GET_USERS }, { query: GET_TASKS }],
    });
  
    if (loading) return <p>Loading...</p>;
    if (error) {
      console.error(error)
      return <p>Something Went Wrong</p>;
    }
  
    useEffect(() => {
      if (userToDelete.id) {
        deleteUserHelper(userToDelete)
      }
    }, [userToDelete])
  
    const deleteUserHelper = async () => {
      log.debug(['DeleteUser.deleteUserHelper()', { userToDelete }])
      return await deleteUser(userToDelete.id)
    }
  
    const handleDeleteUser = (e) => {
      const { users } = data;
      if (users.length) {
        const user = users.find(user => user.username === deleteUserData.username)
        if (user) setUserToDelete(user)
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
                <td>{userToDelete.id}</td>
                <td>{userToDelete.username}</td>
              </tr>
            </tbody>
          </table>
          <button role='delete-user-button' onClick={handleDeleteUser}>Delete User</button>
          </>
        )}
      </>
    );
  }