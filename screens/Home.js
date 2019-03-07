import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Container, Header, Body, Title } from 'native-base';

class HomeScreen extends Component {
    render() {
        return (
            <Container>
                <Header>
                    <Body>
                        <Title>truckRoute</Title>
                    </Body>
                </Header>
                <View style={{ flex: 1, top: '2%', marginLeft: 5, marginRight: 5 }}>
                    <Text style={{ marginBottom: 10 }}>Home page</Text>
                </View>
            </Container>
        )
    }
}

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textInput: {
        height: 40,
        width: 300,
        borderWidth: 1,
        paddingHorizontal: 16,
    },
    inputWrapper: {
        marginTop: 80,
        flexDirection: 'row'
    },
});