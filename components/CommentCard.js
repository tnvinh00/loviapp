import React, { useContext, useEffect, useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Container, Card, UserInfo, UserImgWrapper, UserImg, UserInfoText, UserName, PostTime, MessageText, TextSection, Interaction, InteractionWrapper } from '../styles/CommentStyle';

import ProgressiveImage from './ProgressiveImage';

import { AuthContext } from '../navigation/AuthProvider';

import moment from 'moment';
import { TouchableOpacity } from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import { Text, View } from 'react-native';
import { windowWidth } from '../utils/Dimentions';

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

const CommentCard = ({ item, onPress, postUserId, onDelete }) => {
    const { user } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);

    const getUser = async () => {
        await firestore()
            .collection('USERS')
            .doc(item.userId)
            .get()
            .then((documentSnapshot) => {
                if (documentSnapshot.exists) {
                    // console.log('User Data', documentSnapshot.data());
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
        <Card style={{ width: windowWidth-10 }} key={item.id}>
            <UserInfo>
                <UserImgWrapper onPress={onPress}>
                    <UserImg
                        source={{
                            uri: userData ? userData.userImg
                                : 'https://firebasestorage.googleapis.com/v0/b/lovi-fdfca.appspot.com/o/users%2Fuser.png?alt=media&token=9703fb4a-830b-4f37-9ee2-d4f2e8059178',
                        }}
                    />
                </UserImgWrapper>
                <TextSection>
                    <UserInfoText>
                        <TouchableOpacity onPress={onPress}>
                            <UserName>
                                {userData ? userData.name : 'Đang tải ...'}
                            </UserName>
                        </TouchableOpacity>
                        <View style={{flexDirection: 'row'}}>
                            <PostTime>{moment(item.createdAt.toDate()).fromNow()}</PostTime>
                            {user.uid == item.userId || user.uid == postUserId ? (
                                <Interaction onPress={() => onDelete(item.id)}>
                                    <Ionicons name="trash-outline" size={18} />
                                </Interaction>
                            ) : null}
                        </View>
                    </UserInfoText>
                    <MessageText numberOfLines={1} ellipsizeMode="tail">
                        {item.comment}
                    </MessageText>
                </TextSection>
            </UserInfo>
        </Card>
    );
};

export default CommentCard;
