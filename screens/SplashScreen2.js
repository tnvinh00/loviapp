import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LottieView from 'lottie-react-native';


const SplashScreen2 = ({ navigation }) => {
    return (
        <View style={{ flex: 1, backgroundColor: '#F6E8D8', paddingBottom: 140}}>
            <LottieView
                source={require('../assets/splash/Ong-gia-noel.json')}
                autoPlay
                loop={false}
                speed={1.0}
                onAnimationFinish={() => {
                    navigation.navigate('Login');
                }}
            />

        </View>
    );
}

export default SplashScreen2;

const styles = StyleSheet.create({
    logo: {
        alignSelf: 'center',
        marginTop: 100,
        height: 150,
        width: 150,
    },
});