import React, { Component } from 'react';
import {Transaction} from "./Transaction";

export default class extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    let transactions = this.props.transactions.map((t,i) => <Transaction sender={t.sender} recipient={t.recipient} amount={t.amount}  fee={t.fee} type={t.type} key={t.timestamp + '_' + i} />);
    return (
      <li className="list-group-item">
        <h5>Unverified Transactions</h5>
        <table className="table table-striped">
          <thead>
          <tr>
            <th scope="col" className="sender">Sender</th>
            <th scope="col" className="recipient">Recipient</th>
            <th scope="col">Amount</th>
            <th scope="col">Fee</th>
            <th scope="col">Type</th>
          </tr>
          </thead>
          <tbody>
          {transactions}
          </tbody>
        </table>
    </li>
  );
  }
}