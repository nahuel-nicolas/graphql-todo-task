import { useQuery } from '@apollo/client';

import { GET_USERS } from "../../queries/userQueries";
import { log } from '../../../utils/utils';


// if you wanna acces specific user then query like
// const { loading, error, data } = useQuery(GET_USER, { variables: { id: 'userId123' } });
// user = data.user

export default function GetUsers() {
    const { loading, error, data } = useQuery(GET_USERS);
  
    if (loading) return <p>Loading...</p>;
    if (error) {
      console.error(error)
      return <p>Something Went Wrong</p>;
    }
    log.debug(['GetUsers.data', { data }])
  
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