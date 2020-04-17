/**
 * Extend client side of Racer
 * Define method `model.rpc` for calling of RPC
 */

const debug = require('debug')('racer-model-rpc:client');

// Options for Query builder
const defaultOptions = { db: 'rpc' };

const plugin = (racer, options) => {
  const Model = racer.Model;

  options = { ...defaultOptions, ...options };

  /**
   * Ability to call RPC from the client side
   *
   * @param eventKey string  It's a key, what RPC-handler must be called at server side
   * @param data null|Object Client Criteria (input data for RPC-handling at server side)
   * @return Promise of results
   *
   * Example:
   *    const call = async (model) => {
   *      return await model.rpc('user_finder', { email: 'example@mail.com' });
   *    };
   *    call(model) // instance of Racer model
   *      .then(result => console.log(result))
   *      .catch(error => console.error(error));
   */
  Model.prototype.rpc = function (eventKey, data) {

    if (!eventKey || typeof eventKey !== 'string') {
      throw new TypeError('Wrong key of RPC event');
    }

    const key = eventKey.trim().toLowerCase();

    // Scoped racer's root model
    const scoped = this.scope();

    // Racer Query builder
    const query = scoped.query(key, data, options);

    const executor = (resolve, reject) => {
      debug(`Started calling of 'rpc:${key}'`);

      const callback = error => {
        debug(
          `Finished callling of 'rpc:${key}' with status=${
            error ? 'Failed' : 'SUCCESS'
          }`
        );

        if (error) reject(error);
        else {
          const data = query.get();

          // Racer internally keeps track of the context in which you call subscribe or fetch,
          // and it counts the number of times that each item is subscribed or fetched.
          query.unfetch(); // clear racer caching

          resolve(data || null);
        }
      };

      query.fetch(callback); // Fetching data from the server side
    };

    return new Promise(executor);
  };
};

module.exports = plugin;
