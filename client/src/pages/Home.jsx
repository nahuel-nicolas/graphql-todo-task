import AddTaskModalForm from "../components/AddTaskModalForm"
import AddUserModalForm from "../components/AddUserModalForm"
import TaskList from "../components/TaskList"
import UserList from "../components/UserList"
import Section from "../containers/Section"


function Home() {
    return (
        <div id="home">
            <div className="add-forms">
                <AddUserModalForm />
                <AddTaskModalForm />
            </div>
            <Section name='task'>
                <TaskList />
            </Section>
            <Section name='user'>
                <UserList />
            </Section>
        </div>
    )
}

export default Home