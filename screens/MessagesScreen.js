import React, { useContext, useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, SafeAreaView } from 'react-native';

import { AuthContext } from '../navigation/AuthProvider';
import { GiftedChat } from 'react-native-gifted-chat'
import firestore from '@react-native-firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Container, Card, UserInfo, UserImgWrapper, UserImg, UserInfoText, UserName, PostTime, MessageText, TextSection } from '../styles/MessageStyles';
import moment from 'moment';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import MessCard from '../components/MessCard';

moment.updateLocale('en', {
    relativeTime: {
        future: "trong %s",
        past: "%s trước",
        s: 'vài giây',
        ss: '%d giây',
        m: "1 phút",
        mm: "%d phút",
        h: "1 giờ",
        hh: "%d giờ",
        d: "1 ngày",
        dd: "%d ngày",
        w: "1 tuần",
        ww: "%d tuần",
        M: "1 tháng",
        MM: "%d tháng",
        y: "1 năm",
        yy: "%d năm"
    }
});

const MessagesScreen = ({ navigation }) => {
    const { user, logout } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true)
    const [loading2, setLoading2] = useState(true)
    const [threads, setThreads] = useState(null)


    const getUser = async () => {
        const currentUser = await firestore()
            .collection('USERS')
            .doc(user.uid)
            .get()
            .then((documentSnapshot) => {
                if (documentSnapshot.exists) {
                    //console.log('User Data', documentSnapshot.data());
                    setUserData(documentSnapshot.data());
                    setHeader();
                    setLoading(false);
                }
            })
            .catch((e) => {
                console.log(e);
            })
    }

    const setHeader = () => {
        navigation.setOptions({
            headerStyle: {
                backgroundColor: '#f6f6f6',
                shadowColor: '#f6f6f6',
                elevation: 0,
            },
            headerLeft: () => (
                <View>
                    {/* { userData ? ( */}
                    <UserInfo style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity>
                            <UserImg source={{ uri: userData ? userData.userImg : 'https://firebasestorage.googleapis.com/v0/b/lovi-fdfca.appspot.com/o/users%2Fuser.png?alt=media&token=9703fb4a-830b-4f37-9ee2-d4f2e8059178' }} style={{ width: 40, height: 40, marginLeft: 10 }} />
                        </TouchableOpacity>
                        <UserInfoText>
                            <TouchableOpacity style={{ marginTop: 10, marginLeft: 5 }}>
                                <UserName style={{ fontSize: 18 }}> Tin nhắn </UserName>
                            </TouchableOpacity>
                        </UserInfoText>
                    </UserInfo>
                    {/* ) : (
                        <SkeletonPlaceholder>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ width: 50, height: 50, borderRadius: 50, marginLeft: 15 }} />
                                <View style={{ marginLeft: 10 }}>
                                    <View style={{ width: 100, height: 20, borderRadius: 4 }} />
                                </View>
                            </View>
                        </SkeletonPlaceholder>
                    )} */}
                </View>
            ),
        });
    };

    useEffect(() => {
        getUser();
    }, [loading]);

    

    const getThread = async () => {
        await firestore()
            .collection('MESSAGETHREADS')
            .orderBy('latestMessage.createdAt', 'desc')
            .onSnapshot(querySnapshot => {
                const list = [];
                querySnapshot.forEach((documentSnapshot) => {
                    const { latestMessage, users } = documentSnapshot.data();
                    if (users.id1 == user.uid) {
                        list.push({
                            id: documentSnapshot.id,
                            latestMessage,
                            userId: users.id2,
                        });
                    }
                    else if (users.id2 == user.uid) {
                        list.push({
                            id: documentSnapshot.id,
                            latestMessage,
                            userId: users.id1,
                        });
                    }
                })

                setThreads(list)
                // console.log(list)
                if (loading2) {
                    setLoading2(false)
                }
            })
    }

    useEffect(() => {
        getThread();
    }, []);

    if (loading2) {
        return <ActivityIndicator size='large' color='#555' />
    }

    const ListHeader = () => {
        return null;
    };


    return (
        <Container>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                    <FlatList
                        data={threads}
                        keyExtractor={(item) => item.id}
                        ListHeaderComponent={ListHeader}
                        ListFooterComponent={ListHeader}
                        onRefresh={() => getThread()}
                        refreshing={false}
                        renderItem={({ item }) => (
                            <MessCard
                                item={item}
                                onPress={() => navigation.navigate('Chat', { userId: item.userId, threadId: item.id })}
                            />
                        )}
                    />
            </SafeAreaView>

        </Container>
    );
}

export default MessagesScreen;

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