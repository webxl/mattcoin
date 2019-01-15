import request from 'request';

export default class {
  constructor(host, port, isHost, nodeId = 'n/a') {
    this.host = host;
    this.port = port;
    this.isHost = isHost;
    this.id = nodeId;
    this.address = `http://${this.host}:${this.port}`;
  }

  populateNodeId(done) {
    request.get({url: this.address + '/id', json: true}, (err, response, body) => {

      if (err) {
        done(err);
        return;
      }

      try {
        this.id = JSON.parse(body);

        done(null, this);
      } catch (e) {
        done(e);
      }
    });
  }

  registerHostNode(hostNode, done) {
    request({
      method: 'POST',
      uri: this.address + '/nodes/register',
      body: { nodeHost: hostNode.host, nodePort: hostNode.port, initial: false },
      json: true
    }, (err, response, body) => {

      //let id = JSON.parse(body);

      //done(this);

    });
  }

};