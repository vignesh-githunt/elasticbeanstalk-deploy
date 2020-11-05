import { GET_ALL_ACCOUNTS, SET_ALL_ACCOUNTS } from '../actions/actions';

const accountsReducer = (state = { fetchedAll: false }, action) => {
    switch (action.type) {
        case GET_ALL_ACCOUNTS:

            return {
                ...state
            }
            break;
        case SET_ALL_ACCOUNTS:

            return {
                ...state,
                ...action.payLoad
            }
        default:
            return state
    }
}

export default accountsReducer;