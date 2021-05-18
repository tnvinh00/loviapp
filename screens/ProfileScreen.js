import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity, Alert, RefreshControl, ActivityIndicator } from 'react-native';
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

const ProfileScreen = ({ navigation, route }) => {
    const { user, logout } = useContext(AuthContext);

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = React.useState(true);
    const [deleted, setDeleted] = useState(false);
    const [userData, setUserData] = useState(null);


    const ref = React.useRef(null);
    useScrollToTop(ref);

    const fetchPosts = async () => {
        try {
            const list = [];

            await firestore()
                .collection('POSTS')
                .where('userId', '==', route.params ? route.params.userId : user.uid)
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
            .get()
            .then((documentSnapshot) => {
                if (documentSnapshot.exists) {
                    //console.log('User Data', documentSnapshot.data());
                    setUserData(documentSnapshot.data());
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
        getUser();
        fetchPosts();
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
                    <Feather style={{ marginLeft: 20 }} name="phone" color="#333333" size={20} />
                    <Text style={styles.aboutUser}>{userData ? userData.phone : ''}</Text>

                    <MaterialCommunityIcons style={{ marginLeft: 20 }}
                        name="map-marker-outline"
                        color="#333333"
                        size={20}
                    />
                    <Text style={styles.aboutUser}>{userData ? userData.city : ''}</Text>

                    <FontAwesome style={{ marginLeft: 20 }} name="globe" color="#333333" size={20} />
                    <Text style={styles.aboutUser}>{userData ? userData.country : ''}</Text>
                </View>

                <View style={styles.userBtnWrapper}>
                    {route.params ? (
                        <>
                            <TouchableOpacity style={styles.userBtn} onPress={() => { }}>
                                <Text style={styles.userBtnTxt}>Theo dõi</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.userBtn} onPress={() => navigation.navigate('AddNewMessage', {uid: route.params.userId})}>
                                <Text style={styles.userBtnTxt}>Nhắn tin</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <TouchableOpacity style={styles.userBtn} onPress={() => { navigation.navigate('EditProfile') }}>
                                <View style={{flexDirection: 'row'}}>
                                    <Feather style={{marginRight: 5}} name="edit" color="#2e64e5" size={15} />
                                    <Text style={styles.userBtnTxt}>Chỉnh sửa hồ sơ</Text>
                                </View>

                            </TouchableOpacity>
                            <TouchableOpacity style={styles.userBtn} onPress={() => logout()}>
                                <Text style={styles.userBtnTxt}>Đăng xuất</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>

                <View style={styles.userInfoWrapper}>
                    <View style={styles.userInfoItem}>
                        <Text style={styles.userInfoTitle}>{posts.length}</Text>
                        <Text style={styles.userInfoSubTitle}>Bài viết</Text>
                    </View>
                    <View style={styles.userInfoItem}>
                        <Text style={styles.userInfoTitle}>10,000</Text>
                        <Text style={styles.userInfoSubTitle}>Người theo dõi</Text>
                    </View>
                    <View style={styles.userInfoItem}>
                        <Text style={styles.userInfoTitle}>100</Text>
                        <Text style={styles.userInfoSubTitle}>Đang theo dõi</Text>
                    </View>
                </View>
                {loading ? (
                    <StatusWrapper>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </StatusWrapper>
                ) : null}
                
                {posts.map((item) => (
                    <PostCard key={item.id} item={item}
                        onDelete={handleDelete}
                        onSeePhoto={() => {
                            navigation.navigate('Photo', { postImg: item.postImg, isAva: false })
                        }
                        }
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
    userBtnTxt: {
        color: '#2e64e5',
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
