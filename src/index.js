import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { StatusBar, Platform, UIManager, LogBox } from 'react-native';
// import { PersistGate } from 'redux-persist/integration/react';
import NetInfo from '@react-native-community/netinfo';
import SplashScreen from 'react-native-splash-screen';
import NavBar from 'react-native-navbar-color';

import Navigators from 'navigators';
import { store } from 'store'; //persistor
// import { changeConnectedStatus, updateNetworkStatus } from 'actions/network';
// import { handleReduxChange } from 'api/photoUploader';
// import Colors from 'styles/colors';
// import { ToastProvider } from 'components/toast';
// import ValidationProvider from 'components/validationProvider';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state', // We don't serialize navigation state
  'Require cycle', // These are allowed so we don't need to see them in the app
]);

// Enable layout animations for android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function App({ isHeadless }) {
  const [online, setOnline] = useState(true);
  // Hide splash screen
  useEffect(() => {
    // NOTE: Must hide this  as part of mounting this component and not just when the JS loads
    SplashScreen.hide();
  }, []);
  // Set up network listener
  useEffect(() => {
    // return NetInfo.addEventListener(networkState => {
    //   const { network } = store.getState();
    //   if (network.connected !== networkState.isConnected) {
    //     store.dispatch(changeConnectedStatus(networkState.isConnected));
    //   }
    //   if (networkState.isInternetReachable !== null) {
    //     store.dispatch(updateNetworkStatus(networkState.isInternetReachable));
    //   }
    //   const { network: updated } = store.getState();
    //   setOnline(updated.online);
    // });
  }, []);
  // Set up our photo uploader
  // useEffect(() => {
  //   return store.subscribe(handleReduxChange);
  // }, []);

  if (isHeadless) {
    return null; // Don't load react tree if headless
  }
  NavBar.setColor(online ? 'blue' : 'gray');
  // NOTE: Status bar color below is only for android
  return (
    <Provider store={store} id="provider">
      {/* <StatusBar backgroundColor={online ? 'blue' : 'gray'} />
      <PersistGate loading={null} persistor={persistor}>
        <ToastProvider>
          <ValidationProvider> */}
      <Navigators />
      {/* </ValidationProvider>
        </ToastProvider>
      </PersistGate> */}
    </Provider>
  );
}
