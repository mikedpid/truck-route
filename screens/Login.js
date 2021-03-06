import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { Container, Header, Body, Title } from 'native-base';
import LoginForm from '../components/LoginForm';
import { loginWithAuth0 } from '../app/auth'

export default ({ navigation }) => {
    let username = '', password = '';

    const onChangeUsername = (value) => {
        username = value;
    }

    const onChangePassword = (value) => {
        password = value;
    }

    const redirectToRegister = () => {
        navigation.navigate('registerScreen')
    }

    return (
        <Container>
            <Header>
                <Body>
                    <Title>truckRoute</Title>
                </Body>
            </Header>
            <View style={styles.formContainer}>
                <LoginForm onChangeUsername={onChangeUsername}
                           onChangePassword={onChangePassword}
                           onLogin={
                                () => { 
                                    loginWithAuth0(username, password)
                                        .then((data) => {
                                            navigation.navigate('Home') 
                                        })
                                        .catch(error => {
                                            console.log(error.message)
                                            Alert.alert('Oops', error.message)
                                        })
                                }
                            }>
                </LoginForm>
                <TouchableOpacity onPress={redirectToRegister} >
                    <Text style={styles.textCenter}>Don't have an account? Register one right now!</Text>
                </TouchableOpacity>
            </View>
        </Container>
    )
};

const styles = StyleSheet.create({
    formContainer: {
        // flex: 1,
        // justifyContent: 'center',
    },
    textCenter: {
        textAlign: 'center'
    }
})