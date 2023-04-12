
import { useParams } from 'react-router-dom'
import EditTaskForm from '../components/EditTaskForm'


export default function Task() {
    const id = useParams()["id"]
    return <EditTaskForm taskId={id} />
}