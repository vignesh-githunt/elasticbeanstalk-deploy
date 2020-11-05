import { AUTH_SIGNIN, AUTH_SIGNOUT } from "../actions/actions";

const initialState = {
  authenticated: false,
  user: "",
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_SIGNIN:
      return { ...state, authenticated: true, user: action.payload };
    case AUTH_SIGNOUT:
      const newState = Object.assign({}, state);
      delete newState.user;
      return newState;
    default:
      return state;
  }
};

export default authReducer;
