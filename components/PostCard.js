import React, { useContext, useEffect, useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
import { TouchableOpacity } from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';

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

const PostCard = ({ onSeePhoto, item, onDelete, onPress }) => {
    const { user, logout } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);

    likeIcon = item.liked ? 'heart' : 'heart-outline';
    likeIconColor = item.liked ? '#2e64e5' : '#333';

    if (item.likes == 1) {
        likeText = '1 Like';
    } else if (item.likes > 1) {
        likeText = item.likes + ' Likes';
    } else {
        likeText = 'Like';
    }

    if (item.comments == 1) {
        commentText = '1 Comment';
    } else if (item.comments > 1) {
        commentText = item.comments + ' Comments';
    } else {
        commentText = 'Comment';
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
    }, []);

    return (
        <Card key={item.id}>
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
                            {userData ? userData.name : 'user_0'}
                        </UserName>
                    </TouchableOpacity>
                    <PostTime>{moment(item.postTime.toDate()).fromNow()}</PostTime>
                </UserInfoText>
            </UserInfo>
            <PostText>{item.post}</PostText>
            {/* {item.postImg != null ? <PostImg source={item.postImg} /> : <Divider />} */}
            {item.postImg != null ? (
                <TouchableOpacity onPress={onSeePhoto}>
                    <ProgressiveImage
                        defaultImageSource={require('../assets/default-img.jpg')}
                        source={{ uri: item.postImg }}
                        style={{ width: '100%', height: 250 }}
                        resizeMode="cover"
                    />
                </TouchableOpacity>

            ) : (
                <Divider />
            )}

            <InteractionWrapper>
                <Interaction active={item.liked}>
                    <Ionicons name={likeIcon} size={25} color={likeIconColor} />
                    <InteractionText active={item.liked}>{likeText}</InteractionText>
                </Interaction>
                <Interaction>
                    <Ionicons name="md-chatbubble-outline" size={25} />
                    <InteractionText>{commentText}</InteractionText>
                </Interaction>
                {user.uid == item.userId ? (
                    <Interaction onPress={() => onDelete(item.id)}>
                        <Ionicons name="md-trash-bin" size={25} />
                    </Interaction>
                ) : null}
            </InteractionWrapper>
        </Card>
    );
};

export default PostCard;
