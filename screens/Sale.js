import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import { Appbar, DefaultTheme, FAB, List, Provider, TouchableRipple } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import bson from 'bson';

import Theme from './Theme';

import AppContext from '../context/AppContext';

import DefineQuantity from './DefineQuantity';
import Cart from './Cart';
import CodeBarScannerView from './CodeBarScannerView';

const FABAnimated = Animatable.createAnimatableComponent(FAB);

import Sale from '../models/sale';

export default class SaleScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      cartItems: [],
      quantityOpen: false,
      ticket: new bson.ObjectId(),
      visible: false,
      product_id: null,
      selling_price: '',
      camera: false
    }
  }

  _handlePriceInputChange = (value) => {
    parseInt(value, 10);
    this.setState({
      selling_price: value,
    });
  }

  _finishSale = (confirmation) => {
    this._handleCamera();
    if(confirmation) {
      this.props._addSale(this.state.cartItems);
      this.props._setView(1, this.props.customer);
    } else {
      this.props._showAlert('No ha sido posible finalizar la venta.')
    }
  }

  _addItemToCart = (product_id, quantity, selling_price) => {
    let sale = new Sale(this.state.ticket, new Date(), this.props.customer.customer_id, product_id, quantity, selling_price);
    this.setState(prevState => ({
      cartItems: [...prevState.cartItems, sale.sale],
      quantityOpen: false
    }));
    return true;
  }

  _removeItemFromCart = (beer_id) => {

    let cartItems = this.state.cartItems;
    let index = this.state.cartItems.map((cartItem, index) => {
      if(cartItem.beer === beer_id) {
        return index;
      }
    }).filter(isFinite);
    cartItems.splice(index, 1);
    this.setState({
      cartItems: cartItems
    });
  }

  _clearCart = () => {
    this.setState({
      cartItems: []
    });
  }

  _showDialog = () => {
    this.setState({
      visible: true
    });
  }

  _hideDialog = () => {
    this.setState({
      visible: false
    });
  }

  _showQuantityDialog = (product_id, selling_price) => {
    this.setState({
      quantityOpen: true,
      product_id: product_id,
      selling_price: selling_price
    });
  }

  _hideQuantityDialog = () => {
    this.setState({
      quantityOpen: false
    });
  }

  _handleCamera = () => {
    this.setState({
      camera: !this.state.camera
    })
  }

  render() {
    return (
      <Provider>
        <AppContext>
          {context => (
            <View style={styles.baseContainer}>
              {this.state.camera ? <CodeBarScannerView customer={this.props.customer} _finishSale={this._finishSale} /> : null}
              <DefineQuantity _handlePriceInputChange={this._handlePriceInputChange} visible={this.state.quantityOpen} _hideQuantityDialog={this._hideQuantityDialog} _addItemToCart={this._addItemToCart} product_id={this.state.product_id} selling_price={this.state.selling_price}/>
              {this.state.cartItems.length > 0 ? <Cart _handleCamera={this._handleCamera} visible={this.state.visible} _hideDialog={this._hideDialog} cartItems={this.state.cartItems} _setView={this.props._setView} customer={this.props.customer} _clearCart={this._clearCart} _removeItemFromCart={this._removeItemFromCart}/> : null}
              <Appbar.Header theme={Theme}>
                <Appbar.BackAction
                  onPress={() => this.props._setView(1, this.props.customer)}
                />
                <Appbar.Content
                  title="Agregar al carrito"
                />
              </Appbar.Header>
              <View style={styles.body}>
                <View style={styles.dinamicContent}>
                  <ScrollView>
                    {context.state.products.map((product, i) => {
                      return (
                        <TouchableRipple key={product.product_id} onPress={() => this._showQuantityDialog(product.product_id, product.selling_price)}>
                          <List.Item left={props => <List.Icon {...props} icon="fiber-manual-record" id={product.product_id}/>} title={product.product_name} right={props => <List.Icon {...props} icon="add"/>}/>
                        </TouchableRipple>
                      );
                    })}
                  </ScrollView>
                </View>
              </View>
              {this.state.cartItems.length > 0 ? <FABAnimated animation="swing" iterationCount="infinite" duration={0} easing="ease-out" theme={fabTheme} style={styles.fab} icon="shopping-cart" onPress={() => this._showDialog()}/> : <FAB animation="swing" iterationCount="infinite" duration={0} easing="ease-out" theme={fabTheme} style={styles.fab} icon="shopping-cart" onPress={() => this._showDialog()}/>}
              
            </View>
          )}
        </AppContext>
      </Provider>
    );
  }
}

const textInputStyle = {
  ...DefaultTheme,
  roundness: 5,
  colors: {
    ...DefaultTheme.colors,
    primary: '#5b7ce5',
    accent: '#2b6aeb',
    surface: '#fff',
    background: '#fff'
  }
}

const fabTheme = {
  ...DefaultTheme,
  roundness: 5,
  colors: {
    ...DefaultTheme.colors,
    primary: '#5b7ce5',
    accent: '#2b6aeb',
    surface: '#fff',
    background: '#fff'
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
  border: {
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8'
  },
  noBorder: {
    borderWidth: 0,
  },
  body: {
    padding: 10
  },
  dinamicContent: {
    backgroundColor: '#fff',
    borderRadius: Theme.roundness,
    maxHeight: 440
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0
  },
});