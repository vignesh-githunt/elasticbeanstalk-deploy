import { GET_ALL_TAGS, SET_ALL_TAGS } from '../actions/actions';

const tagsReducer = (state = { fetchedAll: false }, action) => {
    switch (action.type) {
        case GET_ALL_TAGS:

            return {
                ...state,
                ...action.payLoad
            }
            break;
        case SET_ALL_TAGS:

            return {
                ...state,
                ...action.payLoad
            }
        default:
            return state
    }
}

export default tagsReducer;