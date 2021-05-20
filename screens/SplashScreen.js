import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LottieView from 'lottie-react-native';


const SplashScreen = ({ navigation }) => {
    return (
        <View style={{ flex: 1, backgroundColor: '#F6E8D8'}}>
            <Image style={styles.logo} source={require('../assets/lovi-logo.png')}/>
            <LottieView
                source={require('../assets/splash/chat-love-me.json')}
                autoPlay
                loop={false}
                marginTop={-80}
                speed={0.8}
            />

        </View>
    );
}

export default SplashScreen;

const styles = StyleSheet.create({
    logo: {
        alignSelf: 'center',
        marginTop: 50,
        resizeMode: 'cover',
        height: 100,
        width: 210,
    },
});