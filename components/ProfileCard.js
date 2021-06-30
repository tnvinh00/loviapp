import React, { useContext, useEffect, useState } from 'react';

import { Card, UserInfo, UserImgWrapper, UserImg, UserInfoText, UserName, TextSection } from '../styles/MessageStyles';

const MessCard = ({ item, onPress, navigation }) => {
    return (
        <Card key={item.id} onPress={onPress}>
            <UserInfo>
                <UserImgWrapper>
                    <UserImg
                        source={{
                            uri: item.userImg
                        }}
                    />
                </UserImgWrapper>
                <TextSection>
                    <UserInfoText>
                        <UserName>{item.name}</UserName>
                    </UserInfoText>
                </TextSection>
            </UserInfo>
        </Card>
    );
};

export default MessCard;
