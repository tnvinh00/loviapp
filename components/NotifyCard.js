import React, { useContext, useEffect, useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Container, Card, UserInfo, UserImgWrapper, UserImg, UserInfoText, UserName, PostTime, MessageText, TextSection, Interaction, InteractionWrapper } from '../styles/NotifyStyle';

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

const NotifyCard = ({ item, onPress, onDelete, navigation }) => {
    const { user } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);

    const handlePress = () => {
        if (item.data.type == 'follow')
            navigation.navigate('HomeProfile', { userId: item.data.userId })
        else
            navigation.navigate('Comment', { postId: item.data.postId, postUserId: item.data.userId, isComment: true })
    }

    useEffect(() => {

    }, []);

    return (
        <Card style={{ width: windowWidth-10 }} key={item.id} onPress={handlePress}>
            <UserInfo>
                <UserImgWrapper>
                    {item.data.type == 'follow' ? (
                        <Ionicons name="person-add" size={30} color="#2e64e5"></Ionicons>
                    ) : null}
                    {item.data.type == 'like' ? (
                        <Ionicons name={'heart'} size={30} color={'#de4d41'} />
                    ) : null}
                    {item.data.type == 'comment' ? (
                        <Ionicons name="chatbox-ellipses" size={30} color="#2e64e5"></Ionicons>
                    ) : null}

                </UserImgWrapper>
                <TextSection>
                    <UserInfoText>
                        <TouchableOpacity>
                            <UserName numberOfLines={1} ellipsizeMode="tail">
                                {item.data.notification}
                            </UserName>
                        </TouchableOpacity>
                    </UserInfoText>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <PostTime>{moment(item.data.createdAt.toDate()).fromNow()}</PostTime>

                        {/* <Interaction onPress={() => onDelete(item.id)}>
                            <Ionicons name="trash-outline" size={20} />
                        </Interaction> */}
                    </View>
                </TextSection>
            </UserInfo>
        </Card>
    );
};

export default NotifyCard;
