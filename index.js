/**
 * @format
 */
import 'react-native-gesture-handler';
 import React, { Component } from 'react'

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import SplashScreen from './screens/SplashScreen';


class Main extends Component {
    constructor(props) {
        super(props);
        this.state = { current: 'App' }; 
        
        setTimeout(() => {
            this.setState({ current: 'App' })
        }, 2500);


    }
    render() {
        const { current } = this.state;
        let main = current === 'Splash' ? <SplashScreen /> : <App />
        return main;
    }
}

AppRegistry.registerComponent(appName, () => Main);