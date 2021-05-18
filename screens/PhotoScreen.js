import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ProgressiveImage from '../components/ProgressiveImage';
import { AuthContext } from '../navigation/AuthProvider';
import { windowHeight, windowWidth } from '../utils/Dimentions';
import ImageZoom from 'react-native-image-pan-zoom';

const PhotoScreen = ({ navigation, route }) => {
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
        fontSize: 20,
        color: '#333333'
    }
});