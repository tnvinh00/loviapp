import React, { useContext, useEffect, useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LottieView from 'lottie-react-native';

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
} from '../styles/FeedStyles';

import ProgressiveImage from './ProgressiveImage';

import { AuthContext } from '../navigation/AuthProvider';

import moment from 'moment';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import { windowWidth } from '../utils/Dimentions.js'

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

const PostCard = ({ onSeePhoto, item, username, onDelete, onPress, onComment, isComment }) => {
    const { user, logout } = useContext(AuthContext);
    const [liked, setLiked] = useState(false);
    const [countlike, setCountlike] = useState(null);
    const [countcomment, setCountcomment] = useState(null);
    const [userData, setUserData] = useState(null);
    const [view, setView] = useState(false);

    const handleLike = async () => {
        if (!liked) {
            setView(true);
            await firestore()
                .collection("POSTS")
                .doc(item.id)
                .collection("LIKES")
                .doc(user.uid)
                .set({
                    like: true
                })
                if (user.uid != item.userId) {
                    await firestore()
                        .collection('USERS')
                        .doc(item.userId)
                        .collection('NOTIFICATIONS')
                        .add({
                            notification: username + ' đã yêu thích bài viết của bạn',
                            createdAt: firestore.Timestamp.fromDate(new Date()),
                            type: 'like',
                            read: false,
                            postId: item.id,
                            postUserId: item.userId,
                        })
                    var getnoti = 0;
                    await firestore()
                        .collection('USERS')
                        .doc(item.userId)
                        .get()
                        .then((documentSnapshot) => {
                            if (documentSnapshot.exists) {
                                getnoti = documentSnapshot.data().notify;
                            }
                        })
                    await firestore()
                        .collection('USERS')
                        .doc(item.userId)
                        .update({
                            notify: getnoti + 1
                        })
                }
        }
        else {
            await firestore()
                .collection("POSTS")
                .doc(item.id)
                .collection("LIKES")
                .doc(user.uid)
                .delete();
        }
    }

    const checkLiked = async () => {
        await firestore()
            .collection("POSTS")
            .doc(item.id)
            .collection("LIKES")
            .doc(user.uid)
            .onSnapshot((documentSnapshot) => {
                if (documentSnapshot.exists) {
                    setLiked(true);
                }
                else
                    setLiked(false);
            })
    }

    const getNumOfLiked = async () => {
        await firestore()
            .collection("POSTS")
            .doc(item.id)
            .collection("LIKES")
            .onSnapshot((querySnapshot) => {
                setCountlike(querySnapshot.size);
            })
    }

    const getNumOfCommented= async () => {
        await firestore()
            .collection("POSTS")
            .doc(item.id)
            .collection("COMMENTS")
            .onSnapshot((querySnapshot) => {
                setCountcomment(querySnapshot.size);
            })
    }

    const getUser = async () => {
        await firestore()
            .collection('USERS')
            .doc(item.userId)
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

    useEffect(() => {
        getUser();
        getNumOfLiked();
        getNumOfCommented();
        checkLiked();
    }, []);

    return (
        <Card style={{ width: windowWidth-16 }} key={item.id} onPress={onComment}>
            <UserInfo>
                <TouchableOpacity onPress={onPress}>
                    <UserImg
                        source={{
                            uri: userData ? userData.userImg
                                : 'https://firebasestorage.googleapis.com/v0/b/lovi-fdfca.appspot.com/o/users%2Fuser.png?alt=media&token=9703fb4a-830b-4f37-9ee2-d4f2e8059178',
                        }}
                    />
                </TouchableOpacity>
                <UserInfoText>
                    <TouchableOpacity onPress={onPress}>
                        <UserName>
                            {userData ? userData.name : 'Đang tải ...'}
                        </UserName>
                    </TouchableOpacity>
                    <PostTime>{moment(item.postTime.toDate()).fromNow()}</PostTime>
                </UserInfoText>
            </UserInfo>
            {item.post ? <PostText>{item.post}</PostText> : null}
            {/* {item.postImg != null ? <PostImg source={item.postImg} /> : <Divider />} */}
            {item.postImg != null ? (
                <TouchableWithoutFeedback onPress={onSeePhoto} style={{}}>
                    <ProgressiveImage
                        defaultImageSource={require('../assets/default-img.jpg')}
                        source={{ uri: item.postImg }}
                        style={{ width: '100%', height: 250 }}
                        resizeMode="cover"
                    />
                    {view ?
                        <LottieView
                            source={require('../assets/splash/836-like-button.json')}
                            autoPlay
                            style={{ width: 100, position: 'absolute', alignSelf: 'center', marginTop: 35 }}
                            loop={false}
                            speed={0.8}
                            onAnimationFinish={() => {
                                setView(false);
                            }}
                        />
                        : null}
                </TouchableWithoutFeedback >
            ) : (
                <Divider />
            )}
            {!isComment ? (
                <InteractionWrapper>
                    <Interaction active={liked} onPress={handleLike}>
                        {liked ? (
                            <Ionicons name={'heart'} size={25} color={'#de4d41'} />
                        ) : (
                            <Ionicons name={'heart-outline'} size={25} color={'#333'} />
                        )}
                        <InteractionText active={liked}>{countlike > 0 ? countlike : null} Yêu thích</InteractionText>
                    </Interaction>
                    <Interaction onPress={onComment}>
                        {countcomment > 0 ? (
                            <Ionicons name="chatbox-ellipses-outline" size={25} />
                        ) : (
                            <Ionicons name="chatbox-outline" size={25} />
                        )}
                        <InteractionText>{countcomment > 0 ? countcomment : null} Bình luận</InteractionText>
                    </Interaction>
                    {user.uid == item.userId ? (
                        <Interaction onPress={() => onDelete(item.id)}>
                            <Ionicons name="trash-outline" size={25} />
                        </Interaction>
                    ) : null}
                </InteractionWrapper>
            ) : null}
        </Card>
    );
};

export default PostCard;
