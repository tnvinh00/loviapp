import React, { useContext, useEffect, useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ToastAndroid, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import FormButton from '../components/FormButton';

import { AuthContext } from '../navigation/AuthProvider';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Container, UserImg, UserInfo, UserInfoText, UserName } from '../styles/MessageStyles';
import firestore from '@react-native-firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Bubble, GiftedChat, Send } from 'react-native-gifted-chat';

import dayjs from 'dayjs';
import 'dayjs/locale/vi'

const ChatScreen = ({ navigation, route }) => {
    const { user, logout } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const getUser = () => {
        const currentUser = firestore()
            .collection('USERS')
            .doc(route.params.userId)
            .get()
            .then((documentSnapshot) => {
                if (documentSnapshot.exists) {
                    // console.log('User Data', documentSnapshot.data());
                    setUserData(documentSnapshot.data());
                    setHeader();
                    fetchMessage();
                    setLoading(false);
                }
            })
            .catch((e) => {
                console.log(e);
            })
    }

    const setHeader = () => {
        navigation.setOptions({
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: '#f6f6f6',
                shadowColor: '#f6f6f6',
                elevation: 0,
            },
            title: '',
            headerLeft: () => (
                <View style={{ marginLeft: 20, flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={25} color="#2e64e5" />
                    </TouchableOpacity>
                    <UserInfo style={{ flex: 2, justifyContent: 'center', alignItems: 'center', marginLeft: 10 }}>
                        <TouchableOpacity>
                            <UserImg source={{ uri: userData ? userData.userImg : 'https://firebasestorage.googleapis.com/v0/b/lovi-fdfca.appspot.com/o/users%2Fuser.png?alt=media&token=9703fb4a-830b-4f37-9ee2-d4f2e8059178' }} style={{ width: 40, height: 40, marginLeft: 10 }} />
                        </TouchableOpacity>
                        <UserInfoText>
                            <TouchableOpacity style={{ marginTop: 10, marginLeft: 5 }}>
                                <UserName style={{ fontSize: 18, marginLeft: 10 }}>{userData ? userData.name : ''}</UserName>
                            </TouchableOpacity>
                        </UserInfoText>
                    </UserInfo>
                </View>
            ),
        });
    };

    useEffect(() => {
        getUser();
    }, [loading]);

    const fetchMessage = () => {
        firestore()
            .collection('MESSAGETHREADS')
            .doc(route.params.threadId)
            .collection('MESSAGE')
            .orderBy('createdAt', 'desc')
            .onSnapshot(querySnapshot => {
                const messages = querySnapshot.docs.map(doc => {
                    const { createdAt, text, uid } = doc.data();
                    return {
                        _id: doc.id,
                        text: text,
                        createdAt: createdAt.toDate(),
                        user: {
                            _id: uid,
                            name: userData ? userData.name : '...',
                            avatar: userData ? userData.userImg : 'https://firebasestorage.googleapis.com/v0/b/lovi-fdfca.appspot.com/o/users%2Fuser.png?alt=media&token=9703fb4a-830b-4f37-9ee2-d4f2e8059178'
                        }
                    }
                })
                // console.log(messages);
                setMessages(messages);
            })
    }

    useEffect(() => {
        fetchMessage();
    }, []);

    const [messages, setMessages] = useState([]);

    const handleSend = async (messages) => {
        const text = messages[0].text;
        firestore()
            .collection('MESSAGETHREADS')
            .doc(route.params.threadId)
            .collection('MESSAGE')
            .add({
                text: text,
                createdAt: new Date(),
                uid: user.uid,
            })
            .then(() => {
                console.log('Đã tạo message')
            })
        await firestore()
            .collection('MESSAGETHREADS')
            .doc(route.params.threadId)
            .update(
                {
                    latestMessage: {
                        text: text,
                        createdAt: new Date(),
                        uid: user.uid,
                    }
                },
            )
            .then(() => {
                console.log('Đã gửi tin nhắn')
                // ToastAndroid.show("Đã gửi tin nhắn", ToastAndroid.LONG);
            })
    }

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
        console.log(messages);
    }, [])

    const renderSend = (props) => {
        return (
            <Send {...props}>
                <View>
                    <MaterialCommunityIcons
                        name="send-circle"
                        style={{ marginBottom: 0, marginRight: 10 }}
                        size={43}
                        color="#2e64e5"
                    />
                </View>
            </Send>
        );
    };


    const renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#2e64e5',
                    },
                }}
                textStyle={{
                    right: {
                        color: '#fff',
                    },
                }}
            />
        );
    };

    const scrollToBottomComponent = () => {
        return (
            <FontAwesome name='angle-double-down' size={22} color='#333' />
        );
    }

    return (
        <View style={{ flex: 1 }}>
            {userData ? (
                <GiftedChat
                    messages={messages}
                    onSend={(messages) => handleSend(messages)}
                    user={{
                        _id: user.uid,
                    }}
                    renderBubble={renderBubble}
                    alwaysShowSend
                    renderSend={renderSend}
                    scrollToBottom
                    placeholder={'Nhập tin nhắn'}
                    locale={'vi'}
                    // showUserAvatar={true}
                    keyboardShouldPersistTaps={'never'}
                    scrollToBottomComponent={scrollToBottomComponent}
                />
            ) : (
                <ActivityIndicator size="large" color="#0000ff" />
            )}


        </View>

    );
};

export default ChatScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f9fafd',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    text: {
        fontSize: 20,
        color: '#333333'
    }
});