import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity, Alert, RefreshControl, ActivityIndicator, ToastAndroid } from 'react-native';
import FormButton from '../components/FormButton';

import { AuthContext } from '../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import PostCard from '../components/PostCard';
import { useScrollToTop } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { StatusWrapper } from '../styles/AddPost';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LottieView from 'lottie-react-native';

const ProfileScreen = ({ navigation, route }) => {
    const { user, logout } = useContext(AuthContext);

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = React.useState(true);
    const [deleted, setDeleted] = useState(false);
    const [userData, setUserData] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [folowed, setFolowed] = useState(false);
    const [count, setCount] = useState(0);
    const [totallike, setTotallike] = useState(0);

    const ref = React.useRef(null);
    useScrollToTop(ref);

    const fetchPosts = async () => {
        try {
            const list = [];
            var countlike = 0;
            setLoading(false);

            await firestore()
                .collection('POSTS')
                .where('userId', '==', route.params ? route.params.userId : user.uid)
                .orderBy('postTime', 'desc')
                .get()
                .then((querySnapshot) => {
                    //console.log('Total Posts: ', querySnapshot.size);
                    querySnapshot.forEach((doc, index) => {
                        const { userId, post, postImg, postTime, likes, comments } = doc.data();

                        firestore()
                            .collection('POSTS')
                            .doc(doc.id)
                            .collection("LIKES")
                            .get()
                            .then((res) => {
                                countlike = countlike + res.size;
                                if (index === querySnapshot.size - 1) {
                                    setTotallike(countlike);
                                }
                            });

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

            if (loading) {
                setLoading(false);
            }
            setRefreshing(false)
        } catch (error) {
            console.log(error);
        }
    };

    const getUser = async () => {
        const currentUser = await firestore()
            .collection('USERS')
            .doc(route.params ? route.params.userId : user.uid)
            .onSnapshot((documentSnapshot) => {
                if (documentSnapshot.exists) {
                    //console.log('User Data', documentSnapshot.data());
                    setUserData(documentSnapshot.data());
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
                    //console.log('User Data', documentSnapshot.data());
                    setCurrentUser(documentSnapshot.data());
                }
            })
            .catch((e) => {
                console.log(e);
            })
    }

    const handleDelete = (postId) => {
        Alert.alert(
            'Xóa bài viết',
            'Bạn có chắc chắn muốn xóa không?',
            [
                {
                    text: 'Hủy',
                    // onPress: () => console.log('Cancel Pressed!'),
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
                        topOffset: 5,
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

    const handlePress = async (uid) => {
        if (uid == user.uid) {
            Toast.show({
                type: 'error',
                position: 'top',
                text1: 'Bạn không thể nhắn tin cho chính mình',
                visibilityTime: 3000,
                autoHide: true,
                topOffset: 5,
                bottomOffset: 40,
            });
            return null;
        }
        var check = 0;
        var threadid
        await firestore()
            .collection('MESSAGETHREADS')
            .where('users.id1', '==', uid)
            .where('users.id2', '==', user.uid)
            .get()
            .then(querySnapshot => {
                if (querySnapshot.size > 0) {
                    check = check + 1;
                    querySnapshot.forEach(documentSnapshot => {
                        threadid = documentSnapshot.id;
                    });
                }
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
                        threadid = documentSnapshot.id;
                    });
                }
            })

        if (check == 1) {
            navigation.navigate('Chat', { userId: uid, threadId: threadid })
        }
        else {
            navigation.navigate('AddNewMessage', { uid: uid })
        }
    }

    const onLogout = () => {
        Alert.alert(
            'Đăng xuất',
            'Bạn có chắc chắn muốn đăng xuất không?',
            [
                {
                    text: 'Đăng xuất',
                    onPress: () => logout(),
                },
                {
                    text: 'Hủy',
                    // onPress: () => console.log('Cancel Pressed!'),
                    style: 'cancel',
                }
            ],
            { cancelable: false },
        );
    }

    const handleFollow = async () => {
        if (!folowed) {
            await firestore()
                .collection("USERS")
                .doc(route.params.userId)
                .collection("FOLOWERS")
                .doc(user.uid)
                .set({
                    folow: true
                })
                .then(async () => {
                    await firestore()
                        .collection('USERS')
                        .doc(route.params.userId)
                        .collection('NOTIFICATIONS')
                        .add({
                            notification: currentUser.name + ' đã theo dõi bạn',
                            createdAt: firestore.Timestamp.fromDate(new Date()),
                            type: 'follow',
                            userId: user.uid,
                        });
                    var getnoti = 0;
                    await firestore()
                        .collection('USERS')
                        .doc(route.params.userId)
                        .get()
                        .then((documentSnapshot) => {
                            if (documentSnapshot.exists) {
                                getnoti = documentSnapshot.data().notify;
                            }
                        })
                    await firestore()
                        .collection('USERS')
                        .doc(route.params.userId)
                        .update({
                            notify: getnoti + 1
                        })
                })
                .catch((e) => {
                    console.log(e);
                    ToastAndroid.show("Đã có lỗi", ToastAndroid.LONG);
                })
        }
        else {
            await firestore()
                .collection("USERS")
                .doc(route.params.userId)
                .collection("FOLOWERS")
                .doc(user.uid)
                .delete();
        }
    }

    const checkFolowed = async () => {
        await firestore()
            .collection("USERS")
            .doc(route.params.userId)
            .collection("FOLOWERS")
            .doc(user.uid)
            .onSnapshot((documentSnapshot) => {
                if (documentSnapshot.exists) {
                    setFolowed(true);
                }
                else
                    setFolowed(false);
            })
    }

    const getNumOfFolow = async () => {
        await firestore()
            .collection("USERS")
            .doc(route.params ? route.params.userId : user.uid)
            .collection("FOLOWERS")
            .onSnapshot((querySnapshot) => {
                setCount(querySnapshot.size);
            })
    }

    useEffect(() => {
        getUser();
        fetchPosts();
        getNumOfFolow();
        if (route.params) {
            getCurrentUser();
            checkFolowed();
        }
    }, []);

    useEffect(() => {
        getUser();
        fetchPosts();
        setDeleted(false);
    }, [deleted]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <Toast style={{ zIndex: 5 }} ref={(ref) => Toast.setRef(ref)} />
            <ScrollView
                ref={ref}
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={() => { fetchPosts(); getUser() }}
                    />}
                style={styles.container}
                contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
                showsVerticalScrollIndicator={false}
            >
                <TouchableOpacity onPress={() => navigation.navigate('Photo', { postImg: userData.userImg, isAva: true })}>
                    <Image style={styles.userImg} source={{ uri: userData ? userData.userImg : 'https://firebasestorage.googleapis.com/v0/b/lovi-fdfca.appspot.com/o/users%2Fuser.png?alt=media&token=9703fb4a-830b-4f37-9ee2-d4f2e8059178' }} />
                </TouchableOpacity>
                <Text style={styles.userName}>{userData ? userData.name : 'Đang tải ...'}</Text>
                <Text style={styles.bioUser}>{userData ? userData.aboutme : ''}</Text>
                <View style={styles.userBtnWrapper}>
                    <Feather style={{ marginLeft: 20, marginRight: 5 }} name="phone" color="#333333" size={20} />
                    <Text style={styles.aboutUser}>{userData ? userData.phone : ''}</Text>

                    <MaterialCommunityIcons style={{ marginLeft: 20, marginRight: 5 }}
                        name="map-marker-outline"
                        color="#333333"
                        size={20}
                    />
                    <Text style={styles.aboutUser}>{userData ? userData.city : ''}</Text>

                    <FontAwesome style={{ marginLeft: 20, marginRight: 5 }} name="globe" color="#333333" size={20} />
                    <Text style={styles.aboutUser}>{userData ? userData.country : ''}</Text>
                </View>

                <View style={styles.userBtnWrapper}>
                    {route.params ? (
                        <>
                            {folowed ? (
                                <TouchableOpacity style={styles.userBtn2} disabled={userData ? false : true} onPress={handleFollow}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Ionicons style={{ marginRight: 5 }} name="checkmark-circle" color="#de4d41" size={18} />
                                        <Text style={styles.userBtnTxt2}>Đang theo dõi</Text>
                                    </View>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity style={styles.userBtn} disabled={userData ? false : true} onPress={handleFollow}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Ionicons style={{ marginRight: 5 }} name="person-add" color="#2e64e5" size={18} />
                                        <Text style={styles.userBtnTxt}>Theo dõi</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity style={styles.userBtn} disabled={userData ? false : true} onPress={() => handlePress(route.params.userId)}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Ionicons style={{ marginRight: 5 }} name="chatbubble-ellipses" color="#2e64e5" size={18} />
                                    <Text style={styles.userBtnTxt}>Nhắn tin</Text>
                                </View>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <TouchableOpacity style={styles.userBtn} disabled={userData ? false : true} onPress={() => { navigation.navigate('EditProfile') }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Feather style={{ marginRight: 5 }} name="edit" color="#2e64e5" size={15} />
                                    <Text style={styles.userBtnTxt}>Chỉnh sửa hồ sơ</Text>
                                </View>

                            </TouchableOpacity>
                            <TouchableOpacity style={styles.userBtn2} disabled={loading} onPress={onLogout}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Ionicons style={{ marginRight: 5 }} name="log-out-outline" color="#de4d41" size={18} />
                                    <Text style={styles.userBtnTxt2}>Đăng xuất</Text>
                                </View>
                            </TouchableOpacity>
                        </>
                    )}
                </View>

                <View style={styles.userInfoWrapper}>
                    <View style={styles.userInfoItem}>
                        <Text style={styles.userInfoTitle}>{posts.length}</Text>
                        <Text style={styles.userInfoSubTitle}>      Bài viết      </Text>
                    </View>
                    <View style={styles.userInfoItem}>
                        <Text style={styles.userInfoTitle}>{totallike}</Text>
                        <Text style={styles.userInfoSubTitle}>Yêu thích</Text>
                    </View>
                    <View style={styles.userInfoItem}>
                        <Text style={styles.userInfoTitle}>{count}</Text>
                        <Text style={styles.userInfoSubTitle}>Người theo dõi</Text>
                    </View>
                </View>
                {loading ? (
                    <StatusWrapper>
                        <LottieView style={{ height: 200 }} source={require('../assets/splash/65210-loading-colour-dots.json')} autoPlay speed={0.8} />
                    </StatusWrapper>
                ) : null}

                {posts.map((item) => (
                    <PostCard key={item.id} item={item}
                        onDelete={handleDelete}
                        onSeePhoto={() => {
                            navigation.navigate('Photo', { postImg: item.postImg, isAva: false })
                        }}
                        onComment={() => {
                            navigation.navigate('Comment', { postId: item.id, postUserId: item.userId, isComment: true });
                        }}
                    />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
    userImg: {
        height: 150,
        width: 150,
        borderRadius: 75,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 10,
    },
    aboutUser: {
        fontSize: 12,
        fontWeight: '600',
        color: '#666',
        textAlign: 'center',
        marginBottom: 15,
        marginTop: 2,
        marginRight: 20,
    },
    bioUser: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        textAlign: 'center',
        marginBottom: 15,
    },
    userBtnWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        marginBottom: 10,
    },
    userBtn: {
        borderColor: '#2e64e5',
        borderWidth: 2,
        borderRadius: 3,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginHorizontal: 5,
    },
    userBtn2: {
        borderColor: '#de4d41',
        borderWidth: 2,
        borderRadius: 3,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginHorizontal: 5,
    },
    userBtnTxt: {
        color: '#2e64e5',
    },
    userBtnTxt2: {
        color: '#de4d41',
    },
    userInfoWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginVertical: 20,
    },
    userInfoItem: {
        justifyContent: 'center',
    },
    userInfoTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
    },
    userInfoSubTitle: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
});
