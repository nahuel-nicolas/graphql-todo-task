import TaskList from "./TaskList"


function Section({ children, name }) {
    return (
        <section className={name + 'section'}>
            <h3>{name.capitalize()}</h3>
            {children}
        </section>
    )
}

export default Section