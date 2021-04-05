/**
 * @format
 */
 import 'react-native-gesture-handler';
 import {AppRegistry} from 'react-native';
 import App from './App';
 import OnboardingScreen from './screens/OnboardingScreen';
 import LoginScreen from './screens/LoginScreen';
 import {name as appName} from './app.json';
 
 AppRegistry.registerComponent(appName, () => App);