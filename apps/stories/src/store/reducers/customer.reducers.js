import { SET_CUSTOMER, REMOVE_CUSTOMER } from "../actions/actions";

const initialState = {
  id: "",
  name: ""
};

const customerDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CUSTOMER:
      return {
        ...state,
        id: action.customerId,
        name: action.customerName,
      };
    case REMOVE_CUSTOMER:
      const newState = Object.assign({}, state);
      delete newState.id;
      delete newState.name;
      return newState;
    default:
      return state;
  }
};

export default customerDetailsReducer;
