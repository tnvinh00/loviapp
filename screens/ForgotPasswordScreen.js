import React, { useContext, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Platform, StyleSheet, SafeAreaView, KeyboardAvoidingView, ScrollView, Keyboard } from 'react-native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import SocialButton from '../components/SocialButton';

import { AuthContext } from '../navigation/AuthProvider'

const ForgotPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');

    const { forgotpassword } = useContext(AuthContext);

    const handleForgot = (email) => {
        if (email == '')
            return setError('Vui lòng nhập Email')
        else {
            forgotpassword(email);
            return setError('Đã gửi mail, vui lòng kiểm tra mail')
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView keyboardShouldPersistTaps='handled'>
                <View style={styles.container}>
                    <Text style={styles.text}>Quên mật khẩu</Text>
                    <Image
                        source={require('../assets/rn-social-logo.png')}
                        style={styles.logo}
                    />
                    <View style={styles.textPrivate}>
                        <Text style={styles.color_textPrivate}>
                            Nhập email của bạn, chúng tôi sẽ gửi mail để nhập lại mật khẩu{' '}
                        </Text>
                    </View>
                    <FormInput
                        labelValue={email}
                        onChangeText={(userEmail) => { setEmail(userEmail), setError('') }}
                        placeholderText="Email"
                        iconType="user"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    {error != '' ? (
                        <Text style={styles.color_textPrivate, { color: '#e88832', marginVertical: 10 }}>
                            {error}
                        </Text>
                    ) : null}

                    <FormButton
                        buttonTitle="Xác nhận"
                        onPress={() => handleForgot(email)}
                    />
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity
                            style={styles.navButton}
                            onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.navButtonText}>Đăng nhập</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.navButton}
                            onPress={() => navigation.navigate('Signup')}>
                            <Text style={styles.navButtonText}>Đăng ký</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f9fafd',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    logo: {
        height: 150,
        width: 150,
        resizeMode: 'cover',
    },
    text: {
        fontFamily: 'Kufam-SemiBoldItalic',
        fontSize: 28,
        marginBottom: 10,
        color: '#051d5f',
    },
    navButton: {
        marginTop: 40,
        marginHorizontal: 30,
    },
    navButtonText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#2e64e5',
        fontFamily: 'Lato-Regular',
        textDecorationLine: 'underline',
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
