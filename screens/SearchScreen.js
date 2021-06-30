import React, { useContext, useEffect, useState } from 'react';
import { View, Image, StyleSheet, TextInput, TouchableOpacity, Text, ActivityIndicator, SafeAreaView, FlatList } from 'react-native';
import { AuthContext } from '../navigation/AuthProvider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import { Container } from '../styles/MessageStyles';
import ProfileCard from '../components/ProfileCard';
import LottieView from 'lottie-react-native';
import { windowWidth } from '../utils/Dimentions';

const SearchScreen = ({ navigation }) => {
    const { user } = useContext(AuthContext);
    const [name, setName] = useState(null);
    const [listuser, setListuser] = useState([]);
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState("Vui lòng nhập tên bạn muốn tìm kiếm tin nhắn");

    function formatString(str) {
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        str = str.replace(/Đ/g, "D");
        // Some system encode vietnamese combining accent as individual utf-8 characters
        // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
        str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
        // Remove extra spaces
        // Bỏ các khoảng trắng liền nhau
        str = str.replace(/ + /g, " ");
        str = str.trim();
        // Remove punctuations
        // Bỏ dấu câu, kí tự đặc biệt
        str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
        return str;
    }

    const handleSearch = async (namee) => {
        namee = formatString(namee);
        setLoading(true);
        if (namee != "") {
            var list = [];
            const currentUser = await firestore()
                .collection('USERS')
                .get()
                .then((querySnapshot) => {
                    //console.log('Total Posts: ', querySnapshot.size);
                    querySnapshot.forEach((doc) => {
                        var getname = doc.data().name;
                        getname = formatString(getname);
                        if (getname.toLowerCase().includes(namee.toLowerCase()) || namee == doc.id) {
                            const { aboutme, city, country, name, phone, userImg } = doc.data();
                            
                            list.push({
                                id: doc.id,
                                aboutme,
                                city,
                                country,
                                name,
                                phone,
                                userImg
                            });
                        }
                    });
                    setListuser(list);

                    if (list.length <= 0)
                        setNotification("Không tìm thấy kết quả");
                    else
                        setNotification("Kết quả tìm kiếm");
                })
                .catch((e) => {
                    console.log(e);
                })
        }
        else {
            setListuser(null);
            setNotification("Vui lòng nhập tên bạn muốn tìm kiếm tin nhắn");
        }
        setLoading(false);
    }

    const handlePress = async (uid) => {
        var check = 0;
        var threadid
        await firestore()
            .collection('MESSAGETHREADS')
            .where('users.id1', '==', uid)
            .where('users.id2', '==', user.uid)
            .get()
            .then(querySnapshot => {
                if (querySnapshot.size > 0) {
                    check = check + 1;
                    querySnapshot.forEach(documentSnapshot => {
                        threadid = documentSnapshot.id;
                    });
                }
            })

        await firestore()
            .collection('MESSAGETHREADS')
            .where('users.id2', '==', uid)
            .where('users.id1', '==', user.uid)
            .get()
            .then(querySnapshot => {
                if (querySnapshot.size > 0) {
                    check = check + 1;
                    querySnapshot.forEach(documentSnapshot => {
                        threadid = documentSnapshot.id;
                    });
                }
            })

            if (check == 1){
            navigation.navigate('Chat', { userId: uid, threadId: threadid })
        }
        else {
            navigation.navigate('AddNewMessage', {uid: uid})
        }
    }

    const setHeader = () => {
        navigation.setOptions({
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: '#f6f6f6',
                shadowColor: '#f6f6f6',
                elevation: 0,
            },
            headerLeft: () => (
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={25} color="#2e64e5" />
                    </TouchableOpacity>
                    <TextInput style={styles.input}
                        placeholder='Nhập tên'
                        autoFocus={true}
                        value={name}
                        onChangeText={(name) => { setName(name), handleSearch(name) }}
                    />
                </View>
            ),
        });
    }

    useEffect(() => {
        setHeader();
    }, [])

    return (
        <Container>
            {loading ? (
                <LottieView style={{height: 200}} source={require('../assets/splash/65210-loading-colour-dots.json')} autoPlay speed={1.5}/>
            ) : (
                <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                    {notification ? (
                        <Text style={styles.text}>
                            {notification} <Text style={{ fontWeight: 'bold'}}>{name}</Text>
                        </Text>
                    ) : null}
                    <FlatList
                        data={listuser}
                        keyExtractor={(item) => item.id}
                        keyboardShouldPersistTaps='handled'
                        renderItem={({ item }) => (
                            <ProfileCard
                                item={item}
                                onPress={() => handlePress(item.id)}
                            />
                        )}
                    />
                </SafeAreaView>
            )}
        </Container>
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
    input: {
        fontSize: 18,
        marginHorizontal: 10,
        width: windowWidth - 80,
        fontFamily: 'Lato-Regular',
        color: '#333',
        paddingRight: 20,
    },
    text: {
        textAlign: 'center',
        fontSize: 12,
        fontFamily: 'Lato-Regular',
        color: '#333',
        marginTop: 15,
    },
    header: {
        marginLeft: 20,
        flexDirection: 'row',
        alignItems: 'center',
    }
});