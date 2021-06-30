/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react';
import Providers from './navigation';
import messaging from '@react-native-firebase/messaging';

const App = () => {
    const getToken = async () => {
        try {
            const token = await messaging().getToken();
        console.log(token);
        } catch (error) {
            console.log(error);
        }
    } 

    useEffect(() => {
        getToken();
        messaging().onMessage(async remoteMessage => {
            console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
        });
        messaging().onNotificationOpenedApp(remoteMessage => {
            console.log('Notification caused app to open from background state:', JSON.stringify(remoteMessage));
        });
        messaging()
            .getInitialNotification()
            .then(remoteMessage => {
                if (remoteMessage) {
                    console.log('Notification caused app to open from quit state:', JSON.stringify(remoteMessage));
                }
            })
            .catch((e) => console.log(e));
    }, []);
    return <Providers />;
};



export default App;
