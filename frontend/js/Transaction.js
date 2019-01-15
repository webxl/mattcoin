import React, {Component} from "react";

export class Transaction extends Component {

  constructor(props) {
    super(props);

  }

  render() {
    let sender = this.props.sender + "" === "0" ? 'MattCoin' : this.props.sender;
    return (
      <tr>
        <td className="sender">{sender}</td>
        <td className="recipient">{this.props.recipient}</td>
        <td>{this.props.amount}</td>
        <td>{this.props.fee}</td>
        <td>{this.props.type}</td>
      </tr>
    )
  }
}