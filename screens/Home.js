import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Container, Header, Body, Title } from 'native-base';
import RouteListItem from '../components/RouteListItem';

class HomeScreen extends Component {
    render() {
        return (
            <Container>
                <Header>
                    <Body>
                        <Title>truckRoute</Title>
                    </Body>
                </Header>
                <ScrollView style={{ flex: 1, top: '2%', marginLeft: 5, marginRight: 5 }}>
                    <RouteListItem origin={{ latitude: 21.88, longitude: 47.08 }} destination={{ latitude: 45.66, longitude: 25.51 }} />
                    <RouteListItem origin={{ latitude: 21.58, longitude: 45.10 }} destination={{ latitude: 45.66, longitude: 25.51 }} />
                    <RouteListItem origin={{ latitude: 47.04, longitude: 21.91 }} destination={{ latitude: 45.66, longitude: 25.51 }} />
                </ScrollView>
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