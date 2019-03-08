import React, { PureComponent } from 'react';
import { View, Alert, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation';

class RouteListItem extends PureComponent {
    _handlePress = async () => {
        // const res = await this.props.fetchDetails(this.props.place_id)
        // console.log('result', res)
        this.props.navigation.navigate('Map')
    }

    render() {
        return (
            <TouchableOpacity onPress={this._handlePress}>
                <View style={styles.itemContainer}>
                    <Text style={styles.routeName}>Route name, Origin -> Destination</Text>
                    <Text style={styles.rightSideText}>6km, taking around 8mins</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    itemContainer: {
        flex: 1,
        flexDirection: 'column',
        height: 50
    },
    rightSideText: {
        // flex: 1,
        // flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    routeName: {
        width: "70%",

    }
})

export default withNavigation(RouteListItem);