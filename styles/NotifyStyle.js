import styled from 'styled-components';
import { windowWidth } from '../utils/Dimentions';

export const Card = styled.TouchableOpacity`
  width: 100%;
  background-color: #f9f9f9;
  margin-bottom: 5px;
  padding: 5px;
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

export const TextSection = styled.View`
  flex-direction: column;
  justify-content: center;
  padding-left: 0;
  width: ${(windowWidth - 80).toString() + 'px'};
`;

export const UserInfoText = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 5px;
`;

export const UserName = styled.Text`
  font-size: 13px;
  font-weight: bold;
  padding-top: 10px;
  font-family: 'Lato-Regular';
`;

export const PostTime = styled.Text`
  font-size: 10px;
  color: #666;
  margin-top: 5px;
  margin-right: 15px;
  font-family: 'Lato-Regular';
`;

export const Interaction = styled.TouchableOpacity`
    margin-right: 15px;
    background-color: ${props => props.active ? '#de4d4115' : 'transparent'}
`;

export const InteractionWrapper = styled.View`
    flex-direction: row;
    justify-content: space-around;
    padding: 15px;
`;