import React from 'react';
import { View, Text } from 'react-native';
import { isLoggedIn } from "../app/auth";

class LoadingScreen extends React.Component {
    performTimeConsumingTask = async () => {
        return new Promise((resolve) =>
            setTimeout(
                () => { resolve('result') },
                2000
            )
        )
    }

    componentDidMount() {
        isLoggedIn().then((state) => {
            console.log('loggedin', state)
            if (state) {
                this.props.navigation.navigate('Home')
            } else {
                this.props.navigation.navigate('loginScreen')
            }
        })

    }

    render() {
        return (
            <View style={styles.viewStyles}>
                <Text style={styles.textStyles}>
                    Loading . . .
                </Text>
            </View>
        );
    }
}

const styles = {
    viewStyles: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'orange'
    },
    textStyles: {
        color: 'white',
        fontSize: 40,
        fontWeight: 'bold'
    }
}

export default LoadingScreen;