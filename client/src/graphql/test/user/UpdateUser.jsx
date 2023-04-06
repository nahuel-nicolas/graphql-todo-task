import { useQuery, useMutation } from '@apollo/client';
import { useEffect, useState } from "react";

import { UPDATE_USER } from "../../mutations/userMutations";
import { GET_USERS, GET_USER } from "../../queries/userQueries";


export default function UpdateUser({ addUserData, updateUserData }) {
    const [userToUpdate, setUserToUpdate] = useState({ ...updateUserData, id: '' })
    const { loading, error, data } = useQuery(GET_USERS);
    const [updateUser] = useMutation(UPDATE_USER, {
      variables: { 
        id: userToUpdate.id, 
        username: updateUserData.username,
        password: updateUserData.password
      },
      refetchQueries: [{ query: GET_USER, variables: { id: userToUpdate.id } }],
    });
  
    if (loading) return <p>Loading...</p>;
    if (error) {
      console.error(error)
      return <p>Something Went Wrong</p>;
    }
  
    useEffect(() => {
      if (userToUpdate.id) {
        updateUserHelper(userToUpdate)
      }
    }, [userToUpdate])
  
    const updateUserHelper = async () => {
      console.log([
        'updateUserHelper', 
        { 
          id: userToUpdate.id, 
          username: updateUserData.username,
          password: updateUserData.password
        }
      ])
  
      return await updateUser(
        userToUpdate.id, 
        updateUserData.username,
        updateUserData.password
      )
    }
  
    const handleUpdateUser = (e) => {
      const { users } = data;
      if (users.length) {
        const user = users.find(user => user.username === addUserData.username)
        if (user) {
          setUserToUpdate(user)
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
                <td>{userToUpdate.id}</td>
                <td>{userToUpdate.username}</td>
              </tr>
            </tbody>
          </table>
          <button role='update-user-button' onClick={handleUpdateUser}>Update User</button>
          </>
        )}
      </>
    );
  }