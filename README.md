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

const rpcEvent = 'user-finder';
const handler = async ({ email }) => Usecase.findUser({ email });

// Example to define RPC-handler with some processing
rpcHandlerMap.set(rpcEvent, handler);

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
const extension = require('racer-model-rpc/src/client');
```

#### 2. Define extension - method `model.rpc` for RPC-calling
```node
extension(client);
```

#### 3. RPC-calling
```node
const model = client.createModel();
// For Derby's component just use
//const model = this.model;

const rpcEvent = 'user-finder';
const criteria = { email: 'example@mail.com' };

const success = result => console.log(result);
const failure = error => console.error(error);

model.rpc(rpcEvent, criteria).then(success).catch(failure);
```

Example of calling with `async/await`
```node
(async () => {
  try {
    const result = await model.rpc(rpcEvent, criteria);
    success(result);
  } catch (error) {
    failure(error);
  }
})();
```
