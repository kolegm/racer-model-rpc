# Remote Procedure Calling with Racer model
(similar to [racer-rpc](https://github.com/kolegm/racer-rpc) but more advanced)

# Usage instruction

## At server side

#### 1. Import dependencies
```node
//const derby = require('derby');
const racer = require('racer');
const RPC = require('racer-model-rpc');
```

#### 2. Extend Racer backend
```node
//const backend = derby.createBackend();
const backend = racer.createBackend();
RPC.backend(backend); // define additional methods to setup a list of extra DBs
```

#### 3. Setup extra DB (as RPC processing engine) into `sharedb`
Racer uses `sharedb` under the hood to handle all operations at server side

```node
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

// Check extra DB (just for testing)
const found = backend.getExtraDb(db.name);
console.log('Found extra DB: ', found);
```

## At client side

#### 1. Import dependencies
```node
//const client = require('derby');
const client = require('racer');
const RPC = require('racer-model-rpc');
```

#### 2. Define method `model.rpc` for RPC-calling
```node
RPC.client(client);
```

#### 3. RPC-calling
```node
const model = client.createModel();
// For Derby's component just use
//const model = this.model;

// @see ./server-side.js for details about RPC-handler
model.rpc('user-finder', { email: 'example@mail.com' })
  .then(result => console.log(result))
  .catch(error => console.error(error));
```
