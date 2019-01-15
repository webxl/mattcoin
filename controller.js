// controller.js
// main interface to local blockchain node

import uuidv4 from 'uuid/v4';

import BlockChain from './blockchain';

export const nodeId = uuidv4();

const thisPort = process.env.PORT || 3000;

let blockChain = new BlockChain(nodeId, 'localhost', thisPort);

export function mine() {
  let lastBlock = blockChain.lastBlock;
  let feeReward = blockChain.transactions.map(t => t.fee).reduce((prev, cur) => {
    return prev + (cur ? cur:0)
  }, 0);
  let lastProof = lastBlock.nonce;
  let nonce = blockChain.proofOfWork(lastProof, lastBlock.prevHash);

  blockChain.newTransaction("0", nodeId, 1, 0, 'reward');
  blockChain.newTransaction("0", nodeId, feeReward, 0, 'fee');

  return blockChain.newBlock(nonce);
}

export function newTransaction(sender, recipient, amount, fee, type, needsToPropagate) {
  let idx = blockChain.newTransaction(sender, recipient, amount, fee, type, needsToPropagate);

  return idx;
}

export function getChain() {
  return blockChain.chain;
}

export function validateChain(chain) {
  return blockChain.validateChain(chain);
}

export function registerNodes(list) {
  list.forEach(n => {
    blockChain.registerNode.call(blockChain, n.host, n.port, false, n.isHost);
  });

  return blockChain.nodes.length;
}

export function registerNode(host, port, initial = true, cb) {
  blockChain.registerNode(host, port, initial, false, cb);
}

export function getNodes() {
  return blockChain.nodes;
}

export function getTransactions() {
  return blockChain.transactions;
}

export function getNodeId() {
  let hostNode = blockChain.nodes.find(n => n.isHost);

  return hostNode ? hostNode.id:'n/a';
}

export function resolveConflicts(done) {
  return blockChain.resolveConflicts(done);
}

export function resetChain() {
  blockChain = new BlockChain();
}