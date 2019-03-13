import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Dimensions } from 'react-native';
import { Container, Content, Header, Body, Title, Button } from 'native-base';
import { MapView } from 'expo';
import axios from 'axios';
import polyline from '@mapbox/polyline';
import geolib from 'geolib';

const {width, height} = Dimensions.get('window')
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.003
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO
const POSITION_DISTANCE_FILTER = 1

class MapScreen extends Component {

    constructor(props) {
        super(props)
        
        this.state = {
            region: {
                latitude: 45.94,
                longitude: 24.96,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA
            },
            startPoint: props.navigation.getParam('origin') || { 'latitude': null, 'longitude': null },
            endPoint: props.navigation.getParam('destination') || { 'latitude': null, 'longitude': null },
            userLocation: {
                latitude: null,
                longitude: null
            },
            polylines: [],
            routeDistance: 0,
            cruiseSpeed: 0,
            avgSpeed: 0
        };
        
        this.speed = {'lowest': 0, 'highest': 0}
        this.offTheRoute = false,
        this.timesRouteRecalculated = 0,
        this.lastRouteCoordIndex = 0
        this.watchID = null
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
                    userLocation: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    }
                })
                if (this.state.startPoint.latitude && this.state.endPoint.latitude) {
                    this.getRoute(this.state.userLocation, this.state.endPoint).then((res) => {
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
            this.getRoute(this.state.userLocation, destination) //.then(() => this.map.fitToElements(true))
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

                {
                this.timesRouteRecalculated > 5 && this.offTheRoute && this.state.routeDistance > 0 &&
                    <Button
                        light={true}
                        block={true}
                        rounded={true}
                        style={styles.recalculateBtn}
                        onPress={
                            () => { this.getRoute(this.state.userLocation, this.state.endPoint) }
                        }>
                        <Text>Recalculate route</Text>
                    </Button>
                }

                <TouchableOpacity style={styles.overlay}>
                    {this.state.routeDistance > 0 && 
                        <Text>Distance: {Math.floor(this.state.routeDistance / 1000)}km</Text>
                    }
                    {this.state.routeDistance > 0 &&
                        <Text>Speed: {(this.state.cruiseSpeed > 0) ? this.state.cruiseSpeed : 0} km/h</Text>
                    }
                    {this.state.routeDistance > 0 &&
                        <Text>Average speed: {(this.state.avgSpeed > 0) ? this.state.avgSpeed : 0} km/h</Text>
                    }
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
                console.log('watchPosition Success', position.coords);
                console.log('speed', position.speed)
                if(position.speed) { this.updateSpeedValues(position.speed) }
                // this.map.animateToRegion({'latitude': position.coords.latitude, 'longitude': position.coords.longitude}, 5000);
                this.setState({
                    region: {
                        'latitude': position.coords.latitude,
                        'longitude': position.coords.longitude,
                        'latitudeDelta': LATITUDE_DELTA,
                        'longitudeDelta': LONGITUDE_DELTA
                    },
                    userLocation: {
                        'latitude': position.coords.latitude,
                        'longitude': position.coords.longitude,
                        'latitudeDelta': LATITUDE_DELTA,
                        'longitudeDelta': LONGITUDE_DELTA
                    },
                    cruiseSpeed: position.speed
                })
                console.log('geolib', this.checkIfOnRoute(this.state.userLocation))
                if(!this.checkIfOnRoute(this.state.userLocation)) { //if route re-calculated more than 5 times, stop the auto recalculation
                    this.offTheRoute = true
                    if(this.timesRouteRecalculated <= 5) {
                        this.getRoute(this.state.userLocation, this.state.endPoint)
                    }
                }
            },
            (error) => {
               console.log("Error detecting your location");
               console.log(error)
            },
            { enableHighAccuracy: true, timeout: 20000, distanceFilter: POSITION_DISTANCE_FILTER }
        );
    }

    updateSpeedValues = (speed) => {
        speed = (speed < 0) ? 0 : speed
        if(this.speed.lowest > speed) {
            this.speed.lowest = speed
            this.calculateAvgSpeed()
        } else if(this.speed.highest < speed) {
            this.speed.highest = speed
            this.calculateAvgSpeed()
        }
    }

    calculateAvgSpeed = () => {
        let sum = this.speed.lowest + this.speed.highest
        if(sum > 0) {
            this.setState({
                avgSpeed: sum/2
            })
        }
    }

    checkIfOnRoute = (userLocation) => {
        let status = false
        for(let [index, point] of this.state.polylines.entries()) {
            this.lastRouteCoordIndex = index
            if(geolib.isPointInCircle(userLocation, point, 50)) { // check if user location is less than 50m away from the route
                status = true
                break;
            }
        }
        return status
    }

    getRoute = (origin, destination, truckHeight = 2, truckWidth = 2, truckLength = 5) => {
        return new Promise((resolve, reject) => {
            if(isNaN(origin.latitude) || isNaN(origin.longitude)) {
                return Promise.reject(new Error('User location is undefined')).then(null, console.log)
            }

            axios.get(`http://192.168.0.113:3000/api/v1/truck-route/${origin.latitude},${origin.longitude}/${destination.latitude},${destination.longitude}?height=${truckHeight}&width=${truckWidth}&length=${truckLength}`)
            .then((res) => {
                if(res.data.polylines == undefined) {
                    return Alert.alert('Error', 'Invalid route')
                }
                let latLngArray = polyline.decode(res.data.polylines).map(arr => {
                    return { 'latitude': arr[0], 'longitude': arr[1] }
                })
                this.setState({
                    polylines: latLngArray,
                    routeDistance: res.data.distance,
                    startPoint: this.state.userLocation,
                })
                this.offTheRoute = false
                resolve(res.data)
            })
            .catch(err => { console.log (err)})
        })
    }

    getRouteDistance = () => {
        if(!this.state.polylines.length) { return 0 }
        return geolib.getPathLength(this.state.polylines)
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
    recalculateBtn: {
        position: 'absolute',
        bottom: 100,

    }
})