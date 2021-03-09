import React, { useState, useLayoutEffect, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  Image,
  Platform,
  ImageBackground,
  TouchableOpacity,
  Text,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector, useDispatch } from 'react-redux';
import { get } from 'lodash';
import call from 'react-native-phone-call';

import Button from 'components/button';
import Colors from 'styles/colors';
import Icon from 'components/icon';
import version from 'version';
import toast from 'components/toast';
import { login } from 'actions/user';
import { setDisplayFlow } from 'actions/prefs';
import { getOptions } from 'actions/options';

export default function Login({ navigation }) {
  const user = useSelector(state => state.user);
  const notification = useSelector(state => state.notification);
  const dispatch = useDispatch();

  const [username, setUsername] = useState(get(user, 'username', ''));
  const [password, setPassword] = useState('');
  const [instance, setInstance] = useState(get(user, 'instance', ''));

  const usernameField = useRef(null);
  const passwordField = useRef(null);
  const instanceField = useRef(null);

  //This is a hack to set font style on android when secureTextEntry is set.
  useEffect(() => {
    passwordField.current.setNativeProps({
      fontFamily: 'Barlow',
    });
  }, []);

  useLayoutEffect(() => {
    if (user.token) {
      dispatch(getOptions());
      navigation.navigate('Main');
    }
  }, [user, dispatch, navigation]);

  async function handleLogin() {
    let message;
    if (!username) {
      message = 'Please enter a valid username';
    } else if (!password) {
      message = 'Please enter your password';
    } else if (!instance) {
      message =
        'Please enter your omadi instance (e.g. https://<instance>.omadi.com)';
    }
    if (message) {
      toast(message, 'warning');
      return;
    }
    // display login flow after login.
    dispatch(setDisplayFlow(true));
    try {
      const error = await dispatch(
        login({
          username,
          password,
          instance,
          deviceToken: notification.deviceToken,
          deviceOs: Platform.OS,
          deviceMode: process.env.NODE_ENV,
        })
      );
      if (error) {
        if (
          error.message ===
          'Your user account is currently blocked from logging into mobile.'
        ) {
          toast('Your user account is currently blocked', 'danger');
        } else if (error.message === 'Access denied for user anonymous') {
          toast(
            'Invalid username, password, or instance combination...',
            'danger'
          );
        } else if (error.status === 403) {
          navigation.push('Configure');
        } else {
          toast(`${error.message} ${error.status || ''}`, 'danger');
        }
      }
    } catch (error) {
      toast(
        "The username or password you entered didn't match our records.",
        'danger'
      );
    }
  }

  function focusPassword() {
    passwordField.current.focus();
  }

  function focusInstance() {
    instanceField.current.focus();
  }

  function handleCallCustomer() {
    const callArgs = {
      number: '8018008250',
      prompt: true,
    };
    call(callArgs);
  }

  return (
    <ImageBackground
      source={require('../img/torch_bg.png')}
      style={styles.container}
      resizeMode="stretch"
    >
      <KeyboardAwareScrollView
        enableOnAndroid
        extraHeight={15}
        extraScrollHeight={5}
        alwaysBounceVertical={false}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        testID={'loginView'}
      >
        <View style={styles.center}>
          <Image
            source={require('../img/omadi.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.textView}>
            <Text style={styles.textOutput}>LOGIN</Text>
          </View>
          <View style={styles.inputContainer}>
            <Icon name="account" size={25} style={styles.inputIcon} />
            <TextInput
              testID={'username-input'}
              autoCorrect={false}
              autoCapitalize="none"
              ref={usernameField}
              onSubmitEditing={focusPassword}
              returnKeyType="next"
              className="username-input"
              style={styles.textInput}
              placeholder="username"
              placeholderTextColor={Colors.uiDark4}
              accessibilityLabel="enter-username-label"
              underlineColorAndroid="transparent"
              keyboardType="email-address"
              onChangeText={setUsername}
              value={username}
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="key" style={styles.inputIcon} />
            <TextInput
              testID={'password-input'}
              autoCorrect={false}
              autoCapitalize="none"
              ref={passwordField}
              onSubmitEditing={focusInstance}
              className="password-input"
              returnKeyType="next"
              style={styles.textInput}
              placeholder="password"
              placeholderTextColor={Colors.uiDark4}
              accessibilityLabel="enter-password-label"
              underlineColorAndroid="transparent"
              secureTextEntry
              onChangeText={setPassword}
              value={password}
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="cloud" size={25} style={styles.inputIcon} />
            <TextInput
              testID={'instance-input'}
              autoCorrect={false}
              autoCapitalize="none"
              ref={instanceField}
              onSubmitEditing={handleLogin}
              returnKeyType="done"
              className="instance-input"
              style={styles.textInput}
              accessibilityLabel="enter-instance-label"
              underlineColorAndroid="transparent"
              placeholder="account name"
              placeholderTextColor={Colors.uiDark4}
              onChangeText={setInstance}
              value={instance}
            />
          </View>

          <Button
            testID={'login-button'}
            title="Log In"
            onPress={handleLogin}
            big
            style={styles.loginButton}
            loading={user.loggingIn}
            accessibilityLabel="login-button"
          />
        </View>
      </KeyboardAwareScrollView>
      <View style={styles.callView}>
        <Text style={styles.help}>Need Help?</Text>
        <TouchableOpacity onPress={handleCallCustomer}>
          <Text style={styles.phone}>Call Us (801) 800-8250</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.version}>{version}</Text>
    </ImageBackground>
  );
}

const width = '85%';
const height = 48;

const styles = {
  container: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
  },
  callView: {
    flex: 0.3,
    alignItems: 'center',
    paddingBottom: 22,
  },
  help: { color: 'white', fontFamily: 'Barlow', fontSize: 16 },
  phone: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Barlow',
    paddingTop: 10,
  },
  center: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: -25,
  },
  version: {
    color: Colors.white,
    fontStyle: 'italic',
    position: 'relative',
    alignSelf: 'center',
    bottom: 22,
  },
  logo: {
    tintColor: Colors.white,
    height: 160,
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
  },
  inputIcon: {
    position: 'absolute',
    top: 19,
    left: 13,
    color: Colors.blue8,
    backgroundColor: 'transparent',
    fontSize: 20,
    zIndex: 1,
  },
  textView: {
    paddingBottom: 8,
    width,
  },
  textOutput: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.white,
  },
  textInput: {
    fontFamily: 'Barlow',
    fontSize: 20,
    padding: 10,
    paddingLeft: 35,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.uiLight4,
    borderRadius: 6,
    margin: 5,
    width,
    height,
    color: 'black',
  },
  loginButton: {
    marginTop: 20,
    width,
  },
};
