// Blockchain App!

import React, {Component} from 'react';
// import {hot} from 'react-hot-loader/root' // uncomment for HMR

import Payment from './Payment';
import Ledger from './Ledger';
import Peers from "./Peers";
import Transactions from "./Transactions";

import '../css/style.less';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chain: [],
      nodes: [],
      transactions: []
    };

    this.updateChain = this.updateChain.bind(this);
    this.updateRecipients = this.updateRecipients.bind(this);
    this.updateTransactions = this.updateTransactions.bind(this);
  }

  componentDidMount() {
    this.updateChain();
    this.updateRecipients();
    this.updateTransactions();
  }

  updateChain() {
    fetch(this.props.baseUrl + '/chain').then(r => r.json()).then(chain => {
      this.setState({chain});
      this.updateTransactions();
    });
  };

  updateTransactions() {
    fetch(this.props.baseUrl + '/transactions').then(r => r.json()).then(transactions => {
      this.setState({transactions});
    });
  };

  updateRecipients() {
    fetch(this.props.baseUrl + '/nodes').then(r => r.json()).then(nodes => {
      if (nodes.length) {
        this.setState({nodes});
      }
    });
  };

  render() {
    let chain = this.state.chain;
    let nodes = this.state.nodes;
    let transactions = this.state.transactions;
    return (
      <div className='mattcoin container-flex'>
        <h1>MattCoin</h1>

        <div className="row">
          <div className="col col-sm-7">
            <Payment nodes={nodes} updateTransactions={this.updateTransactions} baseUrl={this.props.baseUrl}  />
          </div>
          <div className="col col-sm-5">
            <Peers updateChain={this.updateChain} updateRecipients={this.updateRecipients} baseUrl={this.props.baseUrl} nodes={nodes} />
          </div>
        </div>
        <div className="row">
          <div className="col col-sm-12">
            <Transactions transactions={transactions} baseUrl={this.props.baseUrl}  />
          </div>
        </div>
        <div className="row">
          <div className="col col-sm-12">
            <Ledger chain={chain} baseUrl={this.props.baseUrl}  />
          </div>
        </div>
      </div>
    )
  }

}

//export default hot(App);
export default App;