export const ActionTypes = {
    SET_UUID: 'SET_UUID',
  };

export const setUUID= (uuid) => ({
    type: ActionTypes.SET_UUID,
    payload: uuid
    });