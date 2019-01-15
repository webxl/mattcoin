# MattCoin

## Blockchain Toy App in Express/React

I created this app as part of a tech talk I did last year (see blockchain.pdf). I've recently cleaned up the code a
bit and added hot module reloading.

Credit goes to Daniel van Flymen and his article [Learn Blockchains by Building One](https://hackernoon.com/learn-blockchains-by-building-one-117428612f46). Some of the backend code is ported from there.

### Installation

Clone and `yarn` or `npm install`; then build with `yarn build`.

### Go!

For the root node, you need to specify the `GENESIS` environment variable:

```
GENESIS=1 yarn start
```

You may also specify the port which by default is 3000. Other nodes will need to have this set:
```
PORT=3001 yarn start
```
up to how ever many nodes you want to run (you'll need at least 2):
```
PORT=65535 yarn start
```

### Frontend

* Open up the URL provided in the console, and then add peer nodes under Peers.
* Then you can send transactions to the backend node
* Once you're happy, click Mine. That's it.
* Repeat


### Todo

* Introduce UTXOs and UTXOPool along with tranasction verification
* Display wallet value in UI
* Split out web app from mining nodes