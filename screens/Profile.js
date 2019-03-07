import React, { Component } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { Container, Header, Body, Title } from 'native-base';
import LogoutForm from '../components/LogoutForm';
import { getProfileFromStorage, logout } from '../app/auth';

export default class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '^_^',
            email: '',
            avatar: 'https://facebook.github.io/react-native/docs/assets/favicon.png'
        }
    }

    componentDidMount() {
        getProfileFromStorage().then((profile) => {
            this.setState({
                name: profile.name,
                email: profile.email,
                avatar: profile.picture
            })
        })
    }

    render () {
        return (
            <Container>
                <Header>
                    <Body>
                        <Title>truckRoute</Title>
                    </Body>
                </Header>
                <View style={styles.imageContainer}>
                    <Image 
                        source={{ uri: this.state.avatar }}
                        style={styles.image}
                    />
                </View>
                <View style={styles.formContainer}>
                    <Text style={styles.textCenter}>{this.state.name}</Text>
                    <Text style={styles.textCenter}>{this.state.email}</Text>
                    <LogoutForm onLogout={() => { logout().then(() => { this.props.navigation.navigate('loginScreen') }) }}></LogoutForm>
                </View>
            </Container>
        )
    }
};

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        // justifyContent: 'center',
        top: 25
    },
    imageContainer : {
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 20,
    },
    image: {
        width: 120,
        height: 120,
        top: 30,
        borderRadius: 10
    },
    textCenter: {
        textAlign: 'center'
    }
})