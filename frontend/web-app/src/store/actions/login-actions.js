
export const ActionTypes = {
    SET_USERNAME: 'SET_USERNAME',
    SET_PASSWORD: 'SET_PASSWORD',
    SET_AUTHENTICATED: 'SET_AUTHENTICATED'
  };
  
export const setUsername = (username) => ({
type: ActionTypes.SET_USERNAME,
payload: username
});

export const setPassword = (password) => ({
type: ActionTypes.SET_PASSWORD,
payload: password
});

export const setAuthenticated = (isAuthenticated) => ({
type: ActionTypes.SET_AUTHENTICATED,
payload: isAuthenticated
});


