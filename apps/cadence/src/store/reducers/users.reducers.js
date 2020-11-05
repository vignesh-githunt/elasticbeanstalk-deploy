import { GET_ALL_USERS, SET_ALL_USERS } from '../actions/actions';

const usersReducer = (state = { fetchedAll: false }, action) => {
    switch (action.type) {
        case GET_ALL_USERS:

            return {
                ...state,
                ...action.payLoad
            }
            break;
        case SET_ALL_USERS:

            return {
                ...state,
                ...action.payLoad
            }
        default:
            return state
    }
}

export default usersReducer;