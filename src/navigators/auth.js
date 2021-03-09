import React from 'react';

import { Screen } from 'navigators/stack';
import LoginScreen from 'screens/login';
// import ConfigureAccount from 'screens/configureAccount';
// import { withToasts } from 'components/toast';

export default (
  <>
    <Screen
      name="Login"
      component={LoginScreen} //withToasts(LoginScreen, true)}
      options={{ headerShown: false }}
    />
    {/* <Screen
      name="Configure"
      component={ConfigureAccount}
      options={{ title: 'Configure Account' }}
    /> */}
  </>
);
