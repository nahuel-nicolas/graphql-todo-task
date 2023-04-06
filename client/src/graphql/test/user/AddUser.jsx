import { useMutation } from '@apollo/client';
import { useState } from "react";

import { ADD_USER } from "../../mutations/userMutations";
import { GET_USERS } from "../../queries/userQueries";


export default function AddUser({ addUserData }) {
    const [user, setUser] = useState({
      username: addUserData.username,
      password: addUserData.password
    })
  
    const [addUser] = useMutation(ADD_USER, {
      variables: { username: user.username, password: user.password },
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
  
    const handleSubmit = (e) => {
      e.preventDefault()
      addUser(user.username, user.password)
    }
  
    const handleChange = (event) => {
      setUser({
        ...user,
        [event.target.name]: event.target.value
      })
    }
  
    return (
      <>
        <p>{user.username}</p>
        <p>{user.password}</p>
        <button role="submit-button" onClick={handleSubmit}>Add User</button>
      </>
    )
  }