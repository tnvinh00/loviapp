import styled from 'styled-components';
import { windowWidth } from '../utils/Dimentions';

export const Container = styled.View`
  flex: 1;
  padding-left: 0px;
  padding-right: 0px;
  align-items: center;
  background-color: #ffffff;
`;

export const Card = styled.View`
  width: 100%;
  background-color: #f9f9f9;
  margin-bottom: 5px;
  border-radius: 10px;
  border-bottom-width: 1px;
  border-bottom-color: #cccccc;
`;

export const UserInfo = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const UserImgWrapper = styled.TouchableOpacity`
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 15px;
`;

export const UserImg = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 20px;
`;

export const TextSection = styled.View`
  flex-direction: column;
  justify-content: center;
  padding: 15px;
  padding-left: 0;
  margin-left: 0;
  width: ${(windowWidth - 80).toString() + 'px'};
`;

export const UserInfoText = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 5px;
`;

export const UserName = styled.Text`
  font-size: 12px;
  font-weight: bold;
  font-family: 'Lato-Regular';
`;

export const PostTime = styled.Text`
  font-size: 10px;
  color: #666;
  margin-left: 30px;
  font-family: 'Lato-Regular';
`;

export const MessageText = styled.Text`
  font-size: 13px;
  color: #333333;
`;

export const Interaction = styled.TouchableOpacity`
    margin-left: 15px;
    background-color: ${props => props.active ? '#de4d4115' : 'transparent'}
`;

export const InteractionWrapper = styled.View`
    flex-direction: row;
    justify-content: space-around;
    padding: 15px;
`;