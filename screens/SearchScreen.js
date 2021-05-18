import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import FormButton from '../components/FormButton';


const SearchScreen = () => {

    const handleNoti = () =>{
        
    }
    return (
        <View style={{ flex: 1, backgroundColor: '#F6E8D8', paddingBottom: 140 }}>
            <FormButton
                buttonTitle="Nhan thong bao"
                onPress={() => { handleNoti() }}
            />
        </View>
    );
}

export default SearchScreen;

const styles = StyleSheet.create({
    logo: {
        alignSelf: 'center',
        marginTop: 100,
        height: 150,
        width: 150,
    },
});