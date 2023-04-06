import { useQuery } from '@apollo/client';

import { GET_TASKS } from "../../queries/taskQueries";


export default function GetTasks() {
    const { loading, error, data } = useQuery(GET_TASKS);
  
    if (loading) return <p>Loading...</p>;
    if (error) {
      console.error(error)
      return <p>Something Went Wrong</p>;
    }
    console.log(['GetTasks.data', { data }])
  
    return (
      <>
        {!loading && !error && (
          <table>
            <thead>
              <tr>
                <th>Id</th>
                <th>Title</th>
              </tr>
            </thead>
            <tbody>
              {data.tasks.map((task, idx) => (
                <tr key={idx}>
                  <td>{task.id}</td>
                  <td>{task.title}</td>
                </tr>
                ))}
            </tbody>
          </table>
        )}
      </>
    );
  }