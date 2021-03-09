import React from 'react';
import { StatusBar } from 'react-native';

import { Screen } from 'navigators/stack';
// import { withToasts } from 'components/toast';

import Witness from 'screens/witness';

StatusBar.setBarStyle('light-content');

const screens = [
  {
    name: 'Witness',
    component: Witness,
    options: { title: 'Incident - Witnesses' },
  },
];

export default () =>
  screens
    .map(s => ({
      ...s,
      component: s.component, //withToasts(s.component),
    })) // Wrap all screens w/ toast container
    .map(s => <Screen key={s.name} {...s} />); // Transform into React Navigation screen
