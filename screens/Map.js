import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Container, Content, Header, Body, Title, Icon } from 'native-base';
import { MapView, Polyline } from 'expo';
import axios from 'axios';

class MapScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            region: {
                latitude: 1,
                longitude: 1,
                latitudeDelta: 0.003,
                longitudeDelta: 0.003,
            },
            marker: {
                latitude: 1,
                longitude: 1,
            },
            startPoint: {
                latitude: 0,
                longitude: 0
            },
            endPoint: {
                latitude: 0,
                longitude: 0
            },
            userLocation: {
                latitude: 0,
                longitude: 0
            },
            coordPoints: []
        };
        console.log(this.state)
    }

    onRegionChange = (region) => {
        this.setState({
            region,
            marker: {
                latitude: region.latitude,
                longitude: region.longitude,
            }
        });
    }

    componentDidMount() {
        
        return this.getUserLocation().then((position) => {
            if(position) {
                this.setState({
                    region: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        latitudeDelta: 0.003,
                        longitudeDelta: 0.003,
                    },
                    marker: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    },
                    userLocation: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    }
                })
                this.getRoute(this.state.userLocation, 123).then((res) => {
                    console.log(res.pointCoords)
                    console.log(res.pointCoords.length)
                })
                console.log(this.state)
            }
        })
    }

    render() {
        let polyline = null
        let originMarker = null
        let destinationMarker = null
        if (this.state.coordPoints.length > 1) {
            // this.map.fitToCoordinates(this.state.coordPoints)
            polyline = <MapView.Polyline coordinates={this.state.coordPoints} strokeColor="#FF0000" strokeWidth={6} />
            originMarker = <MapView.Marker coordinate={this.state.coordPoints[0]} pinColor={'#000000'} />
            destinationMarker = <MapView.Marker coordinate={this.state.coordPoints[this.state.coordPoints.length -1]} />
        }

        return (
            <Container>
                <Header>
                    <Body>
                        <Title>truckRoute</Title>
                    </Body>
                </Header>
                <MapView
                    ref={map => { this.map = map; } }
                    onRegionChangeComplete={this.onRegionChange}
                    initialRegion={this.state.region}
                    region={this.state.region}
                    provider='google'
                    style={{ flex: 1 }}
                    showsUserLocation={true}
                    followsUserLocation={true}
                    showsMyLocationButton={true}
                >
                    {polyline}
                    {originMarker}
                    {destinationMarker}
                </MapView>
            </Container>
        )
    }

    getUserLocation = () => {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(position => resolve(position), err => reject(err));
        })
    }

    getRoute = (origin, destination) => {
        return new Promise((resolve, reject) => {
            origin.longitude = 47.083941
            origin.latitude = 21.885
            axios.get(`http://192.168.1.3:3000/api/v1/truck-route/${origin.longitude},${origin.latitude}/45.6637,25.512863`).then((res) => {
                this.state.coordPoints = res.data.pointCoords
                resolve(res.data)
            }).catch(err => { console.log (err)})
        })
    }

}

export default MapScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})