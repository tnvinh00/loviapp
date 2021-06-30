//Function login register ...
import React, { createContext, useState } from 'react'
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-community/google-signin';
import firestore from '@react-native-firebase/firestore';
import { ToastAndroid, Keyboard } from 'react-native';
import { LoginManager, AccessToken } from 'react-native-fbsdk';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = React.useState(null);
    const [check, setCheck] = useState(false);

    const checkExsit = (uid) => {
        firestore()
            .collection('USERS')
            .doc(uid)
            .get()
            .then((documentSnapshot) => {
                if (documentSnapshot.exists) {
                    // console.log('User Data', documentSnapshot.data());
                    setCheck(true);
                }
                else
                    setCheck(false);
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
                            } else {
                                console.log('da co');
                            }
                            ToastAndroid.showWithGravity("Đăng nhập thành công", ToastAndroid.LONG, ToastAndroid.CENTER);
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
                            console.log(error);
                    }
                },
                googleLogin: async () => {
                    // Get the users ID token
                    try {
                        const { idToken } = await GoogleSignin.signIn();

                        // Create a Google credential with the token
                        const googleCredential = auth.GoogleAuthProvider.credential(idToken);

                        // Sign-in the user with the credential
                        return auth().signInWithCredential(googleCredential).then(async () => {
                            checkExsit(auth().currentUser.uid);
                            if (check) {
                                console.log('tao moi')
                                await firestore()
                                    .collection('USERS')
                                    .get()
                                    .then(async (querySnapshot) => {
                                        await firestore()
                                            .collection('USERS')
                                            .doc(auth().currentUser.uid)
                                            .set({
                                                name: auth().currentUser.displayName,
                                                phone: auth().currentUser.phoneNumber,
                                                country: 'Việt Nam',
                                                aboutme: '',
                                                city: '',
                                                notify: 0,
                                                userImg: auth().currentUser.photoURL
                                            })
                                            .catch((e) => {
                                                console.log(e);
                                            })
                                    });
                            } else {
                                console.log('da co');
                            }
                            ToastAndroid.showWithGravity("Đăng nhập thành công", ToastAndroid.LONG, ToastAndroid.CENTER);
                        });
                    } catch (error) {
                        console.log(error);
                        if (error.code == 'auth/account-exists-with-different-credential')
                            ToastAndroid.show("Email đã được sử dụng", ToastAndroid.LONG);
                        else if (error.code == 'auth/user-disabled')
                            ToastAndroid.show("Tài khoản bị khóa", ToastAndroid.LONG);
                        else
                            console.log(error);
                    }
                },
                fbLogin: async () => {
                    try {
                        const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

                        if (result.isCancelled) {
                            throw 'User cancelled the login process';
                        }

                        const data = await AccessToken.getCurrentAccessToken();

                        if (!data) {
                            throw 'Something went wrong obtaining access token';
                        }
                        const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

                        return auth().signInWithCredential(facebookCredential).then(async () => {
                            console.log(auth().currentUser);
                            checkExsit(auth().currentUser.uid);
                            if (check) {
                                console.log('tao moi')
                                await firestore()
                                    .collection('USERS')
                                    .get()
                                    .then(async (querySnapshot) => {
                                        await firestore()
                                            .collection('USERS')
                                            .doc(auth().currentUser.uid)
                                            .set({
                                                name: auth().currentUser.displayName,
                                                phone: auth().currentUser.phoneNumber,
                                                country: 'Việt Nam',
                                                aboutme: '',
                                                city: '',
                                                notify: 0,
                                                userImg: auth().currentUser.photoURL
                                            })
                                            .catch((e) => {
                                                console.log(e);
                                            })
                                    });
                            } else {
                                console.log('da co');
                            }
                            ToastAndroid.showWithGravity("Đăng nhập thành công", ToastAndroid.LONG, ToastAndroid.CENTER);
                        })
                            .catch((error) => {
                                if (error.code == 'auth/account-exists-with-different-credential')
                                    ToastAndroid.show("Email đã được sử dụng cho tài khoản khác", ToastAndroid.LONG);
                                else if (error.code == 'auth/user-disabled')
                                    ToastAndroid.show("Tài khoản bị khóa", ToastAndroid.LONG);
                                else
                                    console.log(error);
                            })
                    } catch (error) {
                        console.log(error);

                    }
                },
                register: async (email, password) => {
                    try {
                        await auth().createUserWithEmailAndPassword(email, password).then(async() => {
                            await firestore()
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
                                            notify: 0,
                                            userImg: 'https://firebasestorage.googleapis.com/v0/b/lovi-fdfca.appspot.com/o/users%2Fuser.png?alt=media&token=9703fb4a-830b-4f37-9ee2-d4f2e8059178'
                                        })
                                        .catch((e) => {
                                            console.log(e);
                                        })

                                });
                        });
                        ToastAndroid.showWithGravity("Đăng ký thành công", ToastAndroid.LONG, ToastAndroid.CENTER);
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