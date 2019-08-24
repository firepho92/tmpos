import React from 'react';
import {
  ActivityIndicator,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Appbar, FAB, List, TouchableRipple } from 'react-native-paper';
import Pulse from 'react-native-pulse';

import Theme from './Theme';

import AppContext from '../context/AppContext';

export default class Customers extends React.Component {
  constructor() {
    super();
    this.animate = new Animated.Value(0);
  }

  componentDidMount() {
    this.fadeIn();
  }

  fadeIn = () => {
    Animated.timing(
      this.animate,
      {
        toValue: 1,
        duration: 300,
      }
    ).start(); 
  }

  render() {
    return (
      <AppContext.Consumer>
        {context => (
          <View style={styles.baseContainer}>
            <Appbar.Header theme={Theme}>
              <Appbar.Content
                title='Clientes'
                style={{color: '#fff'}}
              />
              <Appbar.Action size={20} icon="fiber-manual-record" color={context.state.online ? '#00E676' : '#FF3D00'} onPress={() => console.log(context.state.online)} />
            </Appbar.Header>
            <Animated.View style={[styles.body, {opacity: this.animate}]}>
              {context.state.customers.length === 0 ? <ActivityIndicator size="large" color={Theme.colors.primary}/> : null}
              <ScrollView style={styles.dynamicContent}>
                {context.state.customers.map((customer, i) => {
                  return (
                    <CustomerItem key={i} index={i} customer={customer} _setView={this.props._setView}/>
                  );
                })}
              </ScrollView>
            </Animated.View>
          </View>
        )}
      </AppContext.Consumer>
    );
  }
}

class CustomerItem extends React.Component {
  constructor() {
    super();
    this.animate = new Animated.Value(0);
  }

  componentDidMount() {
    this.fadeIn();
  }

  fadeIn = () => {
    Animated.timing(
      this.animate,
      {
        toValue: 1,
        duration: 300,
        delay: 200 * this.props.index
      }
    ).start(); 
  }

  render() {
    return (
      <Animated.View style={{opacity: this.animate, backgroundColor: '#fff'}}>
        <TouchableRipple onPress={() => this.props._setView(1, this.props.customer)}>
          <List.Item left={props => <List.Icon {...props} icon="person" />} title={this.props.customer.customer_name} right={props => <List.Icon {...props} icon="keyboard-arrow-right" />}/>
        </TouchableRipple>
      </Animated.View>
    );
  }

}

const styles = StyleSheet.create({
  addCustomerButton: {
    color: '#596ab8'
  },
  baseContainer: {
    flex: 1,
    backgroundColor: Theme.colors.background
  },
  body: {
    padding: 10
  },
  bodyContainer: {
    height: 465 //tamaño perfecto del body, solo por si acaso, borrar al final del proyecto
  },
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: '#fff',
  },
  dynamicContent: {
    maxHeight: 445,
    borderRadius: Theme.roundness
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  navigationBar: {
    marginBottom: 5,
  },
  contentContainer: {
    marginBottom: 20
  },
});