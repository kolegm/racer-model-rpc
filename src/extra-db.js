/**
 * Define extra DB as a point to handle client's RPC requests
 *
 * We use Racer model for communication with server side as a transport layer
 * We use `sharedb` engine to handle client requests as RPC-controller
 *
 * @see `sharedb/lib/db` is a base for the current db
 */

const debug = require('debug')('racer-model-rpc:client');

const AbstractDB = require('sharedb/lib/db');

const ExtraDB = class extends AbstractDB {
  get name() {
    return 'rpc';
  }

  /**
   * @param rpcHandlers Map of objects holds RPC-handlers to process client requests
   * @param resultFormat Function parses results from RPC-handler into a custom format declared by you
   */
  constructor(rpcHandlers, resultFormat) {
    super();

    const handlers = rpcHandlers && typeof rpcHandlers[Symbol.iterator] === 'function'
      ? rpcHandlers
      : null;

    this.rpcHandlers = new Map(rpcHandlers);

    this.resultFormat =
      typeof resultFormat === 'function'
        ? resultFormat
        : data => data; // as default
  }

  // Contract from sharedb/lib/db/index.js
  async query(
    collection, // In meaning of key for RPC-event
    query, // Query criteria as input data
    fields, // Projection fields. Not used here
    options, // Not used here
    callback, // Return result back to the client
  ) {
    // `callback` is a function with arguments [error, snapshots, extra]
    if (typeof callback !== 'function') {
      const error = new Error('Callback is required');
      return callback(error);
    }

    const key = collection; // Key of RPC-event

    // Look up a RPC-handler by the key of RPC-event
    if (!this.rpcHandlers.has(key)) {
      const error = new Error(`Undefined RPC query handler by the key: '${key}'`);
      return callback(error);
    }

    const handler = this.rpcHandlers.get(key);

    // Format declared by `sharedb`
    const done = (error, result/*, extra*/) => {
      if (error) callback(error);
      else {
        // Mandatory format declared by `sharedb`
        const snapshot = [{ v: 1, data: { result } }];

        /**
         * Parameters:
         * * snapshot - Snapshot of results from RPC-handler
         * * extra (optional) - Different metrics and other types of results, such as counts
         *
         * By the way, `shapshot` and `extra` will be combined on the further steps in one structure
         * like { data: snapshot, extra } and send to the client
         */
        callback(null, snapshot /*, extra */);
      }
    };

    try {
      const data = await handler(query);
      const result = this.resultFormat(data);

      done(null, result);
    } catch (error) {
      //console.error(error);
      done(new Error('Technical error has occurred'));
    }
  }
};

module.exports = ExtraDB;
