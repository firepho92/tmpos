export default class Sale {
  constructor(ticket, date, customer, product, ammount, selling_price) {
    this.sale = {
      ticket: ticket,
      date: date,
      customer: customer,
      product: product,
      ammount: ammount,
      selling_price: selling_price
    }
  }
}