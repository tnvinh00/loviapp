import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LottieView from 'lottie-react-native';


const SplashScreen = ({ navigation }) => {
    return (
        <View style={{ flex: 1, backgroundColor: '#F6E8D8'}}>
            <LottieView
                source={require('../assets/splash/chat-love-me.json')}
                autoPlay
                loop={false}
                marginTop={-135}
                speed={0.8}
                onAnimationFinish={() => {
                    navigation.navigate('Login');
                }}
            />

        </View>
    );
}

export default SplashScreen;

const styles = StyleSheet.create({
    logo: {
        alignSelf: 'center',
        marginTop: 100,
        height: 150,
        width: 150,
    },
});