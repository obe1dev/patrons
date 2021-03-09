import { isEmpty, isEqual } from 'lodash';

export default function createReducer(
  initialState,
  handlers,
  subReducers = {}
) {
  return (state = initialState, action) => {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action);
    } else if (!isEmpty(subReducers)) {
      const subState = Object.entries(subReducers).reduce(
        (acc, [key, subReducer]) => {
          const updated = subReducer(state[key], action);
          if (!isEqual(state[key], updated)) {
            acc[key] = updated;
          }
          return acc;
        },
        {}
      );
      if (!isEmpty(subState)) {
        // Only integrate if there are changes
        return {
          ...state,
          ...subState,
        };
      } else {
        return state;
      }
    } else {
      return state;
    }
  };
}
