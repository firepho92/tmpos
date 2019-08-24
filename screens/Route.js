import React, {Fragment} from 'react';
import { Animated, ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, List, Snackbar, TouchableRipple } from 'react-native-paper';

import Theme from './Theme';

import AppContext from '../context/AppContext';

export default class Route extends React.Component {
  constructor() {
    super();
    this.animate = new Animated.Value(0);
  }
  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    this.fadeIn();
  }

  fadeIn = () => {
    Animated.timing(
      this.animate,
      {
        toValue: 1,
        duration: 200,
      }
    ).start(); 
 }

  render() {
    return (
      <AppContext.Consumer>
        {context => (
          <Fragment>
            <View style={styles.baseContainer}>
              <Appbar.Header theme={Theme}>
                <Appbar.Content
                  title='Ruta'
                  style={{color: '#fff'}}
                />
              </Appbar.Header>
              <Animated.View style={[styles.body, {opacity: this.animate}]}>
                <ScrollView style={styles.dynamicContent}>
                  {context.state.logistics.map((point, index) => (
                    <Point key={index} index={index} checked={point.checked} customer={context.state.customers.filter(customer => customer.customer_id === point.customer)[0]} />
                  ))}
                </ScrollView>
              </Animated.View>
            </View>
            <Snackbar
              visible={context.state.alert.visible}
              onDismiss={() => context.hideAlert()}
              duration={1000}
              theme={Theme}
            >
              {context.state.alert.msg}
            </Snackbar>
          </Fragment>
        )}
      </AppContext.Consumer>
    );
  }
}

class Point extends React.Component {
  constructor() {
    super();
    this.animate = new Animated.Value(0);
  }

  componentDidMount() {
    console.log(this.props.customer);
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
      <Animated.View style={{opacity: this.animate}}>
        <TouchableRipple onPress={() => console.log(this.props.customer)}>
          <List.Item left={props => <List.Icon {...props} icon="room" />} title={this.props.customer.customer_name} right={props => <List.Icon {...props} color={this.props.checked ? '#5b7ce5' : '#a2a2a2'} icon="check" />}/>
        </TouchableRipple>
      </Animated.View>
    );
  }

}

const styles = StyleSheet.create({
  accordions: {
    backgroundColor: '#fff'
  },
  baseContainer: {
    flex: 1,
    backgroundColor: Theme.colors.background
  },
  body: {
    padding: 10
  },
  dynamicContent: {
    backgroundColor: '#fff',
    maxHeight: 250,
    borderRadius: Theme.roundness
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0
  },
  staticContent: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
    borderRadius: Theme.roundness
  }
});