import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

import LottieView from 'lottie-react-native';
import Onboarding from 'react-native-onboarding-swiper';


const Dots = ({ selected }) => {
    let backgroundColor;

    backgroundColor = selected ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.3)';

    return (
        <View
            style={{
                width: 6,
                height: 6,
                marginHorizontal: 3,
                borderRadius: 20,
                backgroundColor
            }}
        />
    );
}

const Skip = ({ ...props }) => (
    <TouchableOpacity
        style={{ marginHorizontal: 10 }}
        {...props}
    >
        <Text style={{ fontSize: 16 }}>Bỏ qua</Text>
    </TouchableOpacity>
);

const Next = ({ ...props }) => (
    <TouchableOpacity
        style={{ marginHorizontal: 10 }}
        {...props}
    >
        <Text style={{ fontSize: 16 }}>Tiếp theo</Text>
    </TouchableOpacity>
);

const Done = ({ ...props }) => (
    <TouchableOpacity
        style={{ marginHorizontal: 10 }}
        {...props}
    >
        <Text style={{ fontSize: 16 }}>Xong</Text>
    </TouchableOpacity>
);

const OnboardingScreen = ({ navigation }) => {
    return (
        <Onboarding
            SkipButtonComponent={Skip}
            NextButtonComponent={Next}
            DoneButtonComponent={Done}
            DotComponent={Dots}
            onSkip={() => navigation.replace("Splash2")}
            onDone={() => navigation.navigate("Login")}
            pages={[
                {
                    backgroundColor: '#a6e4d0',
                    image: <LottieView style={{ height: 300 }} source={require('../assets/splash/30786-online-chat.json')} autoPlay speed={0.6} />,
                    title: 'Chào mừng đến với Lovi App',
                    subtitle: 'Ứng dụng nhắn tin kết nối mọi người với nhau',
                },
                {
                    backgroundColor: '#fdeb93',
                    image: <LottieView style={{ height: 300 }} source={require('../assets/splash/50121-scrolling.json')} autoPlay speed={0.6} />,
                    title: 'Chia sẻ bài viết với mọi người',
                    subtitle: 'Nhấn yêu thích, theo dõi người bạn thích',
                },
                {
                    backgroundColor: '#e9bcbe',
                    image: <LottieView style={{ height: 350 }} source={require('../assets/splash/56091-people-reading-news-on-phone.json')} autoPlay speed={0.8} />,
                    title: 'Nhắn tin cho bạn bè ở mọi nơi',
                    subtitle: "Đăng nhập tài khoản và khám phá ngay nào!",
                },
            ]}
        />
    );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
});
