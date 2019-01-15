import React, {Component} from "react";

export default class extends Component {

  constructor(props) {
    super(props);

    this.state = {
      message: '',
      nodePort: 0,
      nodeHost: 'localhost'
    };

    this.onMineClick = this.onMineClick.bind(this);
    this.onResolveClick = this.onResolveClick.bind(this);
    this.onRegisterNodeClick = this.onRegisterNodeClick.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.nodes && nextProps.nodes.length && prevState.nodePort === 0) {
      let lastNode = nextProps.nodes[nextProps.nodes.length - 1];
      return {nodePort: lastNode ? parseInt(lastNode.port, 10) + 1 : 3001};
    } else return null;
  }

  onMineClick(e) {
    this.refs.miningSpinner.style.display = 'inline-block';
    fetch(this.props.baseUrl + '/mine').then(r => r.json()).then(response => {
      this.setState({message: response.message});
      this.refs.miningSpinner.style.display = 'none';
      this.props.updateChain();
    });
  };

  onResolveClick(e) {
    fetch(this.props.baseUrl + '/resolve').then(r => r.json()).then(response => {
      this.setState({message: response.message});
      this.props.updateChain();
    });
  };

  onRegisterNodeClick(e) {
    let headers = new Headers();
    e.preventDefault();

    headers.append('Accept', 'application/json'); // This one is enough for GET requests
    headers.append('Content-Type', 'application/json'); // This one sends body

    this.setState({nodePort: this.state.nodePort + 1});

    fetch(this.props.baseUrl + '/nodes/register', {
      method: 'post',
      headers: headers,
      body: JSON.stringify(this.state)
    }).then(r => r.json()).then(response => {
      this.setState({message: response.message});

      this.props.updateRecipients();
    });
  };

  onChange(e) {
    const state = this.state;
    let name = e.target.name;
    state[name] = name === 'nodePort' ? parseInt(e.target.value, 10) : e.target.value;
    this.setState(state);
  };

  render() {
    let message = this.state.message;
    return (
      <div className="card">
        <div className="card-body">
          <h4 className="card-title">Peers</h4>
          <div className="form-group row">
            <label htmlFor="sender" className="col-sm-3 col-form-label">Host:</label>
            <div className="col-sm-9">
              <button className="btn btn-primary" onClick={this.onMineClick}>
                <div className="spinner-border spinner-border-sm" ref="miningSpinner" style={{display: 'none'}}
                     role="status">
                  <span className="sr-only">Loading...</span>&nbsp;
                </div>
                Mine
              </button>
              &nbsp;&nbsp;
              <button className="btn btn-secondary" onClick={this.onResolveClick}>Resolve</button>
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="sender" className="col-sm-3 col-form-label">Nodes:</label>
            <div className="col-sm-9">
              <label htmlFor="sender" className="col-sm-3 col-form-label">{this.props.nodes.length}</label>

            </div>
          </div>
          <div className="form-group row">
            <div className="col-sm-12">
              <form className="form-inline">
                <input type="text" className="form-control" name="nodeHost" placeholder="Hostname" size="10"
                       value={this.state.nodeHost}
                       onChange={this.onChange}/>&nbsp;&nbsp;
                <input type="text" className="form-control" name="nodePort" placeholder="Port #"
                       value={this.state.nodePort} size="10"
                       onChange={this.onChange}/>&nbsp;&nbsp;
                <button className="btn btn-primary" onClick={this.onRegisterNodeClick}>Add Peer</button>
              </form>

            </div>
          </div>
          {message &&
          <div className="row">
            <label className="col-sm-12 col-form-label">
              <code>{message}</code>
            </label>
          </div>
          }
        </div>
      </div>
    );
  }
}