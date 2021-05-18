//Function login register ...
import React, { createContext, useState } from 'react'
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-community/google-signin';
import firestore from '@react-native-firebase/firestore';
import { ToastAndroid, Keyboard } from 'react-native';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = React.useState(null);
    const [check, setCheck] = useState(false);

    const checkExsit = async (uid) => {
        await firestore()
            .collection('USERS')
            .doc(uid)
            .get()
            .then((documentSnapshot) => {
                if (documentSnapshot.exists) {
                    // console.log('User Data', documentSnapshot.data());
                    setCheck(true);
                }
            })
            .catch((e) => {
                console.log(e);
            })
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                login: async (email, password) => {

                    try {
                        await auth().signInWithEmailAndPassword(email, password).then(() => {
                            checkExsit(auth().currentUser.uid);
                            if (check) {
                                console.log('tao moi')
                                // firestore()
                                //     .collection('USERS')
                                //     .get()
                                //     .then(querySnapshot => {
                                //         firestore()
                                //             .collection('USERS')
                                //             .doc(auth().currentUser.uid)
                                //             .set({
                                //                 name: 'user_' + (querySnapshot.size + 1).toString(),
                                //                 phone: '',
                                //                 country: 'Việt Nam',
                                //                 aboutme: '',
                                //                 city: '',
                                //                 userImg: 'https://firebasestorage.googleapis.com/v0/b/lovi-fdfca.appspot.com/o/users%2Fuser.png?alt=media&token=9703fb4a-830b-4f37-9ee2-d4f2e8059178'
                                //             })
                                //             .catch((e) => {
                                //                 console.log(e);
                                //             })
                                //         ToastAndroid.show("Đăng nhập thành công", ToastAndroid.LONG);
                                //     });
                            } else {
                                console.log('da co');
                            }
                            ToastAndroid.show("Đăng nhập thành công", ToastAndroid.LONG);
                        });

                    } catch (error) {
                        Keyboard.dismiss();
                        if (error.code == 'auth/invalid-email')
                            ToastAndroid.show("Email không hợp lệ", ToastAndroid.LONG);
                        else if (error.code == 'auth/wrong-password')
                            ToastAndroid.show("Sai mật khẩu", ToastAndroid.LONG);
                        else if (error.code == 'auth/user-disabled')
                            ToastAndroid.show("Tài khoản bị khóa", ToastAndroid.LONG);
                        else if (error.code == 'auth/user-not-found')
                            ToastAndroid.show("Email không tồn tại", ToastAndroid.LONG);
                        else
                            ToastAndroid.show(error.message, ToastAndroid.LONG);
                    }
                },
                googleLogin: async () => {
                    // Get the users ID token

                    const { idToken } = await GoogleSignin.signIn();

                    // Create a Google credential with the token
                    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

                    // Sign-in the user with the credential
                    return auth().signInWithCredential(googleCredential).then(() => {
                        checkExsit(auth().currentUser.uid);
                        if (check) {
                            console.log('tao moi')
                            firestore()
                                .collection('USERS')
                                .get()
                                .then(querySnapshot => {
                                    firestore()
                                        .collection('USERS')
                                        .doc(auth().currentUser.uid)
                                        .set({
                                            name: auth().currentUser.displayName,
                                            phone: auth().currentUser.phoneNumber,
                                            country: 'Việt Nam',
                                            aboutme: '',
                                            city: '',
                                            userImg: auth().currentUser.photoURL
                                        })
                                        .catch((e) => {
                                            console.log(e);
                                        })
                                });
                        } else {
                            console.log('da co');
                        }
                        ToastAndroid.show("Đăng nhập thành công", ToastAndroid.LONG);
                    });
                },
                register: async (email, password) => {
                    try {
                        await auth().createUserWithEmailAndPassword(email, password).then(() => {
                            checkExsit(auth().currentUser.uid);
                            if (check) {
                                console.log('tao moi')
                                firestore()
                                    .collection('USERS')
                                    .get()
                                    .then(querySnapshot => {
                                        firestore()
                                            .collection('USERS')
                                            .doc(auth().currentUser.uid)
                                            .set({
                                                name: 'user_' + (querySnapshot.size + 1).toString(),
                                                phone: '',
                                                country: 'Việt Nam',
                                                aboutme: '',
                                                city: '',
                                                userImg: 'https://firebasestorage.googleapis.com/v0/b/lovi-fdfca.appspot.com/o/users%2Fuser.png?alt=media&token=9703fb4a-830b-4f37-9ee2-d4f2e8059178'
                                            })
                                            .catch((e) => {
                                                console.log(e);
                                            })

                                    });
                            } else {
                                console.log('da co');
                            }
                        });
                    } catch (error) {
                        if (error.code == 'auth/invalid-email')
                            ToastAndroid.show("Email không hợp lệ", ToastAndroid.LONG);
                        else if (error.code == 'auth/email-already-in-use')
                            ToastAndroid.show("Email đã được sử dụng", ToastAndroid.LONG);
                        else if (error.code == 'auth/weak-password')
                            ToastAndroid.show("Mật khẩu phải dài ít nhất 6 kí tự", ToastAndroid.LONG);
                        else
                            ToastAndroid.show(error.message, ToastAndroid.LONG);
                    }
                },
                logout: async () => {
                    try {
                        await auth().signOut();
                    } catch (error) {
                        console.log(error);
                    }
                },
                forgotpassword: async (email) => {
                    try {
                        await auth().sendPasswordResetEmail(email);
                        Keyboard.dismiss();
                    } catch (error) {
                        if (error.code == 'auth/invalid-email')
                            ToastAndroid.show("Email không đúng", ToastAndroid.LONG);
                        else if (error.code == 'auth/user-not-found')
                            ToastAndroid.show("Email không tồn tại", ToastAndroid.LONG);
                        else if (error.code == 'auth/user-disabled')
                            ToastAndroid.show("Tài khoản bị khóa", ToastAndroid.LONG);
                        else
                            ToastAndroid.show(error.message, ToastAndroid.LONG);
                    }
                }
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}