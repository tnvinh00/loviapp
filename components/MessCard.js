import React, { useContext, useEffect, useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Container, Card, UserInfo, UserImgWrapper, UserImg, UserInfoText, UserName, PostTime, MessageText, TextSection } from '../styles/MessageStyles';

import ProgressiveImage from './ProgressiveImage';

import { AuthContext } from '../navigation/AuthProvider';

import moment from 'moment';
import { TouchableOpacity } from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import { Text } from 'react-native';
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

const MessCard = ({ item, onPress, navigation }) => {
    const { user, logout } = useContext(AuthContext);
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
        <Card style={{ width: windowWidth-20 }} key={item.id} onPress={onPress}>
            <UserInfo>
                <UserImgWrapper>
                    <UserImg
                        source={{
                            uri: userData ? userData.userImg
                                : 'https://firebasestorage.googleapis.com/v0/b/lovi-fdfca.appspot.com/o/users%2Fuser.png?alt=media&token=9703fb4a-830b-4f37-9ee2-d4f2e8059178',
                        }}
                    />
                </UserImgWrapper>
                <TextSection>
                    <UserInfoText>
                        <UserName>{userData ? userData.name : '...'}</UserName>
                        <PostTime>{moment(item.latestMessage.createdAt.toDate()).fromNow()}</PostTime>
                    </UserInfoText>
                    <MessageText numberOfLines={1} ellipsizeMode="tail">
                        <Text style={{ fontWeight: 'bold' }}>{user.uid == item.latestMessage.uid ? 'Bạn: ' : ''}</Text>
                        {item.latestMessage.text}
                    </MessageText>
                </TextSection>
            </UserInfo>
        </Card>
    );
};

export default MessCard;
