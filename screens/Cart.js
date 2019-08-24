import React from 'react';

import { Animated, ScrollView, StyleSheet, Vibration, View } from 'react-native';
import { Button, Dialog, Divider, List, Portal, Text, TouchableRipple } from 'react-native-paper';

import Theme from './Theme';

import AppContext from '../context/AppContext';

export default class Cart extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedIndex: [],
    }
  }

  _handleCamera = () => {
    this.props._handleCamera();
    this.props._hideDialog();
  }
  
  _handleSale = (addSale) => {
    if(addSale(this.props.cartItems)) {
      this.props._hideDialog();
      this.props._setView(1, this.props.customer);
    }
  }

  _handleLongPress = (index) => {
    this._addSelected(index);
    Vibration.vibrate(100, true);
  }

  _addSelected = (index) => {
    this.setState({
      selectedIndex: index
    });
  }

  _removeSelected = () => {
    this.setState({
      selectedIndex: null
    });
  }

  _handleCancel = () => {
    this.setState({
      selectedIndex: []
    });
    this.props._clearCart();
  }

  _isSelected = (index) => {
    for(var j = 0; j < this.state.selectedIndex.length; j++)
      if(this.state.selectedIndex[j] === index) return true;
    return false;
  }

  render() {
    return (
      <AppContext.Consumer>
        {context => (
          <Portal>
            <Dialog
              style={{zIndex: 9}}
              visible={this.props.visible}
              onDismiss={this.props._hideDialog}>
              <Dialog.Title>Carrito</Dialog.Title>
              <Dialog.ScrollArea>
                <ScrollView>
                  <View style={{display: 'flex', flexDirection: 'row', marginTop: 5, marginBottom: 5}}>
                    <Text style={{flex: 1, textAlign: 'center'}}>Producto</Text>
                    <Text style={{flex: 1, textAlign: 'center'}}>Cantidad</Text>
                    <Text style={{flex: 1, textAlign: 'center'}}>Precio</Text>
                    <Text style={{flex: 1, textAlign: 'center'}}>Subtotal</Text>
                  </View>
                  <Divider/>
                  
                  {this.props.cartItems.map((item, i) => {
                    return (
                      this.state.selectedIndex === i ? <SelectedItem key={i} index={i} beer={item.product} _removeSelected={this._removeSelected} _removeItemFromCart={this.props._removeItemFromCart}/> : <Item key={i} products={context.state.products} item={item} index={i} product={item.product} _handleLongPress={this._handleLongPress}/>
                    );
                  })}

                  <Divider/>

                  <List.Item style={{paddingLeft: 5}} right={props => <Text>Total: ${this.props.cartItems.reduce((accum, item) => accum + item.ammount * item.selling_price, 0)}</Text>}/>
                  
                </ScrollView>
              </Dialog.ScrollArea>
              <Dialog.Actions style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                <Button onPress={this.props._hideDialog} theme={Theme}>Atrás</Button>
                <Button onPress={this._handleCancel} theme={Theme}>Cancelar</Button>
                <Button onPress={() => this._handleCamera()} theme={Theme}>Finalizar</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        )}
      </AppContext.Consumer>
    );
  }
}

class Item extends React.Component {
  render() {
    return (
      <TouchableRipple onPress={() => console.log(this.props.item)} onLongPress={() => this.props._handleLongPress(this.props.index)} rippleColor="rgba(43, 106, 235, 1)" underlayColor="rgba(43, 106, 235, 1)">
        <View style={{alignItems: 'center', display: 'flex', flexDirection: 'row', height: 50}}>
          <Text style={{flex: 1, textAlign: 'center'}}>{this.props.products.filter(product => product.product_id === this.props.item.product).map(product => product.product_name)}</Text>
          <Text style={{flex: 1, textAlign: 'center'}}>{this.props.item.ammount}</Text>
          <Text style={{flex: 1, textAlign: 'center'}}>${this.props.item.selling_price}</Text>
          <Text style={{flex: 1, textAlign: 'center'}}>${this.props.item.ammount * this.props.item.selling_price}</Text>
        </View>
      </TouchableRipple>
    );
  }
}

class SelectedItem extends React.Component {
  constructor() {
    super();
    this.animatedValue = new Animated.Value(0);
  }

  animateBackgroundColor = () => {
    this.animatedValue.setValue(0);
    Animated.timing(
      this.animatedValue,
      {
        toValue: 1,
        duration: 1000
      }
    ).start();
  }

  componentDidMount() {
    this.animateBackgroundColor();
  }

  render() {
    const backgroundColorVar = this.animatedValue.interpolate(
    {
      inputRange: [ 0, 1 ],
      outputRange: [ '#96b5f6', '#2b6aeb' ]
    });

    return(
      <Animated.View style = {[ styles.container, { backgroundColor: backgroundColorVar } ]}>
        <Text style={ styles.text } onPress={() => this.props._removeItemFromCart(this.props.beer)}>Eliminar</Text>
        <Text style={ styles.text } onPress={() => this.props._removeSelected()}>Cancelar</Text>
      </Animated.View>
    );
  }
}
 
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 50,
  },

  text: {
    color: 'white'
  }
});