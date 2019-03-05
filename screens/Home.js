import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, ActivityIndicator} from 'react-native';
import { Container, Content, Header, Left, Right, Body, Title, Icon, Button} from 'native-base';
import MapsAutocomplete from '../components/MapsAutocomplete.js';
import { Constants } from 'expo';
import { GoogleAutoComplete } from 'react-native-google-autocomplete';
import LocationItem from '../components/LocationItem';

class HomeScreen extends Component {
    render() {
        console.log(Constants.manifest.ios.config.googleMapsApiKey)
        return (
            <Container>
                <Header>
                    <Body>
                        <Title>truckRoute</Title>
                    </Body>
                </Header>
                <View style={{ flex: 1, top: '2%', marginLeft: 5, marginRight: 5 }}>
                    <Text style={{ marginBottom: 10 }}>Here you can bla bla bla</Text>

                    <GoogleAutoComplete apiKey={Constants.manifest.ios.config.googleMapsApiKey} debounce={500} minLength={2}>
                        {({
                            handleTextChange,
                            locationResults,
                            fetchDetails,
                            isSearching,
                            inputValue,
                            clearSearches
                        }) => (
                                <React.Fragment>
                                    <View style={styles.inputWrapper}>
                                        <TextInput
                                            style={styles.textInput}
                                            placeholder="Origin"
                                            onChangeText={handleTextChange}
                                            value={inputValue}
                                        />
                                        <Button title="Clear" onPress={clearSearches} />
                                    </View>
                                    {isSearching && <ActivityIndicator size="large" color="red" />}
                                    <ScrollView>
                                        {locationResults.map(el => (
                                            <LocationItem
                                                {...el}
                                                key={el.id}
                                                fetchDetails={fetchDetails}
                                            />
                                        ))}
                                    </ScrollView>
                                </React.Fragment>
                            )}
                    </GoogleAutoComplete>
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