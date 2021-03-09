export const ActionTypes = [
  // Log in/out
  'LOGIN_START',
  'LOGIN_SUCCESS',
  'LOGIN_ERROR',
  'LOGOUT',
];


export default ActionTypes.reduce(
  (accumulator, type) => ({
    ...accumulator,
    [type]: type,
  }),
  {}
);
