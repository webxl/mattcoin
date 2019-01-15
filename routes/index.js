var express = require('express');
var router = express.Router();

var Controller = require('../controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'MattCoin' });
});

router.get('/mine', function(req, res, next) {
  let block = Controller.mine();
  res.json({message: `Forged new block with index ${block.index}; Contains ${block.transactions.length} transactions`});
});

router.get('/resolve', function(req, res, next) {
  Controller.resolveConflicts(msg => {
    res.json({message: `${msg}`});
  });
});

router.get('/chain', function(req, res, next) {
  res.json(Controller.getChain());
});

router.get('/id', function(req, res, next) {
  res.json(Controller.getNodeId());
});

router.get('/nodes', function(req, res, next) {
  res.json(Controller.getNodes());
});

router.get('/transactions', function(req, res, next) {
  res.json(Controller.getTransactions());
});

router.post('/newTransaction', function(req, res, next) {
  let idx = Controller.newTransaction(req.body.sender, req.body.recipient, req.body.amount, req.body.fee, 'regular', req.body.needsToPropagate);
  res.json({message: `Transaction will be added to Block ${idx}`});
});

router.post('/nodes/register', function(req, res, next) {
  Controller.registerNode(req.body.nodeHost, req.body.nodePort, req.body.initial, (err, node, count) => {

    if (err) {
      res.json({message: `${err}`});
      return;
    }

    res.json({message: `id: ${node.id}; ${count} nodes registered`});
  });
});

router.get('*', function(req, res){
  res.status(404).send('what???');
});

module.exports = router;
