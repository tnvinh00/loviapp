import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, ActivityIndicator, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import FormButton from '../components/FormButton';

import { AuthContext } from '../navigation/AuthProvider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { useScrollToTop } from '@react-navigation/native';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

import Toast from 'react-native-toast-message';

import PostCard from '../components/PostCard';
import {
    Container,
    Card,
    UserInfo,
    UserImg,
    UserName,
    UserInfoText,
    PostTime,
    PostText,
    PostImg,
    InteractionWrapper,
    Interaction,
    InteractionText,
    Divider,
    StatusWrapper
} from '../styles/FeedStyles';

const HomeScreen = ({ navigation }) => {
    const { user, logout } = useContext(AuthContext);
    const [posts, setPosts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleted, setDeleted] = useState(false);
    const [notify, setNotify] = useState(0);
    const [onget, setOnget] = useState(true);
    const [username, setUsername] = useState(null);

    const ref = React.useRef(null);
    useScrollToTop(ref);

    const fetchPosts = async () => {
        try {
            const list = [];

            await firestore()
                .collection('POSTS')
                .orderBy('postTime', 'desc')
                .get()
                .then((querySnapshot) => {
                    //console.log('Total Posts: ', querySnapshot.size);
                    querySnapshot.forEach((doc) => {
                        const { userId, post, postImg, postTime, likes, comments } = doc.data();
                        list.push({
                            id: doc.id,
                            userId,
                            userName: '',
                            userImg: '',
                            postTime,
                            post,
                            postImg,
                            liked: true,
                            likes,
                            comments
                        });
                    });
                });
            setPosts(list);
            //posts = list;

            if (loading) {
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleDelete = (postId) => {
        Alert.alert(
            'Xóa bài viết',
            'Bạn có chắc chắn muốn xóa không?',
            [
                {
                    text: 'Hủy',
                    onPress: () => console.log('Cancel Pressed!'),
                    style: 'cancel',
                },
                {
                    text: 'Xóa',
                    onPress: () => deletePost(postId),
                },
            ],
            { cancelable: false },
        );
    };

    const deletePost = (postId) => {
        //console.log(postId);

        firestore()
            .collection('POSTS')
            .doc(postId)
            .get()
            .then(documentSnapshot => {
                if (documentSnapshot.exists) {
                    const { postImg } = documentSnapshot.data();

                    if (postImg != null) {
                        const storageRef = storage().refFromURL(postImg);
                        const imageRef = storage().ref(storageRef.fullPath);

                        imageRef
                            .delete()
                            .then(() => {
                                deleteFirestoreData(postId);
                            })
                            .catch((e) => {
                                console.log(e);
                            });
                    } else
                        deleteFirestoreData(postId);
                    Toast.show({
                        type: 'success',
                        position: 'top',
                        text1: 'Xóa thành công',
                        visibilityTime: 3000,
                        autoHide: true,
                        topOffset: 35,
                        bottomOffset: 40,
                    });
                }
            })
    }

    const deleteFirestoreData = (postId) => {
        firestore()
            .collection('POSTS')
            .doc(postId)
            .delete()
            .then(() => {
                //Alert.alert('Đã xóa');
                setDeleted(true);
            })
            .catch(() => {
                console.log(e);
            })
    }

    const getNotify = async () => {
        await firestore()
            .collection('USERS')
            .doc(user.uid)
            .onSnapshot((documentSnapshot) => {
                if (documentSnapshot.exists){
                    setNotify(documentSnapshot.data().notify);
                    setHeader();
                    setOnget(false);
                }
            })
    }
    const getCurrentUser = async () => {
        const currentUser = await firestore()
            .collection('USERS')
            .doc(user.uid)
            .get()
            .then((documentSnapshot) => {
                if (documentSnapshot.exists) {
                    setUsername(documentSnapshot.data().name);
                }
            })
            .catch((e) => {
                console.log(e);
            })
    }

    const setHeader = () => {
        navigation.setOptions({
            title: '',
            headerTitleAlign: 'left',
            headerTitle: () => (
                <Image style={{ height: 52, width: 150, marginTop: 10, marginLeft: -10 }}
                    source={require('../assets/lovi-logo.png')}
                />
            ),
            headerTitleStyle: {
                color: '#2e64e5',
                fontFamily: 'Kufam-SemiBoldItalic',
                fontSize: 18,
            },
            headerStyle: {
                shadowColor: '#fff',
                height: 45,
                elevation: 0,
            },
            headerRight: () => (
                <View style={{ flexDirection: 'row', marginRight: 15 }}>
                    <TouchableOpacity style={{ marginTop: 3, marginRight: 10 }} onPress={() => navigation.navigate('SearchProfile')}>
                        <Ionicons name="search-circle" size={45} color="#608aeb" />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginTop: 5, marginRight: 10 }} onPress={() => navigation.navigate('Notify')}>
                        <Ionicons name="notifications-circle" size={43} color="#608aeb" />
                        {notify > 0 ? (
                            <View style={styles.badge}>
                                <Text style={styles.textbadge}>{notify > 9 ? '9+' : notify}</Text>
                            </View>
                        ) : null}
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginTop: 5 }} onPress={() => navigation.navigate('AddPost')}>
                        <Ionicons name="add-circle" size={42} color="#608aeb" />
                    </TouchableOpacity>
                </View>
            ),
        })
    }

    useEffect(() => {
        getNotify();
    }, [onget]);

    useEffect(() => {
        fetchPosts();
        getCurrentUser();
    }, [loading]);

    useEffect(() => {
        fetchPosts();
        setDeleted(false);
    }, [deleted]);

    const ListHeader = () => {
        return null;
    };

    return (
        <Container>
            {loading ? (
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{ alignItems: 'center', margin: 0, padding: 10 }}
                    showsVerticalScrollIndicator={false}>
                    <SkeletonPlaceholder>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ width: 60, height: 60, borderRadius: 50 }} />
                            <View style={{ marginLeft: 20 }}>
                                <View style={{ width: 120, height: 20, borderRadius: 4 }} />
                                <View
                                    style={{ marginTop: 6, width: 80, height: 20, borderRadius: 4 }}
                                />
                            </View>
                        </View>
                        <View style={{ marginTop: 10, marginBottom: 30 }}>
                            <View style={{ width: 300, height: 20, borderRadius: 4 }} />
                            <View
                                style={{ marginTop: 6, width: 200, height: 20, borderRadius: 4 }}
                            />
                            <View
                                style={{ marginTop: 6, width: 350, height: 200, borderRadius: 4 }}
                            />
                        </View>
                    </SkeletonPlaceholder>
                    <SkeletonPlaceholder>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ width: 60, height: 60, borderRadius: 50 }} />
                            <View style={{ marginLeft: 20 }}>
                                <View style={{ width: 120, height: 20, borderRadius: 4 }} />
                                <View
                                    style={{ marginTop: 6, width: 80, height: 20, borderRadius: 4 }}
                                />
                            </View>
                        </View>
                        <View style={{ marginTop: 10, marginBottom: 30 }}>
                            <View style={{ width: 300, height: 20, borderRadius: 4 }} />
                            <View
                                style={{ marginTop: 6, width: 350, height: 200, borderRadius: 4 }}
                            />
                            <View
                                style={{ marginTop: 6, width: 150, height: 20, borderRadius: 4 }}
                            />
                        </View>
                    </SkeletonPlaceholder>
                </ScrollView>
            ) : (
                <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                    <Toast style={{ zIndex: 5, top: -30 }} ref={(ref) => Toast.setRef(ref)} />
                    <FlatList
                        ref={ref}
                        onRefresh={() => {fetchPosts(); getCurrentUser(); setHeader();}}
                        refreshing={false}
                        data={posts}
                        renderItem={({ item }) => (
                            <PostCard
                                item={item}
                                onDelete={handleDelete}
                                username={username}
                                onPress={() =>
                                    navigation.navigate('HomeProfile', { userId: item.userId })
                                }
                                onSeePhoto={() => {
                                    navigation.navigate('Photo', { postImg: item.postImg, isAva: false })
                                }}
                                onComment={() => {
                                    navigation.navigate('Comment', { postId: item.id, postUserId: item.userId, isComment: true })
                                }}
                            />
                        )}
                        keyExtractor={(item) => item.id}
                        ListHeaderComponent={ListHeader}
                        ListFooterComponent={ListHeader}
                        showsVerticalScrollIndicator={false}
                    />
                </SafeAreaView>

            )}
        </Container>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    text: {
        fontSize: 20,
        color: '#333333'
    },
    badge: {
        position: 'absolute',
        top: 0,
        flex: 1,
        justifyContent: 'center',
        right: 0,
        backgroundColor: 'red',
        width: 20,
        height: 20,
        borderRadius: 10,
    },
    textbadge: {
        fontSize: 12,
        textAlign: 'center',
        color: 'white',
    }
});