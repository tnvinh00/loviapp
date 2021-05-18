import React, { useContext, useState } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { View, Text, TouchableOpacity, Image, Platform, StyleSheet, ScrollView, Button, SafeAreaView, Keyboard } from 'react-native';

import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import SocialButton from '../components/SocialButton';
import { AuthContext } from '../navigation/AuthProvider'

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { login, googleLogin } = useContext(AuthContext);

    const handleLogin = (email, password) => {
        if (email == '' || password == '')
            return setError('Vui lòng nhập đầy đủ')
        else {
            login(email, password);
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView>
                <TouchableOpacity></TouchableOpacity>
                <>
                    <View style={styles.container}>
                        <Image
                            source={require('../assets/rn-social-logo.png')}
                            style={styles.logo}
                        />
                        <Text style={styles.text}>Lovi ChatApp</Text>
                        <FormInput
                            labelValue={email}
                            onChangeText={(userEmail) => { setEmail(userEmail), setError('') }}
                            placeholderText="Email"
                            iconType="user"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />

                        <FormInput
                            labelValue={password}
                            onChangeText={(userPassword) => { setPassword(userPassword), setError('') }}
                            placeholderText="Mật khẩu"
                            iconType="lock"
                            secureTextEntry={true}
                        />

                        {error != '' ? (
                            <Text style={styles.color_textPrivate, { color: '#e88832', marginVertical: 10 }}>
                                {error}
                            </Text>
                        ) : null}

                        <FormButton
                            buttonTitle="Đăng nhập"
                            onPress={() => handleLogin(email, password)}
                        />

                        <TouchableOpacity style={styles.forgotButton} onPress={() => navigation.navigate('Forgot')}>
                            <Text style={styles.navButtonText}>Quên mật khẩu?</Text>
                        </TouchableOpacity>

                        {Platform.OS === 'android' ? (
                            <View>
                                <SocialButton
                                    buttonTitle="Đăng nhập bằng Facebook"
                                    btnType="facebook"
                                    color="#4867aa"
                                    backgroundColor="#e6eaf4"
                                    onPress={() => fbLogin()}
                                />

                                <SocialButton
                                    buttonTitle="Đăng nhập bằng Google"
                                    btnType="google"
                                    color="#de4d41"
                                    backgroundColor="#f5e7ea"
                                    onPress={() => googleLogin()}
                                />
                            </View>
                        ) : null}

                        <TouchableOpacity
                            style={styles.forgotButton}
                            onPress={() => navigation.navigate('Signup')}>
                            <Text style={styles.navButtonText}>
                                Chưa có tài khoản? Đăng ký
                        </Text>
                        </TouchableOpacity>
                    </View>
                </>
            </ScrollView>
        </SafeAreaView>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        paddingTop: 50
    },
    logo: {
        height: 120,
        width: 120,
        resizeMode: 'cover',
    },
    text: {
        fontFamily: 'Kufam-SemiBoldItalic',
        fontSize: 25,
        marginBottom: 10,
        color: '#051d5f',
    },
    navButton: {
        marginTop: 15,
    },
    forgotButton: {
        marginVertical: 25,
    },
    navButtonText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#2e64e5',
        fontFamily: 'Lato-Regular',
    },
    textPrivate: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 25,
        justifyContent: 'center',
    },
});
