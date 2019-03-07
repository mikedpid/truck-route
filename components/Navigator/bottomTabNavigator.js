import React from 'react'
import { createBottomTabNavigator } from 'react-navigation';
import { Platform, StatusBar } from "react-native";
import HomeScreen from '../../screens/Home';
import MapScreen from '../../screens/Map';
import ProfileScreen from '../../screens/Profile';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default createBottomTabNavigator(
    {
        Home: {
            screen: HomeScreen,
            navigationOptions: {
                tabBarLabel: "Home",
                tabBarIcon: ({ tintColor }) => (
                    <Ionicons name="ios-home" size={20} />
                )
            },
        },
        Map: {
            screen: MapScreen,
            navigationOptions: {
                tabBarLabel: "Map",
                tabBarIcon: ({ tintColor }) => (
                    <Ionicons name="ios-compass" size={20} />
                )
            },
        },
        Profile: {
            screen: ProfileScreen,
            navigationOptions: {
                tabBarLabel: "Profile",
                tabBarIcon: ({ tintColor }) => (
                    <Ionicons name="ios-person" size={20} />
                )
            }
        }
    },
    {
        initialRouteName: 'Home',
        tabBarOptions: {
            style: {
                paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
            }
        }
    });