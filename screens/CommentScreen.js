import React, { useContext, useState, useEffect } from 'react';
import { View, Image, Alert, StyleSheet, SafeAreaView, Platform, Text, KeyboardAvoidingView, ScrollView, TextInput, TouchableOpacity, RefreshControl, ToastAndroid, Keyboard } from 'react-native';
import { AuthContext } from '../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StatusWrapper } from '../styles/AddPost';
import LottieView from 'lottie-react-native';
import CommentCard from '../components/CommentCard';
import PostCard from '../components/PostCard';

const CommentScreen = ({ navigation, route }) => {
    const { user } = useContext(AuthContext);
    const [currentUser, setCurrentUser] = useState(null);
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [CountComment, setCountComment] = useState(null);
    const [input, setInput] = useState(null);
    const [loading, setLoading] = useState(true);
    const [onHandle, setOnHandle] = useState(false);

    const getCurrentUser = async () => {
        const currentUser = await firestore()
            .collection('USERS')
            .doc(user.uid)
            .get()
            .then((documentSnapshot) => {
                if (documentSnapshot.exists) {
                    setCurrentUser(documentSnapshot.data());
                }
            })
            .catch((e) => {
                console.log(e);
            })
    }

    const getPost = async () => {
        try {
            await firestore()
                .collection('POSTS')
                .doc(route.params.postId)
                .get()
                .then((documentSnapshot) => {
                    if (documentSnapshot.exists) {
                        setPost(documentSnapshot.data());
                        const { userId, post, postImg, postTime, likes, comments } = documentSnapshot.data();
                        setPost({
                            id: documentSnapshot.id,
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
                    }
                })
                .catch((e) => {
                    console.log(e);
                })
        } catch (error) {
            console.log(error);
        }
    }

    const getComment = async () => {
        setComments([]);
        const list = [];

        await firestore()
            .collection('POSTS')
            .doc(route.params.postId)
            .collection('COMMENTS')
            .orderBy('createdAt', 'desc')
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const { comment, createdAt, uid } = doc.data();
                    list.push({
                        id: doc.id,
                        userId: uid,
                        createdAt,
                        comment
                    });
                });
            });
        setComments(list);
        // console.log(comments);

        setLoading(false);
    }

    const getNumOfCommented = async () => {
        await firestore()
            .collection("POSTS")
            .doc(route.params.postId)
            .collection("COMMENTS")
            .onSnapshot((querySnapshot) => {
                setCountComment(querySnapshot.size);
            })
    }

    const handleComment = async () => {
        if (input == null)
            return null;

        Keyboard.dismiss();
        await firestore()
            .collection("POSTS")
            .doc(route.params.postId)
            .collection("COMMENTS")
            .add({
                uid: user.uid,
                comment: input,
                createdAt: firestore.Timestamp.fromDate(new Date()),
            })
            .then(async () => {
                setOnHandle(true);
                setInput(null);
                if (user.uid != route.params.postUserId) {
                    await firestore()
                        .collection('USERS')
                        .doc(route.params.postUserId)
                        .collection('NOTIFICATIONS')
                        .add({
                            notification: currentUser.name + ' đã bình luận về bài viết của bạn: ' + input.substring(0, 20),
                            createdAt: firestore.Timestamp.fromDate(new Date()),
                            type: 'comment',
                            postId: route.params.postId,
                            postUserId: route.params.postUserId,
                        })
                    var getnoti = 0;
                    await firestore()
                        .collection('USERS')
                        .doc(route.params.postUserId)
                        .get()
                        .then((documentSnapshot) => {
                            if (documentSnapshot.exists) {
                                getnoti = documentSnapshot.data().notify;
                            }
                        })
                    await firestore()
                        .collection('USERS')
                        .doc(route.params.postUserId)
                        .update({
                            notify: getnoti + 1
                        })
                }
                ToastAndroid.showWithGravity('Đã thêm bình luận', ToastAndroid.LONG, ToastAndroid.CENTER);
            })
            .catch((e) => {
                console.log(e);
                ToastAndroid.showWithGravity('Đã có lỗi, không thể bình luận', ToastAndroid.LONG, ToastAndroid.CENTER);
            })
    }

    const deleteComment = async (cmtId) => {
        await firestore()
            .collection("POSTS")
            .doc(route.params.postId)
            .collection("COMMENTS")
            .doc(cmtId)
            .delete()
            .then(() => {
                ToastAndroid.show('Đã xóa bình luận', ToastAndroid.LONG);
                setOnHandle(true);
            });
    }

    const handleDelete = (cmtId) => {
        Alert.alert(
            'Xóa bình luận',
            'Bạn có chắc chắn muốn xóa bình luận này không?',
            [
                {
                    text: 'Hủy',
                    onPress: () => console.log('Cancel Pressed!'),
                    style: 'cancel',
                },
                {
                    text: 'Xóa',
                    onPress: () => deleteComment(cmtId),
                },
            ],
            { cancelable: false },
        );
    }

    useEffect(() => {
        getCurrentUser();
        getComment();
        getPost();
        getNumOfCommented();
    }, [])

    useEffect(() => {
        getComment();
        getNumOfCommented();
        setOnHandle(false);
    }, [onHandle])

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', backgroundColor: 'white', paddingHorizontal: 8, paddingTop: 5 }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1, justifyContent: 'center' }}
                keyboardVerticalOffset={60}
            >
                <>
                    <ScrollView keyboardShouldPersistTaps='handled'
                        refreshControl={
                            <RefreshControl
                                refreshing={false}
                                onRefresh={() => { getPost; }}
                            />}
                        showsVerticalScrollIndicator={false}
                    >
                        {post ? (
                            <PostCard
                                item={post}
                                isComment={route.params.isComment}
                                onPress={() =>
                                    navigation.navigate('HomeProfile', { userId: post.userId })
                                }
                                onSeePhoto={() => {
                                    navigation.navigate('Photo', { postImg: post.postImg, isAva: false })
                                }}
                            />
                        ) : (
                            <StatusWrapper>
                                <LottieView style={{ height: 200 }} source={require('../assets/splash/65210-loading-colour-dots.json')} autoPlay speed={0.8} />
                            </StatusWrapper>
                        )}
                        {CountComment > 0 ? (
                            <Text style={styles.text}>Có tất cả {CountComment} bình luận</Text>
                        ) : (
                            <Text style={styles.text}>Chưa có bình luận</Text>
                        )}

                        {comments.map((item) => (
                            <CommentCard key={item.id}
                                item={item}
                                onDelete={handleDelete}
                                postUserId={route.params.postUserId}
                                onPress={() =>
                                    navigation.navigate('HomeProfile', { userId: item.userId })
                                }
                            />
                        ))}
                    </ScrollView>
                    <View style={styles.footer}>
                        <TextInput
                            value={input}
                            onChangeText={(text) => setInput(text)}
                            style={styles.textInput}
                            placeholder="Nhập bình luận ở đây"
                        />
                        <TouchableOpacity onPress={handleComment}>
                            <Ionicons name="send" size={28} color='#2e64e5' />
                        </TouchableOpacity>
                    </View>
                </>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

export default CommentScreen;

const styles = StyleSheet.create({
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 5,
        paddingTop: 10
    },
    textInput: {
        bottom: 0,
        height: 45,
        flex: 1,
        marginRight: 5,
        borderColor: "transparent",
        backgroundColor: '#ECECEC',
        borderWidth: 1,
        color: 'grey',
        borderRadius: 20,
        paddingLeft: 15
    },
    text: {
        fontSize: 14,
        fontWeight: 'bold',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 10,
        marginLeft: 5,
    }
});