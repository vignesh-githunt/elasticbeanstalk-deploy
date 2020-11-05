import { GET_ALL_CADENCES, SET_ALL_CADENCES } from '../actions/actions';

const cadenceReducer = (state = { fetchedAll: false }, action) => {
    switch (action.type) {
        case GET_ALL_CADENCES:

            return {
                ...state,
                ...action.payLoad
            }
            break;
        case SET_ALL_CADENCES:

            return {
                ...state,
                ...action.payLoad
            }
        default:
            return state
    }
}

export default cadenceReducer;