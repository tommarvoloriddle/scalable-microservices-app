import { ActionTypes } from "../actions/user-actions";

const initialState = {
    uuid: "Jhon Doe"
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.SET_UUID:
            return {
                ...state,
                uuid: action.payload
            };
        default:
            return state;
    }
};

export default userReducer;
