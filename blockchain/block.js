export default class {

  constructor(index, timestamp, transactions, nonce, prevHash) {
    this.index = index;
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.nonce = nonce;
    this.prevHash = prevHash;
  }
};