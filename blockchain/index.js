import sha256 from 'sha256';
import request from 'request';
import rp from 'request-promise';
import readline from 'readline';

import Node from './node';
import Block from './block';
import Transaction from './transaction';

class BlockChain {

  constructor(nodeId, nodeHost, nodePort) {
    this.nodes = [];
    this.chain = [];
    this.transactions = [];

    if (!nodeHost || !nodePort) return;

    if (process.env.GENESIS === '1') {
      this.newTransaction(0, nodeId, 25,  0,'genesis');
      this.newBlock(100, '1'); // genesis block
    }

    this.registerNode(nodeHost, nodePort, true, true, null, nodeId);
  }

  get lastBlock() {
    return this.chain[this.chain.length - 1];
  }

  newBlock(nonce, prevHash=null) {
    let block = new Block(this.chain.length, Date.now(), this.transactions, nonce, prevHash || BlockChain.hash(this.lastBlock));
    this.chain.push(block);
    this.transactions = [];
    return block;
  }

  newTransaction(sender, recipient, amount, fee, type = 'regular', needsToPropagate = true) {
    this.transactions.push(new Transaction(sender, recipient, amount, fee, Date.now(), type));

    function sendTransactions(node, nodes) {
      request.post({ url: node.address + '/newTransaction', body: { sender, recipient, amount, fee, needsToPropagate: false },
        json: true}, (err, response) => {

        if (err) {
        }

        if (nodes.length)
          sendTransactions(nodes.pop(), nodes);
        else {
          //
          // if (done)
          //   done(msg);
        }

      });
    }

    if (type === 'reward' || type === 'fee')
      needsToPropagate = false;

    let nodeList = this.nodes.filter(n => !n.isHost).slice();

    if (needsToPropagate && nodeList.length) sendTransactions(nodeList.pop(), nodeList);

    return this.chain.length; // next block index
  }

  registerNode(host, port, initial, isHost = false, cb, nodeId) {
    let node = new Node(host, port, isHost, nodeId);

    if (isHost) {
      this.nodes.push(node);
      return;
    }

    // verify node is running and not already added
    node.populateNodeId((err, node) => {
      if (err) {
        if (cb) cb(err);
        return;
      }

      if (this.nodes.find(n => n.id === node.id)) {
        if (cb) cb("Node already exists");
        return;
      }

      this.nodes.push(node);

      let hostNode = this.nodes.find(n => n.isHost);

      if (initial)
        // called from client
        node.registerHostNode(hostNode);
      else {
        // called from another node; get chain & unmined transactions
        this.resolveConflicts();
      }

      cb.call(null, err, node, this.nodes.length);
    });
  }

  validateChain(chain) {
    let lastBlock = chain[0];
    let valid = true;

    let current_index = 1;

    while (current_index < chain.length) {
      let block = chain[current_index];
      if (block.prevHash !== BlockChain.hash(lastBlock)) {
        valid = false;
        return false;
      }

      if (!BlockChain.validateNonce(lastBlock.nonce, block.nonce, lastBlock.prevHash)) {
        valid = false;
        return false;
      }

      lastBlock = block;
      current_index++;
    }

    return valid;
  }

  resolveConflicts(done) {
    let newChain, source, maxLen = 0, reqs = [], self = this;

    if (!this.nodes.length) {
      done('Please add some nodes'); return;
    }

    maxLen = this.chain.length;

    function getChains(node) {
      return new Promise((resolve, reject) => {
        return rp.get({ url: node.address + '/chain', json: true}).then(chain => resolve( { node, chain: JSON.parse(chain) } ) ).catch(reject);
      });
    }
    
    let nodeList = this.nodes.filter(n => !n.isHost).slice();

    return Promise.all(nodeList.map(getChains)).then(nodeChains => {

      return new Promise((resolve, reject) => {

        nodeChains.forEach(nodeChain => {

          let chain = nodeChain.chain;
          let node = nodeChain.node;

          if (chain.length > maxLen && self.validateChain(chain)) {
            maxLen = chain.length;
            newChain = chain;
            source = node;
          }

        });

        let msg = '';

        if (newChain) {
          self.chain = newChain;
          msg = 'Chain was replaced';

          rp.get({ url: source.address + '/transactions', json: true  }).then(transactions => {
            self.transactions = transactions;

            if (done)
              done(msg);

            resolve();
          }).catch(reject);

        } else {
          msg = 'Chain not updated';

          if (done)
            done(msg);

          resolve();

        }

      });

    });

  }

  static hash(block) {
    return sha256(JSON.stringify(block));
  }

  static validateNonce(lastNonce, nonce, prevHash) {
    let guess = `${lastNonce}${nonce}${prevHash}`;
    let result = sha256(guess);
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(result);

    return /^0000/.test(result);
  }

  proofOfWork(lastNonce, prevHash) {
    let nonce = 0;
    while (!BlockChain.validateNonce(lastNonce, nonce, prevHash)) {
      nonce++;
    }

    // process.stdout.write("\nFound!\n");

    return nonce;
  }

}

export default BlockChain;