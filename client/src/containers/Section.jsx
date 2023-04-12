import { capitalizeFirstLetter } from "../utils/utils";


function Section({ children, name }) {
    return (
        <section className={name + 'section'}>
            <h3>{capitalizeFirstLetter(name)}</h3>
            {children}
        </section>
    )
}

export default Section