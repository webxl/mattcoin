import React, {Component} from 'react';
import moment from 'moment';
import {Transaction} from "./Transaction";


import {library} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCaretSquareDown} from '@fortawesome/free-solid-svg-icons';

library.add(faCaretSquareDown);

class Block extends Component {

  render() {

    let transactions = this.props.block.transactions.map((t,i) => <Transaction sender={t.sender} recipient={t.recipient} amount={t.amount}  fee={t.fee} type={t.type} key={t.timestamp + '_' + i}  />);
    let blockId = this.props.block.index;
    let blockPrevHash = this.props.block.prevHash.substring();
    let blockProof = this.props.block.nonce;
    let blockTime = moment(this.props.block.timestamp).format('MMMM Do YYYY, h:mm:ss a');
    return (
      <li className="list-group-item">
        <h5>Block {blockId} <span className="float-right"><small className='text-muted'>{blockTime}</small> - <small className='text-muted'>{blockPrevHash}</small>  - <small className='text-muted'>{blockProof}</small> </span></h5>
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
        <FontAwesomeIcon icon="caret-square-down" />
      </li>
    )
  }
}

export default class Ledger extends Component {

  render() {
    let blocks = this.props.chain.map(b => <Block block={b} key={b.timestamp} />);

    return (
      <div className="card">
        <div className="card-body">
          <h4 className="card-title">Ledger</h4>
            <ul className="list-group">
              {blocks.reverse()}
            </ul>
        </div>
      </div>
    )
  }
}