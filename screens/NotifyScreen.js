import React, { useState, useEffect, useContext } from 'react';
import { View, Image, Alert, StyleSheet, SafeAreaView, Platform, Text, KeyboardAvoidingView, ScrollView, TextInput, TouchableOpacity, RefreshControl, ToastAndroid } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../navigation/AuthProvider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StatusWrapper } from '../styles/AddPost';
import LottieView from 'lottie-react-native';
import NotifyCard from '../components/NotifyCard';
import PostCard from '../components/PostCard';
import { windowWidth } from '../utils/Dimentions.js'

const NotifyScreen = ({ navigation }) => {
    const { user } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleted, setDeleted] = useState(false);

    const getNotify = async () => {
        setNotifications([]);
        const list = [];

        await firestore()
            .collection('USERS')
            .doc(user.uid)
            .collection('NOTIFICATIONS')
            .orderBy('createdAt', 'desc')
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    list.push({
                        id: doc.id,
                        data: doc.data(),
                    });
                });
            });
        setNotifications(list);

        setLoading(false);
    }

    const deleteNotify = (NotifyId) => {
        firestore()
            .collection('USERS')
            .doc(user.uid)
            .collection('NOTIFICATIONS')
            .doc(NotifyId)
            .delete()
            .then(() => {
                ToastAndroid.showWithGravity('Xóa thành công', ToastAndroid.LONG, ToastAndroid.CENTER);
                setDeleted(true);
            })
            .catch((e) => {
                ToastAndroid.showWithGravity('Đã có lỗi, thử lại sau', ToastAndroid.LONG, ToastAndroid.CENTER);
            });
    }

    const handleDelete = (NotifyId) => {
        Alert.alert(
            'Xóa thông báo',
            'Bạn có chắc chắn muốn xóa thông báo này không?',
            [
                {
                    text: 'Hủy',
                    onPress: () => console.log('Cancel Pressed!'),
                    style: 'cancel',
                },
                {
                    text: 'Xóa',
                    onPress: () => deleteNotify(NotifyId),
                },
            ],
            { cancelable: false },
        );
    }

    const handleDeleteAll = () => {
        Alert.alert(
            'Xóa tất cả thông báo',
            'Bạn có chắc chắn muốn xóa tất cả thông báo?',
            [
                {
                    text: 'Hủy',
                    onPress: () => console.log('Cancel Pressed!'),
                    style: 'cancel',
                },
                {
                    text: 'Xóa',
                    onPress: () => deleteAll(),
                },
            ],
            { cancelable: false },
        );
    }

    const deleteAll = () => {
        notifications.forEach(async (item) => {
            await firestore()
                .collection('USERS')
                .doc(user.uid)
                .collection('NOTIFICATIONS')
                .doc(item.id)
                .delete();
        });
        firestore()
            .collection('USERS')
            .doc(user.uid)
            .update({
                notify: 0,
            })
        setDeleted(true);
        ToastAndroid.showWithGravity('Đã xóa tất cả thông báo', ToastAndroid.LONG, ToastAndroid.CENTER);
    }

    const handleReadAll = () => {
        Alert.alert(
            'Đánh dấu tất cả là đã đọc',
            'Bạn có chắc chắn muốn thực hiện thao tác này?',
            [
                {
                    text: 'Hủy',
                    onPress: () => console.log('Cancel Pressed!'),
                    style: 'cancel',
                },
                {
                    text: 'Đồng ý',
                    onPress: () => firestore()
                        .collection('USERS')
                        .doc(user.uid)
                        .update({
                            notify: 0,
                        })
                        .then(() => {
                            ToastAndroid.showWithGravity("Đã đánh dấu là đọc tất cả", ToastAndroid.LONG, ToastAndroid.CENTER);
                        })
                        .catch((e) => {
                            ToastAndroid.showWithGravity('Đã có lỗi, thử lại sau', ToastAndroid.LONG, ToastAndroid.CENTER);
                        }),
                },
            ],
            { cancelable: false },
        );
    }

    useEffect(() => {
        getNotify();
        setDeleted(false);
    }, [deleted]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 5, paddingTop: 5 }}>
            <ScrollView keyboardShouldPersistTaps='handled'
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={() => { getNotify() }}
                    />}
                showsVerticalScrollIndicator={false}
            >
                {loading ? (
                    <StatusWrapper>
                        <LottieView style={{ height: 200 }} source={require('../assets/splash/65210-loading-colour-dots.json')} autoPlay speed={0.8} />
                    </StatusWrapper>
                ) : null}

                {notifications.length > 0 ? notifications.map((item) => (
                    <NotifyCard key={item.id}
                        item={item}
                        onDelete={handleDelete}
                        navigation={navigation}
                    />
                )) : (
                    <Text style={styles.text1}>Bạn không có thông báo nào</Text>
                )}
            </ScrollView>
            <View style={styles.footer}>
                <View style={styles.footerinfo}>
                    <TouchableOpacity style={styles.button1} onPress={handleReadAll}>
                        <Ionicons name="checkmark-done-circle" size={22} color="#4867aa"></Ionicons>
                        <Text style={styles.text1}>Đánh dấu tất cả đã đọc</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button2} onPress={handleDeleteAll}>
                        <Ionicons name="close-circle" size={22} color="#de4d41"></Ionicons>
                        <Text style={styles.text2}>Xóa tất cả thông báo</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

export default NotifyScreen;

const styles = StyleSheet.create({
    footer: {
        width: windowWidth,
        marginLeft: -5,
        marginBottom: 5,
    },
    footerinfo: {
        bottom: 0,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    text1: {
        fontSize: 14,
        marginLeft: 5,
        alignSelf: 'center',
        fontWeight: 'bold',
        fontFamily: 'Lato-Regular',
        color: "#4867aa",
    },
    text2: {
        fontSize: 14,
        marginLeft: 5,
        alignSelf: 'center',
        fontWeight: 'bold',
        fontFamily: 'Lato-Regular',
        color: "#de4d41",
    },
    button1: {
        flexDirection: 'row',
        alignSelf: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: "#e6eaf4",
        borderRadius: 10,
    },
    button2: {
        flexDirection: 'row',
        alignSelf: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
        color: "#4867aa",
        backgroundColor: "#f5e7ea",
        borderRadius: 10,
    },
});