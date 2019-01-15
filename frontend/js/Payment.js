import React, {Component} from 'react';

export default class Payment extends Component {

  constructor(props) {
    super(props);
    this.state = {
      sender: '',
      recipient: '',
      amount: 1,
      fee: 1,
      message: ''
    };
    console.log('SendPayment constructor', this.props.nodes);

    if (props.nodes.length)
      {
        let ts = props.nodes.filter(n => !n.isHost);
        if (ts.length) this.setState({ recipient: ts[0].id })
      }


    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {

    fetch(this.props.baseUrl + '/id').then(r => r.json()).then(id => {
      this.setState({sender: id});
      console.log('SendPayment componentDidMount', this.props.nodes);
      //
    });

  }

  static getDerivedStateFromProps(nextProps, prevState){
    if (!prevState.recipient && nextProps.nodes.length > 1) {
      return { recipient: nextProps.nodes.filter(n => !n.isHost)[0].id };
    }
    else return null;
  }

  onChange(e) {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);
  };

  onSubmit(e) {
    e.preventDefault();
    let headers = new Headers();

    headers.append('Accept', 'application/json'); // This one is enough for GET requests
    headers.append('Content-Type', 'application/json'); // This one sends body

    let trans = { sender: this.state.sender, recipient: this.state.recipient, amount: this.state.amount, fee: this.state.fee };
    // get our form data out of state
    //const { sender, recipient, amount } = this.state;
    fetch(this.props.baseUrl + '/newTransaction', {
      method: 'post',
      headers: headers,
      body: JSON.stringify(trans)
    }).then(r => r.json()).then(response => {
      this.setState({message: response.message});

      this.props.updateTransactions();
    });
  };

  render() {
    const {sender, recipient, amount, fee, message} = this.state;

    let nodeOptions = this.props.nodes.filter(n => !n.isHost).map(n => <option key={n.id} value={n.id}>{n.id}</option>)

    console.log('SendPayment render', this.props.nodes);

    return (
      <div className="card">
        <div className="card-body">
          <h4 className="card-title">Payment</h4>
          {/*<h6 className="card-subtitle mb-2 text-muted">MattCoin</h6>*/}
          <form onSubmit={this.onSubmit}>
            <div className="form-group row">
              <label htmlFor="sender" className="col-sm-3 col-form-label">Sender:</label>
              <div className="col-sm-9">
                <input type="text" name="sender" value={sender} onChange={this.onChange} className="form-control"/>
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="recipient" className="col-sm-3 col-form-label">Recipient:</label>
              <div className="col-sm-9">
                <select name="recipient" value={recipient} onChange={this.onChange} className="form-control">
                  {nodeOptions}
                </select>
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="amount" className="col-sm-3 col-form-label">Amount/Fee:</label>
              <div className="col-sm-5">
                <input type="number" name="amount" value={amount} onChange={this.onChange} className="form-control"/>
              </div>
              <div className="col-sm-4">
                <input type="number" name="fee" value={fee} onChange={this.onChange} className="form-control"/>
              </div>
            </div>
            {/*<div className="form-group row">*/}
              {/*<label htmlFor="fee" className="col-sm-3 col-form-label">Source:</label>*/}
              {/*<div className="col-sm-9">*/}
                {/*<input type="number" name="fee" value={fee} onChange={this.onChange} className="form-control"/>*/}
              {/*</div>*/}
            {/*</div>*/}
            <div className="form-group row">
              <div className="col-sm-3">
                <button type="submit" className='btn btn-primary'>Submit</button>
              </div>
              {message &&
                <label className="col-sm-9 col-form-label"><code>{message}</code></label>
              }
            </div>
          </form>
        </div>
      </div>
    )
  }
}