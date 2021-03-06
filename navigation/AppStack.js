import React from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AddPostScreen from '../screens/AddPostScreen';
import MessagesScreen from '../screens/MessagesScreen';
import SplashScreen from '../screens/SplashScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import PhotoScreen from '../screens/PhotoScreen';
import { UserImg, UserInfo, UserInfoText, UserName } from '../styles/FeedStyles';
import AddNewMessageScreen from '../screens/AddNewMessageScreen';
import SearchScreen from '../screens/SearchScreen';
import SearchProfileScreen from '../screens/SearchProfileScreen';
import CommentScreen from '../screens/CommentScreen';
import NotifyScreen from '../screens/NotifyScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const FeedStack = ({ navigation }) => (
    <Stack.Navigator>
        <Stack.Screen
            name="Lovi App"
            component={HomeScreen}
            options={{
                title: '',
            }}
        />
        <Stack.Screen
            name="AddPost"
            component={AddPostScreen}
            options={{
                title: '',
                headerTitleAlign: 'center',
                headerStyle: {
                    backgroundColor: '#2e64e515',
                    shadowColor: '#2e64e515',
                    elevation: 0,
                },
                headerBackTitleVisible: false,
                headerBackImage: () => (
                    <View style={{ marginLeft: 15 }}>
                        <Ionicons name="arrow-back" size={25} color="#2e64e5" />
                    </View>
                ),
            }}
        />
        <Stack.Screen
            name="HomeProfile"
            component={ProfileScreen}
            options={{
                title: '',
                headerTitleAlign: 'center',
                headerStyle: {
                    backgroundColor: '#fff',
                    shadowColor: '#fff',
                    elevation: 0,
                },
                headerBackTitleVisible: false,
                headerBackImage: () => (
                    <View style={{ marginLeft: 15 }}>
                        <Ionicons name="arrow-back" size={25} color="#2e64e5" />
                    </View>
                ),
            }}
        />
        <Stack.Screen
            name="Photo"
            component={PhotoScreen}
            options={{
                title: '',
                headerTitleAlign: 'center',
                headerStyle: {
                    backgroundColor: '#000',
                    shadowColor: '#fff',
                    elevation: 0,
                },
                headerBackTitleVisible: false,
                headerBackImage: () => (
                    <View style={{ marginLeft: 15 }}>
                        <Ionicons name="arrow-back" size={25} color="#2e64e5" />
                    </View>
                ),
            }}
        />
        <Stack.Screen
            name="AddNewMessage"
            component={AddNewMessageScreen}
            options={() => ({
                headerTitleAlign: 'center',
                headerStyle: {
                    backgroundColor: '#fff',
                    shadowColor: '#fff',
                    elevation: 0,
                },
                title: 'Th??m m???i tin nh???n',
                headerBackTitleVisible: false,
            })}
        />
        <Stack.Screen
            name="SearchProfile"
            component={SearchProfileScreen}
            options={{
                title: '',
                headerBackTitleVisible: false,
            }}
        />
        <Stack.Screen
            name="Chat"
            component={ChatScreen}
            options={({ route }) => ({
                title: '',
                headerBackTitleVisible: false,
                headerRight: () => (
                    <View style={{
                        flexDirection: "row", justifyContent: "space-between", width: 80, marginRight: 20,
                    }}>
                        <TouchableOpacity>
                            <Ionicons name="videocam" size={24} color="#2e64e5" />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Ionicons name="call" size={24} color="#2e64e5" />
                        </TouchableOpacity>
                    </View>
                )
            })}
        />
        <Stack.Screen
            name="Comment"
            component={CommentScreen}
            options={{
                title: 'B??nh lu???n',
                headerTitleAlign: 'center',
                headerStyle: {
                    backgroundColor: '#f6f6f6',
                    shadowColor: '#fff',
                    elevation: 0,
                },
                headerBackTitleVisible: false,
                headerBackImage: () => (
                    <View style={{ marginLeft: 15 }}>
                        <Ionicons name="arrow-back" size={25} color="#2e64e5" />
                    </View>
                ),
            }}
        />
        <Stack.Screen
            name="Notify"
            component={NotifyScreen}
            options={{
                title: 'Th??ng b??o c???a b???n',
                headerTitleAlign: 'center',
                headerStyle: {
                    backgroundColor: '#fff',
                    shadowColor: '#fff',
                    elevation: 0,
                },
                headerBackTitleVisible: false,
                headerBackImage: () => (
                    <View style={{ marginLeft: 15 }}>
                        <Ionicons name="arrow-back" size={25} color="#2e64e5" />
                    </View>
                ),
            }}
        />
    </Stack.Navigator>
);

const MessageStack = ({ navigation }) => (
    <Stack.Navigator>
        <Stack.Screen
            name="Messages"
            component={MessagesScreen}
            options={{
                title: '',
                headerTitleAlign: 'center',
                headerBackTitleVisible: false,
                headerRight: () => (
                    <View style={{
                        flexDirection: "row", justifyContent: "space-between", width: 80, marginRight: 20,
                    }}>
                        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
                            <Ionicons name="search-outline" size={24} color="#2e64e5" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('AddNewMessage')}>
                            <Ionicons name="person-add" size={24} color="#2e64e5" />
                        </TouchableOpacity>
                    </View>
                )
            }}
        />
        <Stack.Screen
            name="Chat"
            component={ChatScreen}
            options={({ route }) => ({
                title: '',
                headerBackTitleVisible: false,
                headerRight: () => (
                    <View style={{
                        flexDirection: "row", justifyContent: "space-between", width: 80, marginRight: 20,
                    }}>
                        <TouchableOpacity>
                            <Ionicons name="videocam-outline" size={24} color="#2e64e5" />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Ionicons name="call-outline" size={24} color="#2e64e5" />
                        </TouchableOpacity>
                    </View>
                )
            })}
        />
        <Stack.Screen
            name="AddNewMessage"
            component={AddNewMessageScreen}
            options={(route) => ({
                title: route.params ? route.params.name : 'Th??m m???i tin nh???n',
                headerStyle: {
                    backgroundColor: '#f6f6f6',
                    shadowColor: '#f6f6f6',
                    elevation: 0,
                },
                headerBackImage: () => (
                    <View style={{ marginLeft: 15 }}>
                        <Ionicons name="arrow-back" size={25} color="#2e64e5" />
                    </View>
                ),
                headerBackTitleVisible: false,
            })}
        />
        <Stack.Screen
            name="Search"
            component={SearchScreen}
            options={{
                title: '',
                headerBackTitleVisible: false,
            }}
        />
        <Stack.Screen
            name="MessageProfile"
            component={ProfileScreen}
            options={{
                title: '',
                headerTitleAlign: 'center',
                headerStyle: {
                    backgroundColor: '#fff',
                    shadowColor: '#fff',
                    elevation: 0,
                },
                headerBackTitleVisible: false,
                headerBackImage: () => (
                    <View style={{ marginLeft: 15 }}>
                        <Ionicons name="arrow-back" size={25} color="#2e64e5" />
                    </View>
                ),
            }}
        />
    </Stack.Navigator>
);

const ProfileStack = ({ navigation }) => (
    <Stack.Navigator>
        <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
                headerShown: false,
            }}
        />
        <Stack.Screen
            name="EditProfile"
            component={EditProfileScreen}
            options={{
                headerTitle: 'Ch???nh s???a h??? s??',
                headerBackTitleVisible: false,
                headerTitleAlign: 'center',
                headerStyle: {
                    backgroundColor: '#fff',
                    shadowColor: '#fff',
                    elevation: 0,
                },
            }}
        />
        <Stack.Screen
            name="Photo"
            component={PhotoScreen}
            options={{
                title: '',
                headerTitleAlign: 'center',
                headerStyle: {
                    backgroundColor: '#000',
                    shadowColor: '#fff',
                    elevation: 0,
                },
                headerBackTitleVisible: false,
                headerBackImage: () => (
                    <View style={{ marginLeft: 15 }}>
                        <Ionicons name="arrow-back" size={25} color="#2e64e5" />
                    </View>
                ),
                headerRight: () => (
                    <View style={{ marginRight: 25 }}>
                        <TouchableOpacity>
                            <Ionicons name="download-outline" size={25} color="#2e64e5" />
                        </TouchableOpacity>
                    </View>
                )
            }}
        />
        <Stack.Screen
            name="Comment"
            component={CommentScreen}
            options={{
                title: 'B??nh lu???n',
                headerTitleAlign: 'center',
                headerStyle: {
                    backgroundColor: '#f6f6f6',
                    shadowColor: '#fff',
                    elevation: 0,
                },
                headerBackTitleVisible: false,
                headerBackImage: () => (
                    <View style={{ marginLeft: 15 }}>
                        <Ionicons name="arrow-back" size={25} color="#2e64e5" />
                    </View>
                ),
            }}
        />
    </Stack.Navigator>
);


const AppStack = () => {
    const getTabBarVisibility = (route) => {
        if (getFocusedRouteNameFromRoute(route) === 'Chat') {
            return false;
        }
        else if (getFocusedRouteNameFromRoute(route) === 'Photo') {
            return false;
        }
        else if (getFocusedRouteNameFromRoute(route) === 'Comment') {
            return false;
        }
        return true;
    };


    return (
        <Tab.Navigator
            initialRouteName='Home'
            tabBarOptions={{
                activeTintColor: '#2e64e5',
            }}
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } 
                    else if (route.name === 'Messages') {
                        iconName = focused ? 'chatbox-ellipses' : 'chatbox-ellipses-outline';
                    }
                    else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}>
            <Tab.Screen
                name="Home"
                component={FeedStack}
                options={({ route }) => ({
                    tabBarVisible: getTabBarVisibility(route),
                    tabBarLabel: 'Trang ch???',
                    // tabBarVisible: route.state && route.state.index === 0,
                    // tabBarIcon: ({ color, size }) => (
                    //     <MaterialCommunityIcons
                    //         name="home-outline"
                    //         color={color}
                    //         size={size}
                    //     />
                    // ),
                })}
            />
            <Tab.Screen
                name="Messages"
                component={MessageStack}
                options={({ route }) => ({
                    tabBarVisible: getTabBarVisibility(route),
                    // Or Hide tabbar when push!
                    // https://github.com/react-navigation/react-navigation/issues/7677
                    // tabBarVisible: route.state && route.state.index === 0,
                    tabBarLabel: 'Tin nh???n',
                    // tabBarIcon: ({ color, size }) => (
                    //     <Ionicons
                    //         name="chatbox-ellipses-outline"
                    //         color={color}
                    //         size={size}
                    //     />
                    // ),
                })}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileStack}
                options={({ route }) => ({
                    tabBarVisible: getTabBarVisibility(route),
                    tabBarLabel: 'H??? s??',
                    // tabBarIcon: ({ color, size }) => (
                    //     <Ionicons name="person-outline" color={color} size={size} />
                    // ),
                })}
            />
        </Tab.Navigator>
    );
};

export default AppStack;
