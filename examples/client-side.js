const racer = require('racer');

//const RPC = require('racer-model-rpc');
const rpcExtension = require('../src/client');

// ----------------------------
// Extend Racer model at client
// ----------------------------
rpcExtension(racer);

// ----------------------------
// Calling of RPC from client
// ----------------------------

const model = racer.createModel();

// @see ./server-side.js for details about RPC-handler
model.rpc('user-finder', { email: 'example@mail.com' })
  .then(result => console.log(result))
  .catch(error => console.error(error));
