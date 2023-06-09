import { useQuery } from '@apollo/client';
import { GET_TASKS } from "../graphql/queries/taskQueries";

import TaskListItem from "./TaskListItem"
import { log } from '../utils/utils';


function TaskList() {
    const { loading, error, data } = useQuery(GET_TASKS);

    if (loading) {
        return <p>Loading...</p>
    } else if (error) {
        console.error(error)
        return <p>Something Went Wrong</p>;
    }

    log.debug(['TaskList.data', { data }])

    return (
        <div className="task-list">
            {data.tasks.map((task, idx) => <TaskListItem taskData={task} key={idx} />)}
        </div>
    )
}

export default TaskList