import React, { useContext, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import InternetConnectionAlert from "react-native-internet-connection-alert";

import auth from '@react-native-firebase/auth';
import { AuthContext } from './AuthProvider'

import AuthStack from './AuthStack';
import AppStack from './AppStack';

const Routes = () => {
    const { user, setUser } = useContext(AuthContext);
    const [initializing, setInitializing] = useState(true);

    function onAuthStateChanged(user) {
        setUser(user);
        if (initializing)
            setInitializing(false);
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    if (initializing) return null;

    return (
        <NavigationContainer>
            <InternetConnectionAlert
                title="❕ Mất kết nối mạng"
                message='Ứng dụng có thể bị sai, kiểm tra kết nối mạng và thử lại'
            >
                {user ? <AppStack /> : < AuthStack />}
            </InternetConnectionAlert>
        </NavigationContainer>
    );
};

export default Routes;
