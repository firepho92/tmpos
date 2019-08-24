import React from 'react';

import { Button, Dialog, Portal, TextInput } from 'react-native-paper';

import AppContext from '../context/AppContext';

import Theme from './Theme';

export default class DefineQuantity extends React.Component {
  constructor() {
    super();
    this.state = {
      quantity: ''
    }
  }

  componentDidMount() {
    this.setState({
      selling_price: this.props.selling_price + ''
    });
  }

  _handleQuantityInputChange = (value) => {
    parseInt(value, 10);
    this.setState({
      quantity: value,
    });
  }

  _handleSubmit = (_addItemToCart, showAlert) => {
    if(_addItemToCart){
      showAlert('Elementos agregados correctamente.');
      this.setState({
        quantity: ''
      });
    }
  }

  render() {
    return (
      <AppContext.Consumer>
        {context => (
          <Portal>
            <Dialog
              visible={this.props.visible}
              onDismiss={this.props._hideQuantityDialog}>
              <Dialog.Title>Cantidad y precio</Dialog.Title>
              <Dialog.Content>
                <TextInput
                  autoFocus={true}
                  mode="outlined"
                  label="Cantidad"
                  value={this.state.quantity}
                  keyboardType="number-pad"
                  theme={Theme}
                  onChangeText={text => this._handleQuantityInputChange(text)}
                />
                <TextInput
                  mode="outlined"
                  label="Precio"
                  value={this.props.selling_price + ''}
                  keyboardType="number-pad"
                  theme={Theme}
                  onChangeText={text => this.props._handlePriceInputChange(text)}
                />
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => this._handleSubmit(this.props._addItemToCart(this.props.product_id, this.state.quantity, this.props.selling_price), context.showAlert)} theme={Theme}>Agregar</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        )}
      </AppContext.Consumer>
    );
  }
}

