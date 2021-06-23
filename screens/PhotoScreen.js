import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ToastAndroid, PermissionsAndroid, Platform } from 'react-native';
import ProgressiveImage from '../components/ProgressiveImage';
import { windowHeight, windowWidth } from '../utils/Dimentions';
import ImageZoom from 'react-native-image-pan-zoom';
import RBSheet from "react-native-raw-bottom-sheet";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Clipboard from '@react-native-clipboard/clipboard';
import Share from 'react-native-share';
import CameraRoll from '@react-native-community/cameraroll';
import RNFetchBlob from 'rn-fetch-blob';

const PhotoScreen = ({ navigation, route }) => {
    const refRBSheet = useRef();

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={shareImage}>
                        <Ionicons name="share-social-outline" size={25} color="#2e64e5" />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginHorizontal: 25 }} onPress={() => refRBSheet.current.open()}>
                        <Ionicons name="download-outline" size={25} color="#2e64e5" />
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [])

    const shareImage = async () => {
        try {
            let imagePath = null;
            await RNFetchBlob.config({
                fileCache: true,
                appendExt: 'jpg',
            })
                .fetch('GET', route.params.postImg)
                .then(resp => {
                    imagePath = resp.path();
                    return resp.readFile("base64");
                })
                .then(async base64Data => {
                    var base64Data = `data:image/png;base64,` + base64Data;
                    // here's base64 encoded image
                    await Share.open({ url: base64Data });
                    // remove the file from storage
                    return RNFetchBlob.fs.unlink(imagePath);
                })
                .catch(error => {
                    console.log(error);
                });
            
            // const shareResponse = await Share.open({ url: imgbase64 });
        } catch (error) {
            console.log(error);
            ToastAndroid.show("Đã có lỗi!", ToastAndroid.SHORT)
        }
    }

    getPermissionAndroid = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: 'Image Download Permission',
                    message: 'Your permission is required to save images to your device',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                return true;
            }
        } catch (err) {
            console.log(err);
            ToastAndroid.show("Lưu không thành công!", ToastAndroid.SHORT)
        }
    };

    handleDownload = async () => {
        // if device is android you have to ensure you have permission
        if (Platform.OS === 'android') {
            const granted = await getPermissionAndroid();
            if (!granted) {
                return;
            }
        }

        RNFetchBlob.config({
            fileCache: true,
            appendExt: 'jpg',
        })
            .fetch('GET', route.params.postImg)
            .then(res => {
                CameraRoll.save(res.data, ['photo', 'LoviApp'])
                    .then(() => {
                        ToastAndroid.show("Đã lưu thành công", ToastAndroid.SHORT);
                    })
                    .catch(err => {
                        console.log(err);
                        ToastAndroid.show("Không thể lưu", ToastAndroid.SHORT);
                    })
            })
            .catch(error => {
                console.log(error);
                ToastAndroid.show("Lưu thất bại", ToastAndroid.SHORT);
            });
    };

    return (
        <View style={styles.container}>
            { route.params.isAva ? (
                <ImageZoom
                    cropWidth={windowWidth}
                    cropHeight={windowHeight}
                    imageWidth={windowWidth}
                    imageHeight={400}>
                    <ProgressiveImage
                        defaultImageSource={require('../assets/default-img.jpg')}
                        source={{ uri: route.params.postImg }}
                        style={{ width: '100%', height: 400 }}
                        resizeMode="cover"
                    />
                </ImageZoom>
            )
                : (
                    <ImageZoom
                        cropWidth={windowWidth}
                        cropHeight={windowHeight}
                        imageWidth={windowWidth}
                        imageHeight={267}>
                        <ProgressiveImage
                            defaultImageSource={require('../assets/default-img.jpg')}
                            source={{ uri: route.params.postImg }}
                            style={{ width: '100%', height: 267 }}
                            resizeMode="cover"
                        />
                    </ImageZoom>
                )}
            <RBSheet
                ref={refRBSheet}
                closeOnDragDown={false}
                closeOnPressMask={true}
                closeOnPressBack={true}
                height={210}
                animationType="slide"
                customStyles={{
                    wrapper: {
                        backgroundColor: "transparent"
                    },
                }}
            >
                <View>
                    <TouchableOpacity style={styles.bottomSheet} onPress={handleDownload}>
                        <Ionicons name="download-outline" size={28} color="#2e64e5" />
                        <Text style={styles.text}>Lưu về điện thoại</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.bottomSheet} onPress={() => {
                        Clipboard.setString(route.params.postImg);
                        refRBSheet.current.close()
                        ToastAndroid.show("Đã sao chép liên kết", ToastAndroid.SHORT);
                    }}>
                        <Ionicons name="copy-outline" size={28} color="#2e64e5" />
                        <Text style={styles.text}>Sao chép liên kết</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.bottomSheet} onPress={shareImage}>
                        <Ionicons name="share-social-outline" size={28} color="#2e64e5" />
                        <Text style={styles.text}>Chia sẻ</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.bottomSheet}>
                        <Ionicons name="alert-circle-outline" size={28} color="#2e64e5" />
                        <Text style={styles.text}>Báo cáo</Text>
                    </TouchableOpacity>
                </View>
            </RBSheet>
        </View>
    );
}

export default PhotoScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000',
        flex: 1,
        justifyContent: 'center',
        paddingBottom: 75,
    },
    text: {
        fontSize: 15,
        color: '#333333',
        paddingHorizontal: 15,
    },
    bottomSheet: {
        paddingHorizontal: 15,
        marginVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%'
    }
});