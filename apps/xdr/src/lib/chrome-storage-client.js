import dispatcher from "./dispatcher";

export const MESSAGE_PREFIX = "Storage:";

/**
 * @class ChromeStorageClient
 *
 * TODO: Add description
 */
export default class ChromeStorageClient {
  /**
   * @function get
   * @param {String} key
   */
  static get(key) {
    return dispatcher.sendRequest(MESSAGE_PREFIX + "get", key);
  }

  /**
   * @function set
   * @param {String} key
   * @param {*} value
   */
  static set(key, value) {
    return dispatcher.sendRequest(MESSAGE_PREFIX + "set", [key, value]);
  }

  /**
   * @function remove
   * @param {String} key
   */
  static remove(key) {
    return dispatcher.sendRequest(MESSAGE_PREFIX + "remove", key);
  }
}
