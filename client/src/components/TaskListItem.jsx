import { Link } from 'react-router-dom'

function TaskListItem({ taskData }) {
    function getFirstDigits(string, digits) {
        if (string.length <= 4) {
            return string
        }
        return string.slice(0, digits)
    }

    return (
        <div className="task">
            <h3>{getFirstDigits(taskData.id, 4)}</h3>
            <p>{taskData.title}</p>
            <p>Status: {taskData.status}</p>
            <p>Assigned to: {taskData.user?.username}</p>
            <Link to={`/task/${taskData.id}`}>
                <button role="task-link">View</button>
            </Link>
        </div>
    )
}

export default TaskListItem