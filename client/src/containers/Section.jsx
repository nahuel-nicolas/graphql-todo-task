import { capitalizeFirstLetter } from "../utils/utils";


function Section({ children, name }) {
    return (
        <section className={name + 'section'}>
            <h2>{capitalizeFirstLetter(name) + 's'}</h2>
            {children}
        </section>
    )
}

export default Section