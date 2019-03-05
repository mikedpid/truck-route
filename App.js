import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';


import HomeScreen from './screens/Home';
import MapScreen from './screens/Map';

export class App extends React.Component {
  render() {
    return (
      <TabNavigator />
    );
  }
}

const TabNavigator = createBottomTabNavigator(
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
  }
);

export default createAppContainer(TabNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
