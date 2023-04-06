import { useQuery } from '@apollo/client';

import { GET_USERS } from "../../queries/userQueries";


export default function GetUsers() {
    const { loading, error, data } = useQuery(GET_USERS);
    console.log(data)
  
    if (loading) return <p>Loading...</p>;
    if (error) {
      console.error(error)
      return <p>Something Went Wrong</p>;
    }
  
    return (
      <>
        {!loading && !error && (
          <table>
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map((user, idx) => (
                <tr key={idx}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                </tr>
                ))}
            </tbody>
          </table>
        )}
      </>
    );
  }