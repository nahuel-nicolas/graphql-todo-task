import { useQuery } from '@apollo/client';
import { GET_USERS } from "../graphql/queries/userQueries";

import UserListItem from "./UserListItem"
import { log } from '../utils/utils';


export default function UserList() {
    const { loading, error, data } = useQuery(GET_USERS);

    if (loading) {
        return <p>Loading...</p>
    } else if (error) {
        console.error(error)
        return <p>Something Went Wrong</p>;
    }

    log.debug(['UserList.data', { data }])

    return (
        <div className="user-list">
            {data.users.map((user, idx) => <UserListItem userData={user} key={idx} />)}
        </div>
    )
}