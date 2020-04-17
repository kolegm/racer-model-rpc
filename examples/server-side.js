const racer = require('racer');

//const RPC = require('racer-model-rpc');
const RPC = require('../src');

// --------------------
// Extend Racer backend
// --------------------

const backend = racer.createBackend();
RPC.backend(backend); // define additional methods to setup a list of extra DBs

// --------------
// Setup extra DB
// --------------

// Define RPC handler to process requests from the client side
const rpcHandlerMap = new Map();
// Example to define RPC-handler with some processing
rpcHandlerMap.set('user-finder', async ({ email }) => Usecase.findUser({ email }));

// Define result formatter
const format = result => {
  console.log(result);
  return result;
};

// Setub a new extra DB
const db = new RPC.ExtraDB(rpcHandlerMap, format);
backend.addExtraDb(db);

// --------------
// Check extra DB
// --------------
const found = backend.getExtraDb(db.name);
console.log('Found extra DB: ', found);
