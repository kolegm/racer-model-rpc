const racer = require('racer');

//const RPC = require('racer-model-rpc');
const RPC = require('../src');

// ----------------------------
// Extend Racer model at client
// ----------------------------
RPC.client(racer);

// ----------------------------
// Calling of RPC from client
// ----------------------------

const model = racer.createModel();

// @see ./server-side.js for details about RPC-handler
model.rpc('user-finder', { email: 'example@mail.com' })
  .then(result => console.log(result))
  .catch(error => console.error(error));
