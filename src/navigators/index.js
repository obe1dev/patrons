import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
// import { useSelector } from 'react-redux';
// import { get } from 'lodash';
// import crashlytics from 'firebase/crashlytics';

import MainNav from 'navigators/main';
import AuthNav from 'navigators/auth';
// import OfflineAwareHeader from 'components/offlineAwareHeader';
// import Colors from 'styles/colors';
import { navigationRef } from './ref';
import Stack from 'navigators/stack';

export const recentNavState = [];

function trackStateChange(state) {
  const curRoute = state.routes[state.index];
  recentNavState.push(curRoute);
  while (recentNavState.length > 100) {
    recentNavState.shift();
  }
  // Log current screen to crashlytics
  // crashlytics().setAttribute(
  //   'Current Screen',
  //   curRoute.routeName + ': ' + JSON.stringify(curRoute.params)
  // );
}

export default function Navigation() {
  //TODO:
  const isLoggedIn = false; //useSelector(state => get(state, 'user.authenticated'));

  const screens = isLoggedIn ? MainNav : AuthNav;

  return (
    <NavigationContainer ref={navigationRef} onStateChange={trackStateChange}>
      <Stack.Navigator
        initialRouteName={'Main'}
        screenOptions={{
          headerTitleAlign: 'center',
          headerBackTitleVisible: false,
          headerTitleAllowFontScaling: false,
          //   headerBackground: () => <OfflineAwareHeader />,
          //   headerStyle: {
          //     borderBottomColor: Colors.blue9,
          //   },
          //   headerTintColor: Colors.white,
          headerTitleStyle: {
            fontSize: 24,
            // fontFamily: 'BarlowCondensed-Regular',
          },
          headerTitleContainerStyle: {
            paddingHorizontal: 42,
          },
          gestureResponseDistance: {
            horizontal: 25,
          },
        }}
      >
        {screens}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
