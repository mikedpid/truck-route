import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Dimensions } from 'react-native';
import { Container, Content, Header, Body, Title, Icon } from 'native-base';
import { MapView } from 'expo';
import axios from 'axios';
import polyline from '@mapbox/polyline';
import geolib from 'geolib';

const {width, height} = Dimensions.get('window')
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.003
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

class MapScreen extends Component {

    constructor(props) {
        super(props)
        
        this.state = {
            region: {
                latitude: 45.94,
                longitude: 24.96,
                latitudeDelta: LATITUDE_DELTA,//0.003,
                longitudeDelta: LONGITUDE_DELTA//0.003,
            },
            marker: {
                latitude: 1,
                longitude: 1,
            },
            startPoint: props.navigation.getParam('origin') || { 'latitude': null, 'longitude': null },
            endPoint: props.navigation.getParam('destination') || { 'latitude': null, 'longitude': null },
            userLocation: {
                latitude: null,
                longitude: null
            },
            polylines: [],
            routeDistance: 0
        };

        this.watchID = null
    }

    onRegionChange = (region) => {
        // this.setState({
        //     region,
        //     marker: {
        //         latitude: region.latitude,
        //         longitude: region.longitude,
        //     }
        // });
    }

    componentDidMount() {
        return this.getUserLocation().then((position) => {
            if(position) {
                this.setState({
                    region: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    },
                    // marker: {
                    //     latitude: position.coords.latitude,
                    //     longitude: position.coords.longitude
                    // },
                    userLocation: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    }
                })
                if (this.state.startPoint.latitude && this.state.endPoint.latitude) {
                    this.getRoute(this.state.startPoint, this.state.endPoint).then((res) => {
                        // this.map.fitToElements(true)
                        console.log(res.pointCoords.length)
                        this.watchPosition()
                    })
                }

            }
        })
    }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID)
    }

    componentWillReceiveProps(nextProps) {
        const origin = nextProps.navigation.getParam('origin')
        const destination = nextProps.navigation.getParam('destination')
        if(origin && destination) {
            console.log(origin, destination)
            this.getRoute(origin, destination) //.then(() => this.map.fitToElements(true))
            this.setState({
                startPoint: { 'latitude': origin.latitude, 'longitude': origin.longitude },
                endPoint: { 'latitude': destination.latitude, 'longitude': destination.longitude }
            })
        }
    }

    componentDidUpdate() {
        console.log('componentDidUpdate')
    }

    render() {
        let polyline = null
        let originMarker = null
        let destinationMarker = null
        if (this.state.polylines.length > 1) {
            console.log('polylineeee')
            // this.map.fitToCoordinates(this.state.polylines)
            polyline = <MapView.Polyline coordinates={this.state.polylines} strokeColor="#FF0000" strokeWidth={6} />
            originMarker = <MapView.Marker coordinate={this.state.polylines[0]} pinColor={'#000000'} />
            destinationMarker = <MapView.Marker coordinate={this.state.polylines[this.state.polylines.length -1]} />
        }

        return (
            <Container>
                <Header>
                    <Body>
                        <Title>truckRoute</Title>
                    </Body>
                </Header>
                <MapView
                    style={styles.map}
                    ref={map => { this.map = map; } }
                    onRegionChangeComplete={this.onRegionChange}
                    region={this.state.region}
                    provider={null}
                    mapType="none"
                    style={{ flex: 1 }}
                    showsUserLocation={true}
                    followsUserLocation={true}
                    // showsMyLocationButton={true}
                >
                    <MapView.UrlTile urlTemplate="http://a.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png" />
                    {polyline}
                    {originMarker}
                    {destinationMarker}
                </MapView>
                <TouchableOpacity style={styles.overlay}>
                    {this.state.routeDistance > 0 && 
                        <Text>Distance: {Math.floor(this.state.routeDistance / 1000)}km</Text>
                    }
                    <Text>Speed: </Text>
                </TouchableOpacity>
            </Container>
        )
    }

    getUserLocation = () => {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(position => resolve(position), err => reject(err), {enableHighAccuracy: true});
        })
    }

    watchPosition = () => {
        // let locationInterval = setInterval(() => {
        //     navigator.geolocation.getCurrentPosition(position => {
        //         console.log('Current position', position.coords)
        //         this.setState({
        //             region: {'latitude': position.coords.latitude, 'longitude': position.coords.longitude, 'latitudeDelta': LATITUDE_DELTA, 'longitudeDelta': LONGITUDE_DELTA},
        //             userLocation: {'latitude': position.coords.latitude, 'longitude': position.coords.longitude, 'latitudeDelta': LATITUDE_DELTA, 'longitudeDelta': LONGITUDE_DELTA},
        //         })

        //         if(!this.checkIfOnRoute(position.coords)) {
        //             this.getRoute(position.coords, this.state.endPoint)    
        //         }
        //     })
        // }, 15000)
        this.watchID = navigator.geolocation.watchPosition(
            (position) => {
                console.log("watchPosition Success", position.coords);
                // this.map.animateToRegion({'latitude': position.coords.latitude, 'longitude': position.coords.longitude}, 5000);
                this.setState({
                    region: { 'latitude': position.coords.latitude, 'longitude': position.coords.longitude, 'latitudeDelta': 0.003, 'longitudeDelta': 0.003 },
                    userLocation: { 'latitude': position.coords.latitude, 'longitude': position.coords.longitude, 'latitudeDelta': 0.003, 'longitudeDelta': 0.003 }
                })
                console.log('geolib', this.checkIfOnRoute(this.state.userLocation))
                if(!this.checkIfOnRoute(this.state.userLocation)) {
                    this.getRoute(this.state.userLocation, this.state.endPoint)
                }
            },
            (error) => {
               console.log("Error dectecting your location");
            },
            { enableHighAccuracy: true, timeout: 20000, distanceFilter: 1 }
        );
    }

    checkIfOnRoute = (userLocation) => {
        let status = false
        for(let point of this.state.polylines) {
            if(geolib.isPointInCircle(userLocation, point, 50)) {
                status = true
                break;
            }
        }
        return status
    }

    getRoute = (origin, destination, truckHeight = 2, truckWidth = 2, truckLength = 5) => {
        console.log('getRoute')
        return new Promise((resolve, reject) => {
            // origin.longitude = 47.033941
            // origin.latitude = 21.9495
            // destination.longitude = 45.6637
            // destination.latitude = 25.51
            axios.get(`http://192.168.0.113:3000/api/v1/truck-route/${this.state.userLocation.latitude},${this.state.userLocation.longitude}/${destination.longitude},${destination.latitude}?height=${truckHeight}&width=${truckWidth}&length=${truckLength}`)
            .then((res) => {
                if(res.data.polylines == undefined) { return Alert.alert('Error', 'Invalid route') }
                let latLngArray = polyline.decode(res.data.polylines).map(arr => {
                    return { 'latitude': arr[0], 'longitude': arr[1] }
                })
                this.setState({
                    polylines: latLngArray,
                    routeDistance: res.data.distance,
                    startPoint: this.state.userLocation
                })
                // console.log('geolib', geolib.getPathLength(this.state.polylines))
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
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    overlay: {
        position: 'absolute',
        bottom: 50,
        backgroundColor: 'rgba(255, 255, 255, 1)',
    },
})