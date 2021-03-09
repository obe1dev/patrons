import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer, createTransform } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import thunk from 'redux-thunk';
import messaging from '@react-native-firebase/messaging';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
import createDebugger from 'redux-flipper';
// import crashlytics from '@react-native-firebase/crashlytics';

// import logger from 'logger';
// import { networkMiddleware } from 'actions/network';
// import { handleClubTow } from 'actions/notification';
import { get } from 'lodash';
import Reducers from 'reducers';

export const recentReduxActions = [];

const recentActionsMiddleware = () => next => action => {
  // Keep a record of the last 100 items
  recentReduxActions.push(action);
  while (recentReduxActions.length > 200) {
    recentReduxActions.shift();
  }
  // Save last 10 actions to crashlytics
  //   crashlytics().setAttribute(
  //     'Redux Actions (last 10)',
  //     recentReduxActions
  //       .slice(0, -10)
  //       .map(a => a.type)
  //       .join('\n')
  //   );
  return next(action);
};

const middlewares = [thunk, recentActionsMiddleware]; // ,networkMiddleware];

if (__DEV__) {
  // Find redux mutations (NOT FOR USE IN PROD)
  middlewares.push(reduxImmutableStateInvariant());
  // Connect redux to flipper
  middlewares.push(createDebugger());
}

// const photoStartupTransform = createTransform(
//   // we want to reset the uploading flag of each photo record

//   // function called whenever photo state saved to AsyncStorage
//   state => state,
//   // function called when loading state from AsyncStorage at startup
//   state => {
//     const photos = state.photos.map(photo => {
//       if (photo.uploading) {
//         return {
//           ...photo,
//           uploading: false,
//         };
//       } else {
//         return photo;
//       }
//     });
//     return {
//       ...state,
//       photos,
//       // Also reset these
//       syncing: [],
//       pinned: [],
//     };
//   },
//   { whitelist: ['jobs'] }
// );

const notificationStartupTransform = createTransform(
  state => state,
  // function called when loading state from AsyncStorage at startup
  state => {
    const deviceToken = get(state, 'deviceToken', null);
    const instancePushes = get(state, 'instancePushes', {});
    const isscJobs = get(state, 'isscJobs', {});
    const issResponse = get(state, 'issResponse', {});
    return {
      ...state,
      deviceToken,
      instancePushes,
      isscJobs,
      issResponse,
    };
  },
  { whitelist: ['notification'] }
);

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  transforms: [notificationStartupTransform], // ,photoStartupTransform],
  whitelist: [
    // 'jobs',
    // 'notification',
    // 'options',
    // 'prefs',
    'user',
    // 'property',
    // 'userColor',
  ],
};

const persistedReducer = persistReducer(persistConfig, Reducers);

export const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(...middlewares))
);

// Keep a reference to this so we can wait for redux to restore in message handler
// let resolver;
// const persistPromise = new Promise(resolve => {
//   resolver = resolve;
// });
// messaging().setBackgroundMessageHandler(async notification => {
//   logger.info('Received a background notification', notification);
//   await persistPromise; // Must be restored before we can save the push
//   const data = notification.data;
//   if (data.id && data.type) {
//     const [_, obj] = data.type.split('_');
//     // if (obj === 'CLUBTOW') {
//     //   await store.dispatch(handleClubTow(notification, true));
//     // }
//   }
// });
// resolver is callback function when store has been restored
export const persistor = persistStore(store, null); //, resolver);

export default {
  store,
  //   persistor,
};
