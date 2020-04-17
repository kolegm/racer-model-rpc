/**
 * Extend instance of Racer backend
 * Declare mandatory logic to setup a list of extra DBs
 */

const debug = require('debug')('racer-model-rpc:backend');

// For checking of extra DB instance
const AbstractDB = require('sharedb/lib/db');

/**
 * @param Object  Instance of Racer backend (package `racer`)
 *
 * @see package racer/lib/Racer.server.js and method `createBackend` inside
 * @see package racer/lib/Backend.js how `racer` extends of `sharedb`
 *
 * Example to create a new backend instance:
 *    const racer = require('racer');
 *    backend = racer.createBackend();
 */
const plugin = backend => {
  if (!Object.prototype.hasOwnProperty.call(backend, 'extraDbs')) {
    throw new TypeError('The set of Extra DBs is not defined. Check backend instance');
  }

  if (typeof backend.addExtraDB === 'function') {
    console.error('The backend `addExtraDB` method is already defined');
    return;
  }

  /**
   * Setup extra DB for `racer` Backend which extends Backend from `sharedb`
   *
   * @param dbInstance Object  Instance of extra DB
   *
   * @see package sharedb to understand what is extra DB within sharedb
   * We use this logic to define DB for handling of RPC-requests from the client
   *
   * @todo Encourage `sharedb` authors to implement similar logic on their side
   */
  backend.addExtraDb = function (dbInstance) {
    if (!dbInstance || typeof dbInstance !== 'object') {
      throw new TypeError('Extra DB instance is invalid');
    }

    if (!(dbInstance instanceof AbstractDB)) {
      throw new TypeError(
        'DB instance must be an extended from the package `sharedb/lib/db`'
      );
    }

    const name = dbInstance.name;
    if (!name || typeof name !== 'string') {
      throw new TypeError(`Extra DB must have a valid name: "${name || ''}"`);
    }

    const key = name.trim().toLowerCase();
    if (!key) {
      throw new TypeError(`Extra DB must have a valid identifier: '${key}'`);
    }

    if (Object.prototype.hasOwnProperty.call(this.extraDbs, key)) {
      throw new TypeError(`Extra DB '${key}' is already defined`);
    }

    this.extraDbs[key] = dbInstance;

    debug(`Extra DB ${key} was added to instance of Racer backend`);
  };

  backend.getExtraDb = function (name) {
    if (!name || typeof name !== 'string') {
      throw new TypeError('Invalid name');
    }

    const key = name.trim().toLowerCase();
    if (!key) {
      throw new TypeError(`Invalid identifier: '${key}'`);
    }

    return this.extraDbs[key] ? this.extraDbs[key] : null;
  }
};

module.exports = plugin;
