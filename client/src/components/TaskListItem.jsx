import { Link } from 'react-router-dom'
import { Button } from 'semantic-ui-react'

import { getLastDigits } from '../utils/utils'


function TaskListItem({ taskData }) {
    return (
        <div className="task">
            <h3>{getLastDigits(taskData.id, 4)}</h3>
            <div className="data">
                <p className='title'>{taskData.title}</p>
                <p>Status: {taskData.status}</p>
                <p>Assigned to: {taskData.user ? taskData.user.username : 'Unassigned' }</p>
            </div>
            <Link to={`/task/${taskData.id}`}>
                <Button role="task-link">View</Button>
            </Link>
        </div>
    )
}

export default TaskListItem