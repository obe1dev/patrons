import ActionTypes from 'actions/types';
import createReducer from 'reducers/createReducer';

export const initialState = {
  instance: null,
  authenticated: false,
  login: false,
  username: null,
};

export default createReducer(initialState, {
  [ActionTypes.LOGIN_START]: state => {
    return {
      ...state,
      loggingIn: true,
      authenticated: false,
    };
  },
  [ActionTypes.LOGIN_SUCCESS]: (state, action) => {
    return {
      ...state,
      ...action.payload.data,
      loggingIn: false,
      authenticated: true,
    };
  },
  [ActionTypes.LOGIN_ERROR]: (_, action) => {
    return {
      authenticated: false,
      loggingIn: false,
      error: action.payload.error.message,
    };
  },
  [ActionTypes.LOGOUT]: state => {
    return {
      authenticated: false,
      instance: state.instance,
      username: state.username,
    };
  },
});
