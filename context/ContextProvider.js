import React, {Component} from 'react';
import axios from 'axios';

import AppContext from './AppContext';

import DocumentIO from '../models/documentIO';
import Customer from '../models/customer';

import data from './data';

let documentIO = new DocumentIO();

class ContextProvider extends Component {
  constructor() {
    super();
    this.state = {
      queue: [],
      logistics: [],
      online: false,
      sales: [],
      deposits: [],
      products: [],
      customers: [],
      alert: {
        visible: false,
        msg: ''
      }
    }
    this.server = 'http://192.168.100.4';
  }

  componentDidMount() {
    this.isServerOnline();
    //this.readData();
    /*this.setState({
      beers: data.beers,
      customers: data.customers,
      deposits: data.deposits,
      sales: data.sales
    })*/
  }

  //Online services

  isServerOnline = () => {
    setInterval(() => {
      axios.get(this.server + ':8000/')
      .then(response => {
        if(this.state.customers.length === 0)
          this.getInitialState();
        this.setState({
          online: true
        });
      })
      .catch(error => {
        this.setState({
          online: false
        });
      });
    }, 1000);
  }

  getInitialState = () => {
    axios.get(this.server + ':8000/customers')
    .then(response => {
      this.setState({
        customers: response.data
      })
    })
    .catch(error => {
      console.log(error);
    });
    axios.get(this.server + ':8000/products')
    .then(response => {
      this.setState({
        products: response.data
      })
    })
    .catch(error => {
      console.log(error);
    });
    axios.get(this.server + ':8000/logistics')
    .then(response => {
      this.setState({
        logistics: response.data
      })
    })
    .catch(error => {
      console.log(error);
    });
  }

  //customers
  /*addCustomer = async (name, phone, address) => {
    let customer = new Customer(name, phone, address);        
    this.setState(prevState => ({
      customers: [...prevState.customers, customer.customer]
    }));
    return true;
  }

  deleteCustomer = async (customer_id) => {
      let customers = this.state.customers;
      let index = this.state.customers.map((customer, index) => {
          if(customer.id === customer_id) {
              return index;
          }
      }).filter(isFinite);
      customers.splice(index, 1);
      this.setState({
          customers: customers
      });
      return true;
  }*/

    //beers
  /*addBeer = async (beer) => {
      this.setState(prevState => ({
          beers: [...prevState.beers, beer]
      }));
  }*/

    //sales
  addSale = (sales) => {
    let response;
    let products = this.state.products;
    response = sales.map(sale => {
      return response = products.map(product => {
        if(sale.product === product.product_id) {
          if (sale.ammount <= product.stock) {
            product.stock -= sale.ammount;
            this.setState(prevState => ({
              sales: [...prevState.sales, sales]
            }));
            this.showAlert('Venta exitosa.');
            return true;
          } else {
            this.showAlert(`No hay suficientes ${product.product_name}s en stock.`);
            return false;
          }
        }
      });
    });
    return response;
  }

  showAlert = (msg) => {
    this.setState({
      alert: {
        visible: true,
        msg: msg
      }
    });
  }

  hideAlert = () => {
    this.setState({
      alert: {
        visible: false,
        msg: ''
      }
    });
  }

  storeData = async () => {
    let result = await documentIO.writeDocument(this.state);
    console.log(result);
  }

  readData = async () => {
    let result = await documentIO.readDocument();
    result = JSON.parse(result);
    this.setState(result);
  }

    render() {
        return (
            <AppContext.Provider value={{
                state: this.state,
                storeData: this.storeData,
                readData: this.readData,
                addCustomer: this.addCustomer,
                deleteCustomer: this.deleteCustomer,
                addBeer: this.addBeer,
                addSale: this.addSale,
                showAlert: this.showAlert,
                hideAlert: this.hideAlert
            }}>
                {this.props.children}
            </AppContext.Provider>
        );
    }
}

export default ContextProvider;