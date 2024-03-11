import { ActionTypes } from '../actions/login-actions';
  
const initialState = {
  username: '',
  password: '',
  isAuthenticated: false
};

const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SET_USERNAME:
      return {
        ...state,
        username: action.payload
      };
    case ActionTypes.SET_PASSWORD:
      return {
        ...state,
        password: action.payload
      };
    case ActionTypes.SET_AUTHENTICATED:
      return {
        ...state,
        isAuthenticated: action.payload
      };
    default:
      return state;
  }
};

export default loginReducer;