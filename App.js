import React from 'react';
import { Root } from "native-base";
import Navigator from './components/Navigator'
import { Font } from "expo";

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      fontLoaded: false
    }
  }

  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    })
    this.setState({ fontLoaded: true })
  }

  render() {
    return (<Navigator />)
  }
}
