import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet, SafeAreaView, KeyboardAvoidingView, Keyboard, ScrollView } from 'react-native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import SocialButton from '../components/SocialButton';

import { AuthContext } from '../navigation/AuthProvider'

const SignupScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const { register } = useContext(AuthContext);

    const handleLogin = (email, password) => {
        setError('')
        if (email == '' || password == '' || confirmPassword == '')
            return setError('Vui lòng nhập đầy đủ')
        else if (error == '') {
            register(email, password);
        }
        else {
            return setError('Vui lòng thử lại')
        }
    }

    const handleValidation = (confirm) => {
        if (password != confirm)
            setError('2 mật khẩu chưa đồng nhất')
        else if (password == confirm)
            setError('')
    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView>
                <TouchableOpacity></TouchableOpacity>
                <>
                    <View style={styles.container}>
                        <Text style={styles.text}>Tạo tài khoản</Text>

                        <FormInput
                            labelValue={email}
                            onChangeText={(userEmail) => { setEmail(userEmail) }}
                            placeholderText="Email"
                            iconType="user"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />

                        <FormInput
                            labelValue={password}
                            onChangeText={(userPassword) => { setPassword(userPassword) }}
                            placeholderText="Mật khẩu"
                            iconType="lock"
                            secureTextEntry={true}
                        />

                        <FormInput
                            labelValue={confirmPassword}
                            onChangeText={(userPassword) => { setConfirmPassword(userPassword); handleValidation(userPassword) }}
                            placeholderText="Xác nhận mật khẩu"
                            iconType="lock"
                            secureTextEntry={true}
                        />
                        {error != '' ? (
                            <Text style={styles.color_textPrivate, { color: '#e88832', marginVertical: 10 }}>
                                {error}
                            </Text>
                        ) : null}

                        <FormButton
                            buttonTitle="Đăng ký"
                            onPress={() => handleLogin(email, password)}
                        />

                        <View style={styles.textPrivate}>
                            <Text style={styles.color_textPrivate}>
                                Khi đăng ký tài khoản, bạn xác nhận đồng ý với{' '}
                            </Text>
                            <TouchableOpacity onPress={() => alert('Terms Clicked!')}>
                                <Text style={[styles.color_textPrivate, { color: '#e88832' }]}>
                                    Điều khoản dịch vụ
                                </Text>
                            </TouchableOpacity>
                            <Text style={styles.color_textPrivate}> và </Text>
                            <Text style={[styles.color_textPrivate, { color: '#e88832' }]}>
                                Chính sách riêng tư
	                            <Text style={styles.color_textPrivate}> của chúng tôi </Text>
                            </Text>
                        </View>

                        {Platform.OS === 'android' ? (
                            <View>
                                <SocialButton
                                    buttonTitle="Đăng ký bằng Facebook"
                                    btnType="facebook"
                                    color="#4867aa"
                                    backgroundColor="#e6eaf4"
                                    onPress={() => { }}
                                />

                                <SocialButton
                                    buttonTitle="Đăng ký bằng Google"
                                    btnType="google"
                                    color="#de4d41"
                                    backgroundColor="#f5e7ea"
                                    onPress={() => { }}
                                />
                            </View>
                        ) : null}

                        <TouchableOpacity
                            style={styles.navButton}
                            onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.navButtonText}>Đã có tài khoản? Đăng nhập</Text>
                        </TouchableOpacity>
                    </View>
                </>
            </ScrollView>

        </SafeAreaView>

    );
};

export default SignupScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f9fafd',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    text: {
        fontFamily: 'Kufam-SemiBoldItalic',
        fontSize: 28,
        marginBottom: 10,
        color: '#051d5f',
    },
    navButton: {
        marginTop: 15,
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
    color_textPrivate: {
        fontSize: 13,
        fontWeight: '400',
        fontFamily: 'Lato-Regular',
        color: 'grey',
    },
});
