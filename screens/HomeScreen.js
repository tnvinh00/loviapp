import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, ActivityIndicator, SafeAreaView, ScrollView } from 'react-native';
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
                        topOffset: 25,
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

    useEffect(() => {
        fetchPosts();
    }, []);

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
                    contentContainerStyle={{ alignItems: 'center' }}
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
                                style={{ marginTop: 6, width: 250, height: 20, borderRadius: 4 }}
                            />
                            <View
                                style={{ marginTop: 6, width: 350, height: 200, borderRadius: 4 }}
                            />
                        </View>
                    </SkeletonPlaceholder>
                </ScrollView>
            ) : (
                <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                    <Toast style={{ zIndex: 5, top: -30 }} ref={(ref) => Toast.setRef(ref)} />
                    <FlatList
                        ref={ref}
                        width={'100%'}
                        onRefresh={() => fetchPosts()}
                        refreshing={loading}
                        data={posts}
                        renderItem={({ item }) => (
                            <PostCard
                                item={item}
                                onDelete={handleDelete}
                                onPress={() =>
                                    navigation.navigate('HomeProfile', { userId: item.userId })
                                }
                                onSeePhoto={() => {
                                    navigation.navigate('Photo', { postImg: item.postImg, isAva: false })
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
    }
});