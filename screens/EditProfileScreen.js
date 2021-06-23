import React, { useContext, useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ImageBackground,
    TextInput,
    StyleSheet,
    Alert,
    SafeAreaView,
    ScrollView
} from 'react-native';
import FormButton from '../components/FormButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import ImagePicker from 'react-native-image-crop-picker';
import { AuthContext } from '../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-toast-message';


const EditProfileScreen = () => {
    const { user, logout } = useContext(AuthContext);

    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [isupdated, setIsupdated] = useState(false);
    const [transferred, setTransferred] = useState(0);
    const [userData, setUserData] = useState(null);

    const takePhotoFromCamera = () => {
        ImagePicker.openCamera({
            width: 1200,
            height: 1200,
            cropping: true,
        }).then((image) => {
            //console.log(image);
            this.bs.current.snapTo(1);
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
            height: 1200,
            cropping: true,
        }).then((image) => {
            //console.log(image);
            this.bs.current.snapTo(1)
            const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
            setImage(imageUri);
        })
            .catch((e) => {
                console.log(e);

            });
    };

    const getUser = async () => {
        const currentUser = await firestore()
            .collection('USERS')
            .doc(user.uid)
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

    const handleUpdate = async () => {
        let imgUrl = await uploadImage();

        if (imgUrl == null && userData.userImg) {
            imgUrl = userData.userImg;
        }

        firestore()
            .collection('USERS')
            .doc(user.uid)
            .update({
                name: userData.name,
                aboutme: userData.aboutme,
                phone: userData.phone,
                country: userData.country,
                city: userData.city,
                userImg: imgUrl,
            })
            .then(() => {
                console.log('User Updated!');
                deletePhoto();
                setIsupdated(true);
                Toast.show({
                    type: 'success',
                    position: 'top',
                    text1: 'Cập nhật thành công',
                    visibilityTime: 3000,
                    autoHide: true,
                    topOffset: 30,
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
        filename = name + Date.now() + '.' + extension;

        setUploading(true);
        setTransferred(0);

        const storageRef = storage().ref(`users/${filename}`);
        const task = storageRef.putFile(uploadUri);

        // Set transferred state
        task.on('state_changed', (taskSnapshot) => {
            console.log(
                `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
            );

            setTransferred(
                Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
                100,
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

    //Delete photto if not is default
    const deletePhoto = () => {
        if (userData.userImg != 'https://firebasestorage.googleapis.com/v0/b/lovi-fdfca.appspot.com/o/users%2Fuser.png?alt=media&token=9703fb4a-830b-4f37-9ee2-d4f2e8059178') {
            try {
                const storageRef = storage().refFromURL(userData.userImg);
                const imageRef = storage().ref(storageRef.fullPath);

                imageRef
                    .delete()
                    .then(() => {
                        console.log('DELETED')
                    })
                    .catch((e) => {
                        console.log(e);
                    });
            } catch (error) {
                console.log(error)
            }

        }
    }


    useEffect(() => {
        getUser();
    }, [isupdated]);

    renderInner = () => (
        <View style={styles.panel}>
            <View style={{ alignItems: 'center' }}>
                <Text style={styles.panelTitle}>Thay đổi ảnh đại diện</Text>
                <Text style={styles.panelSubtitle}>Bạn có thể tùy chọn cách tải lên ảnh đại diện</Text>
            </View>
            <TouchableOpacity
                style={styles.panelButton}
                onPress={takePhotoFromCamera}>
                <Text style={styles.panelButtonTitle}>Chụp ảnh</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.panelButton}
                onPress={choosePhotoFromLibrary}>
                <Text style={styles.panelButtonTitle}>Tải lên từ thư viện</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.panelButtonCancel}
                onPress={() => this.bs.current.snapTo(1)}>
                <Text style={styles.panelButtonTitle}>Hủy</Text>
            </TouchableOpacity>
        </View>
    );

    renderHeader = () => (
        <View style={styles.header}>
            <View style={styles.panelHeader}>
                <View style={styles.panelHandle} />
            </View>
        </View>
    );

    bs = React.createRef();
    fall = new Animated.Value(1);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView keyboardShouldPersistTaps='handled'>
                <View style={styles.container}>
                    <BottomSheet
                        ref={this.bs}
                        snapPoints={[330, -5]}
                        renderContent={this.renderInner}
                        renderHeader={this.renderHeader}
                        initialSnap={1}
                        callbackNode={this.fall}
                        enabledGestureInteraction={true}
                    />
                    <Toast style={{ zIndex: 5 }} ref={(ref) => Toast.setRef(ref)} />
                    <Animated.View
                        style={{
                            margin: 20,
                            opacity: Animated.add(0.1, Animated.multiply(this.fall, 1.0)),
                        }}>
                        <View style={{ alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => this.bs.current.snapTo(0)}>
                                <View
                                    style={{
                                        height: 100,
                                        width: 100,
                                        borderRadius: 15,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                    <ImageBackground
                                        source={{
                                            uri: image
                                                ? image
                                                : userData
                                                    ? userData.userImg ||
                                                    'https://lh3.googleusercontent.com/pw/ACtC-3cU8tWfrZUPCjAAdoJHql4QhxPrIYqnVcoKCsk9OJ8tn_NIVh4K7fR3Fi2GfN_s60Kbg3rW60YA0xEJnZD2SQKSkscDYfzimMMx4bp7TJR5xPGOgJUlzIV-MStubiAV4YH5Ne5oxYRuCYF_GZQu4Njt=s128-no?authuser=0'
                                                    : 'https://lh3.googleusercontent.com/pw/ACtC-3cU8tWfrZUPCjAAdoJHql4QhxPrIYqnVcoKCsk9OJ8tn_NIVh4K7fR3Fi2GfN_s60Kbg3rW60YA0xEJnZD2SQKSkscDYfzimMMx4bp7TJR5xPGOgJUlzIV-MStubiAV4YH5Ne5oxYRuCYF_GZQu4Njt=s128-no?authuser=0',
                                        }}
                                        style={{ height: 100, width: 100 }}
                                        imageStyle={{ borderRadius: 15 }}>
                                        <View
                                            style={{
                                                flex: 1,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}>
                                            <MaterialCommunityIcons
                                                name="camera"
                                                size={35}
                                                color="#fff"
                                                style={{
                                                    opacity: 0.6,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderWidth: 1,
                                                    borderColor: '#fff',
                                                    borderRadius: 10,
                                                }}
                                            />
                                        </View>
                                    </ImageBackground>
                                </View>
                            </TouchableOpacity>

                            {/* <Text style={{ marginTop: 10, fontSize: 18, fontWeight: 'bold' }}>
                                {userData ? userData.name : ''}
                            </Text> */}
                            <Text style={{ marginVertical: 10, fontSize: 18, fontWeight: 'bold' }}>
                                {user.email ? user.email : userData.name}
                            </Text>

                            <View style={styles.userBtnWrapper}>
                                <TouchableOpacity style={styles.userBtn} onPress={() => {
                                    Clipboard.setString(user.uid);
                                    Toast.show({
                                        type: 'success',
                                        position: 'top',
                                        text1: 'Đã copy',
                                        visibilityTime: 2000,
                                        autoHide: true,
                                        topOffset: 20,
                                        bottomOffset: 40,
                                    });
                                }
                                }>
                                    <Text style={styles.userBtnTxt}>Sao chép ID của bạn</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.action}>
                            <FontAwesome name="user-o" color="#333333" size={20} />
                            <TextInput
                                placeholder="Tên của bạn"
                                placeholderTextColor="#aaaaaa"
                                value={userData ? userData.name : ''}
                                onChangeText={(txt) => setUserData({ ...userData, name: txt })}
                                autoCorrect={false}
                                style={styles.textInput}
                            />
                        </View>
                        <View style={styles.action}>
                            <Ionicons name="ios-clipboard-outline" color="#333333" size={20} />
                            <TextInput
                                multiline
                                numberOfLines={3}
                                placeholder="Giới thiệu"
                                placeholderTextColor="#aaaaaa"
                                value={userData ? userData.aboutme : ''}
                                onChangeText={(txt) => setUserData({ ...userData, aboutme: txt })}
                                autoCorrect={true}
                                style={[styles.textInput, { height: 40 }]}
                            />
                        </View>
                        <View style={styles.action}>
                            <Feather name="phone" color="#333333" size={20} />
                            <TextInput
                                placeholder="Số điện thoại"
                                placeholderTextColor="#aaaaaa"
                                keyboardType="number-pad"
                                autoCorrect={false}
                                value={userData ? userData.phone : ''}
                                onChangeText={(txt) => setUserData({ ...userData, phone: txt })}
                                style={styles.textInput}
                            />
                        </View>

                        <View style={styles.action}>
                            <FontAwesome name="globe" color="#333333" size={20} />
                            <TextInput
                                placeholder="Quốc gia"
                                placeholderTextColor="#aaaaaa"
                                autoCorrect={false}
                                value={userData ? userData.country : ''}
                                onChangeText={(txt) => setUserData({ ...userData, country: txt })}
                                style={styles.textInput}
                            />
                        </View>
                        <View style={styles.action}>
                            <MaterialCommunityIcons
                                name="map-marker-outline"
                                color="#333333"
                                size={20}
                            />
                            <TextInput
                                placeholder="Thành phố"
                                placeholderTextColor="#aaaaaa"
                                autoCorrect={false}
                                value={userData ? userData.city : ''}
                                onChangeText={(txt) => setUserData({ ...userData, city: txt })}
                                style={styles.textInput}
                            />
                        </View>
                        <FormButton buttonTitle={uploading ? "Vui lòng chờ ..." : "Cập nhật"} onPress={handleUpdate} />
                    </Animated.View>
                </View>
            </ScrollView>
        </SafeAreaView>

    );
}

export default EditProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    commandButton: {
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#FF6347',
        alignItems: 'center',
        marginTop: 10,
    },
    panel: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        paddingTop: 20,
        width: '100%',
    },
    header: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#333333',
        shadowOffset: { width: -1, height: -3 },
        shadowRadius: 2,
        shadowOpacity: 0.4,
        paddingTop: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    panelHeader: {
        alignItems: 'center',
    },
    panelHandle: {
        width: 40,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#00000040',
        marginBottom: 10,
    },
    panelTitle: {
        fontSize: 27,
        height: 35,
    },
    panelSubtitle: {
        fontSize: 14,
        color: 'gray',
        height: 30,
        marginBottom: 10,
    },
    panelButton: {
        padding: 13,
        borderRadius: 10,
        backgroundColor: '#2e64e5',
        alignItems: 'center',
        marginVertical: 7,
    },
    panelButtonCancel: {
        padding: 13,
        borderRadius: 10,
        backgroundColor: '#eb1330',
        alignItems: 'center',
        marginVertical: 7,
    },
    panelButtonTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white',
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5,
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5,
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#333333',
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
});
