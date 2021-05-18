import React, { useContext, useEffect, useCallback, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ToastAndroid } from 'react-native';

import { AuthContext } from '../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Container } from '../styles/MessageStyles';
import { InputField } from '../styles/AddPost';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';


const AddNewMessageScreen = ({ navigation, route }) => {
    const { user, logout } = useContext(AuthContext);
    const [uid, setUid] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loading2, setLoading2] = useState(true);
    const [messages, setMessages] = useState(null);
    const [check, setCheck] = useState(null); //1 if exsited message
    const [checkuid, setCheckuid] = useState(false); //true if user exsit
    const [edit, setEdit] = useState(true); //false (can't edit) if route not null
    const [threadId, setThreadId] = useState(null);

    useEffect(() => {
        if (route.params) {
            setUid(route.params.uid);
            setEdit(false);
            checkThread(uid);
            checkUser(uid);
        }
    }, [loading2, loading])

    const checkUser = async (uid) => {
        const currentUser = await firestore()
            .collection('USERS')
            .doc(uid)
            .get()
            .then((documentSnapshot) => {
                if (documentSnapshot.exists) {
                    //console.log('User Data', documentSnapshot.data());
                    console.log('Co User')
                    setCheckuid(true)
                }
                else
                    setCheckuid(false)
                setLoading(false);
            })
            .catch((e) => {
                console.log(e);
            })
    }

    const checkThread = async (uid) => {
        var check = 0;
        await firestore()
            .collection('MESSAGETHREADS')
            .where('users.id1', '==', uid)
            .where('users.id2', '==', user.uid)
            .get()
            .then(querySnapshot => {
                if (querySnapshot.size > 0) {
                    check = check + 1;
                    querySnapshot.forEach(documentSnapshot => {
                        //console.log(documentSnapshot.data(), documentSnapshot.id);
                        setThreadId(documentSnapshot.id);
                    });
                }

                // console.log('Total 1: ', querySnapshot.size);
            })

        await firestore()
            .collection('MESSAGETHREADS')
            .where('users.id2', '==', uid)
            .where('users.id1', '==', user.uid)
            .get()
            .then(querySnapshot => {
                if (querySnapshot.size > 0) {
                    check = check + 1;
                    querySnapshot.forEach(documentSnapshot => {
                        // console.log(documentSnapshot.data(), documentSnapshot.id);
                        setThreadId(documentSnapshot.id);
                    });
                }
                // console.log('Total 2: ', querySnapshot.size);
            })
        console.log('Total: ' + check + ' thread')
        console.log('Thread: ' + threadId)

        setLoading2(false);
        setCheck(check);
    }

    const handleSend = async (uid) => {
        checkUser(uid);
        if (!checkuid) {
            ToastAndroid.show("Người dùng không tồn tại, thử lại", ToastAndroid.LONG);
        }
        else if (uid == user.uid) {
            ToastAndroid.show("Bạn không thể nhắn tin cho chính mình", ToastAndroid.LONG);
        }
        else {
            if (check == 0) {
                console.log("Thêm mới");
                await firestore()
                    .collection('MESSAGETHREADS')
                    .add({
                        latestMessage: {
                            text: messages,
                            createdAt: new Date(),
                            uid: user.uid,
                        },
                        users: {
                            id1: user.uid,
                            id2: uid,
                        }
                    })
                    .then(docRef => {
                        docRef.collection('MESSAGE')
                            .add({
                                text: messages,
                                createdAt: new Date(),
                                uid: user.uid,
                            })
                        console.log("Đã tạo mới tin nhắn");
                        ToastAndroid.show("Đã tạo tin nhắn mới", ToastAndroid.LONG);
                        setCheck(true);
                        setUid(null);
                        setMessages(null)
                    })
                    .catch((e) => {
                        console.log(e);
                    })
            }
            else {
                console.log('Tin nhắn đã có')
                if (threadId != null) {
                    await firestore()
                        .collection('MESSAGETHREADS')
                        .doc(threadId)
                        .update(
                            {
                                latestMessage: {
                                    text: messages,
                                    createdAt: new Date(),
                                    uid: user.uid,
                                }
                            },
                        )
                        .then(() => {
                            setUid(null);
                            setMessages(null)
                            console.log('Đã thêm 1 latestmessage')
                        })
                        .catch((e) => {
                            console.log(e);
                        })
                    await firestore()
                        .collection('MESSAGETHREADS')
                        .doc(threadId)
                        .collection('MESSAGE')
                        .add({
                            text: messages,
                            createdAt: new Date(),
                            uid: user.uid,
                        })
                        .then(() => {
                            console.log('Đã thêm 1 message')
                            ToastAndroid.show("Đã gửi tin nhắn", ToastAndroid.LONG);
                        })
                    
                }
                else
                    ToastAndroid.show("Thử lại 1 lần nữa", ToastAndroid.LONG);

            }
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <Text style={styles.textPrivate}>Vui lòng nhập chính xác ID người nhận</Text>
                <Text style={styles.textPrivate}>Thử lại nếu báo không tồn tại, ứng dụng bị syda</Text>
                <FormInput
                    labelValue={uid}
                    onChangeText={(uid) => { setUid(uid), checkUser(uid), checkThread(uid) }}
                    placeholderText="ID"
                    iconType="idcard"
                    keyboardType="default"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={edit}
                />
                <FormInput
                    labelValue={messages}
                    onChangeText={(messages) => setMessages(messages)}
                    placeholderText="Tin nhắn"
                    iconType="message1"
                    keyboardType="default"
                    autoCapitalize="none"
                    autoCorrect={false}
                    multiline
                    numberOfLines={4}
                />
                <FormButton
                    buttonTitle="Gửi tin nhắn"
                    onPress={() => { handleSend(uid) }}
                />
            </View>
        </SafeAreaView>

    );
};

export default AddNewMessageScreen;

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
    },
    textPrivate: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 10,
        justifyContent: 'center',
    },
});