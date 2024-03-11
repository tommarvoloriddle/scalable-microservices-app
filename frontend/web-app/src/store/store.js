import { createStore, combineReducers  } from 'redux';
import loginReducer from './reducers/login-reducer';
import userReducer from './reducers/user-reducer';

// Combine reducers
const rootReducer = combineReducers({
    login: loginReducer,
    user: userReducer
  });
const store = createStore(rootReducer );

export default store;
