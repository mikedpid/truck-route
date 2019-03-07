import React from 'react';
import { StyleSheet } from 'react-native';
import Navigator from './components/Navigator'

export default class App extends React.Component {
  constructor(props) {
    super(props)

  }

  render() {
    return (<Navigator />)
  }
}
