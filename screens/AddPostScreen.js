import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    Platform,
    StyleSheet,
    Alert,
    ActivityIndicator,
    Keyboard
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';

import Toast from 'react-native-toast-message';

import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import HomeScreen from './HomeScreen';

import {
    InputField,
    InputWrapper,
    AddImage,
    SubmitBtn,
    SubmitBtnText,
    StatusWrapper,
} from '../styles/AddPost';

import { AuthContext } from '../navigation/AuthProvider';

const AddPostScreen = ({ navigation }) => {
    const { user, logout } = useContext(AuthContext);

    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [transferred, setTransferred] = useState(0);
    const [post, setPost] = useState(null);

    const takePhotoFromCamera = () => {
        ImagePicker.openCamera({
            width: 1200,
            height: 780,
            cropping: true,
        }).then((image) => {
            //console.log(image);
            const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
            setImage(imageUri);
        })
            .catch((e) => {
                console.log(e);
                Toast.show({
                    type: 'info',
                    position: 'top',
                    text1: 'Bạn chưa chụp ảnh',
                    visibilityTime: 4000,
                    autoHide: true,
                    topOffset: 40,
                    bottomOffset: 40,
                });
            });
    };

    const choosePhotoFromLibrary = () => {
        ImagePicker.openPicker({
            width: 1200,
            height: 780,
            cropping: true,
        }).then((image) => {
            //console.log(image);
            const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
            setImage(imageUri);
        })
            .catch((e) => {
                console.log(e);
                Toast.show({
                    type: 'info',
                    position: 'top',
                    text1: 'Bạn chưa chọn ảnh',
                    visibilityTime: 4000,
                    autoHide: true,
                    topOffset: 40,
                    bottomOffset: 40,
                });
            });
    };

    const submitPost = async () => {
        const imageUrl = await uploadImage();
        //console.log(imageUrl);

        firestore()
            .collection('POSTS')
            .add({
                userId: user.uid,
                post: post,
                postImg: imageUrl,
                postTime: firestore.Timestamp.fromDate(new Date()),
                likes: 0,
                comments: 0,
            })
            .then(() => {
                Keyboard.dismiss();
                setPost(null);
                Toast.show({
                    type: 'success',
                    position: 'top',
                    text1: 'Đăng thành công',
                    text2: 'Làm mới trang chủ để xem bài viết mới 💕',
                    visibilityTime: 4000,
                    autoHide: true,
                    topOffset: 40,
                    bottomOffset: 40,
                });

                setTimeout(() => {
                    navigation.navigate('Lovi App');
                }, 3000)
            })
            .catch((e) => {
                console.log(e);
                Toast.show({
                    type: 'error',
                    position: 'top',
                    text1: 'Lỗi',
                    text2: 'Đã có lỗi xảy ra, vui lòng thử lại sau 😭',
                    visibilityTime: 4000,
                    autoHide: true,
                    topOffset: 40,
                    bottomOffset: 40,
                });
            })
    }

    const uploadImage = async () => {
        if (image == null) {
            return null;
        }
        const uploadUri = image;
        let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

        // Add timestamp to File Name
        const extension = filename.split('.').pop();
        const name = filename.split('.').slice(0, -1).join('.');
        filename = name + '-' + Date.now() + '.' + extension;

        setUploading(true);
        setTransferred(0);

        const storageRef = storage().ref(`photos/${filename}`);
        const task = storageRef.putFile(uploadUri);

        task.on('state_changed', taskSnapshot => {
            console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);

            setTransferred(
                Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100
            );
        });

        try {
            await task;
            const url = await storageRef.getDownloadURL();

            setUploading(false);
            setImage(null);
            return url;
        } catch (e) {
            console.log(e);
            return null;
        }
    };
    
    return (
        <View style={styles.container}>
            <Toast style={{ top: -50 }} ref={(ref) => Toast.setRef(ref)} />
            <InputWrapper>
                {image != null ? <AddImage source={{ uri: image }} /> : null}

                <InputField
                    placeholder="Bạn đang nghĩ gì?"
                    multiline
                    numberOfLines={4}
                    value={post}
                    onChangeText={(content) => setPost(content)}
                />
                {uploading ? (
                    <StatusWrapper>
                        <Text>Đang tải ảnh lên {transferred}% !</Text>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </StatusWrapper>
                ) : (
                    <SubmitBtn onPress={submitPost}>
                        <SubmitBtnText>Đăng</SubmitBtnText>
                    </SubmitBtn>
                )}
            </InputWrapper>
            <ActionButton buttonColor="#2e64e5">
                <ActionButton.Item
                    buttonColor="#9b59b6"
                    title="Chụp ảnh"
                    onPress={takePhotoFromCamera}>
                    <Icon name="camera-outline" style={styles.actionButtonIcon} />
                </ActionButton.Item>
                <ActionButton.Item
                    buttonColor="#3498db"
                    title="Chọn ảnh"
                    onPress={choosePhotoFromLibrary}>
                    <Icon name="md-images-outline" style={styles.actionButtonIcon} />
                </ActionButton.Item>
            </ActionButton>
        </View>
    );
}

export default AddPostScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
});
