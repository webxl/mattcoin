import BlockChain from './blockchain';
import * as Controller from './controller';

let chai = require('chai');
let sinon = require('sinon');
let expect = chai.expect;
let request = require('request');

import uuidv4 from 'uuid/v4';
import rp from 'request-promise';

global.request = request;
global.rp = rp;

require.cache.request = request;
require.cache.rp = rp;

describe("Blockchain Class", function() {

  let blockChain;

  before(function() {
    const nodeId = uuidv4();
    console.log('GENESIS env var: ' + process.env.GENESIS);
    blockChain = new BlockChain(nodeId, 'localhost', 5000);
  });

  it('should be initialized with a genesis block', function() {
    expect(blockChain.chain[0].nonce).to.equal(100);
  });


});

describe("Controller", function () {

  this.timeout(5000); // only necessary for hashing effect in console

  let nodes, valChain = [{"index":0,"timestamp":1547531020021,"transactions":[{"sender":0,"recipient":"facc6b77-206f-424a-a8e1-5ffccce858a3","amount":25,"fee":0,"timestamp":1547531020021,"type":"genesis"}],"nonce":100,"prevHash":"1"},{"index":1,"timestamp":1547531099018,"transactions":[{"sender":"facc6b77-206f-424a-a8e1-5ffccce858a3","recipient":"415faffb-60d3-464a-86be-52787684d05d","amount":1,"fee":1,"timestamp":1547531081738,"type":"regular"},{"sender":"0","recipient":"facc6b77-206f-424a-a8e1-5ffccce858a3","amount":1,"fee":0,"timestamp":1547531099018,"type":"reward"},{"sender":"0","recipient":"facc6b77-206f-424a-a8e1-5ffccce858a3","amount":1,"fee":0,"timestamp":1547531099018,"type":"fee"}],"nonce":106201,"prevHash":"e3960783729884fc8e47a360c746f91dd51c72a99edfa8b49df85541592039ac"},{"index":2,"timestamp":1547531144868,"transactions":[{"sender":"415faffb-60d3-464a-86be-52787684d05d","recipient":"facc6b77-206f-424a-a8e1-5ffccce858a3","amount":1,"fee":1,"timestamp":1547531139763,"type":"regular"},{"sender":"0","recipient":"415faffb-60d3-464a-86be-52787684d05d","amount":1,"fee":0,"timestamp":1547531144868,"type":"reward"},{"sender":"0","recipient":"415faffb-60d3-464a-86be-52787684d05d","amount":1,"fee":0,"timestamp":1547531144868,"type":"fee"}],"nonce":14075,"prevHash":"f5ad6772303b6aba31614a8ad996c4a2e23cd2ff6697053d0af09e1c825fa500"},{"index":3,"timestamp":1547531175263,"transactions":[{"sender":"facc6b77-206f-424a-a8e1-5ffccce858a3","recipient":"415faffb-60d3-464a-86be-52787684d05d","amount":1,"fee":2,"timestamp":1547531170368,"type":"regular"},{"sender":"0","recipient":"facc6b77-206f-424a-a8e1-5ffccce858a3","amount":1,"fee":0,"timestamp":1547531175263,"type":"reward"},{"sender":"0","recipient":"facc6b77-206f-424a-a8e1-5ffccce858a3","amount":2,"fee":0,"timestamp":1547531175263,"type":"fee"}],"nonce":16820,"prevHash":"ea8c3d5a41fc3545a7b2f0fa566c401fdea2ba9f9616c81d29f73d19bbb133cc"}];

  before(function () {

    function makeAddress(node) {
      return `http://${node.host}:${node.port}`;
    }

    nodes = [{ host: 'host1', port: 5000, isHost: true }, { host: 'host2', port: 5000 }, { host: 'host1', port: 5001 }];

    let chain1 = valChain.slice(0,3);
    let chain2 = valChain.slice(0,4);
    let chain3 = valChain.slice(0,5);

    let stub = sinon
      .stub(global.request, 'get');

      stub.withArgs({ url: makeAddress(nodes[0]) + '/chain', json: true})
      .yields(null, null, JSON.stringify(chain1))
      .withArgs({ url: makeAddress(nodes[1]) + '/chain', json: true})
      .yields(null, null, JSON.stringify(chain2))
      .withArgs({ url: makeAddress(nodes[2]) + '/chain', json: true})
      .yields(null, null, JSON.stringify(chain3))
      .withArgs({ url: makeAddress(nodes[0]) + '/id', json: true})
      .yields(null, null, '"eee6ea6e-ecc2-496e-b505-f63dc1382d7a"')
      .withArgs({ url: makeAddress(nodes[1]) + '/id', json: true})
      .yields(null, null, '"eee6ea6e-ecc2-496e-b505-f63dc1382d7a"')
      .withArgs({ url: makeAddress(nodes[2]) + '/id', json: true})
      .yields(null, null, '"eee6ea6e-ecc2-496e-b505-f63dc1382d7a"')
      .withArgs({ url: makeAddress(nodes[0]) + '/transactions', json: true})
      .yields(null, null, JSON.stringify(chain1.transactions))
      .withArgs({ url: makeAddress(nodes[1]) + '/transactions', json: true})
      .yields(null, null, JSON.stringify(chain2.transactions))
      .withArgs({ url: makeAddress(nodes[2]) + '/transactions', json: true})
      .yields(null, null, JSON.stringify(chain3.transactions));

    let stub2 = sinon
      .stub(global.rp, 'get');

    stub2.withArgs({ url: makeAddress(nodes[0]) +  '/chain', json: true})
      .resolves(JSON.stringify(chain1))
      .withArgs({ url: makeAddress(nodes[1])  + '/chain', json: true})
      .resolves(JSON.stringify(chain2))
      .withArgs({ url: makeAddress(nodes[2])  + '/chain', json: true})
      .resolves(JSON.stringify(chain3))
      .withArgs({ url: makeAddress(nodes[1]) + '/transactions', json: true})
      .resolves(JSON.stringify(chain2.transactions))

  });

  it("should return the new blocked that was forged", function () {
    expect(Controller.getChain().length).to.equal(1);
    let forged = Controller.mine();
    expect(forged.nonce).to.not.be.null;
    expect(Controller.getChain().length).to.equal(2);
    let transactions = forged.transactions;
    expect(transactions[0].recipient).to.equal(Controller.nodeId);
  });

  it("should return the id of a new transaction", function() {
    let idx = Controller.newTransaction("me", "you", 245);
    expect(idx).to.equal(2);
  });

  it("should include any new transactions in the block that was just forged. " +
    "(length includes mining reward transaction)", function() {
    let throwaway = Controller.mine();
    Controller.newTransaction("you", "me", 56);
    Controller.newTransaction("me", "you", 74);
    let forged = Controller.mine();
    expect(forged.transactions.length).to.equal(4);
    let nextBlock = Controller.mine();
    expect(nextBlock.transactions.length).to.equal(2);
  });

  // it("should allow p2p nodes to be registered", function() {
  //   let count = Controller.registerNodes(['http://loca', 'foo', 'bar']);
  //   expect(count).to.equal(3);
  // });

  it('should validate chains', function() {
    expect(Controller.validateChain(valChain)).to.equal(true);
  });

  it("should resolve conflicts with other nodes", function (done) {
    Controller.resetChain();
    Controller.registerNodes(nodes);
    Controller.resolveConflicts(function (msg) {
      expect(msg).to.equal('Chain was replaced');
      done();
    });

  });

  after(function () {
    global.request.get.restore();
    global.rp.get.restore();
  });


});
