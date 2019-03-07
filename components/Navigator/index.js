import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import loadingScreen from '../../screens/LoadingScreen';
import loggedInScreen from './bottomTabNavigator';
import loginScreen from '../../screens/Login';
// import loggedOutScreen from '../../screens/Login';


const AppNavigator = createSwitchNavigator({
    loadingScreen,
    loginScreen,
    // Register,
    loggedInScreen
},
    {
        initialRouteName: 'loadingScreen',
    });

export default createAppContainer(AppNavigator);