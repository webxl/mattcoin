export default class {
  constructor(sender, recipient, amount, fee, timestamp, type) {
    this.sender = sender;
    this.recipient = recipient;
    this.amount = parseInt(amount, 10);
    this.fee = parseInt(fee, 10);
    this.timestamp = timestamp;
    this.type = type;
  }
}