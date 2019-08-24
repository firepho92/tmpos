import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { Portal } from 'react-native-paper';
import { BarCodeScanner, Permissions } from 'expo';

export default class BarcodeScannerExample extends React.Component {
  state = {
    hasCameraPermission: null,
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
    }

  render() {
    const { hasCameraPermission } = this.state;

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }
    return (
      <Portal>
        <View style={{ flex: 1 }}>
          <BarCodeScanner
            onBarCodeScanned={this.handleBarCodeScanned}
            style={StyleSheet.absoluteFill}
          />
        </View>
      </Portal>
    );
  }

  handleBarCodeScanned = ({ type, data }) => {
    //alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    console.log(data + ' ' + this.props.customer.customer_id);
    if(data == this.props.customer.customer_id) {
      this.props._finishSale(true);
    } else {
      this.props._finishSale(false);
    }
    
  }
}

const styles = StyleSheet.create({
  cameraContainer: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    //zIndex: 10000
  }
});