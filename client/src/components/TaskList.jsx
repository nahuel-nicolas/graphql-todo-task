import TaskListItem from "./TaskListItem"


function TaskList({ tasks }) {
    return (
        <div className="task-container">
            {tasks.map((task, idx) => <TaskListItem taskData={task} key={idx} />)}
        </div>
    )
}

export default TaskList