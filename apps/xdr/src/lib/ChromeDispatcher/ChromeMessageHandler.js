/* global chrome */
const MESSAGE = 'chrome.runtime.sendMessage';

/**
 * @class ChromeMessageHandler
 *
 * TODO: Add description
 */
export default class ChromeMessageHandler {

  /**
   * @constructs ChromeMessageHandler
   * @param {ChromeDispatcher} dispatcher
   */
  constructor(dispatcher) {
    this.dispatcher = dispatcher;

    if (chrome.runtime.onMessage) {
      chrome.runtime.onMessage.addListener((...params) => this._handleMessage(...params));
    }

    if (chrome.runtime.onMessageExternal) {
      chrome.runtime.onMessageExternal.addListener((...params) => this._handleMessage(...params));
    }
  }

  /**
   * @function _handleMessage
   */
  _handleMessage(request, sender, sendResponse) {
    let message = [request, sender, sendResponse];
    this.dispatcher.dispatch({ type: MESSAGE, message: message });
    return true;
  }

  /**
   * @function sendMessage
   * @param {*} message
   * @param {Number} [tabId]
   */
  sendMessage(message, tabId) {
    return new Promise((resolve, reject) => {
      if (typeof tabId !== 'undefined') {
        chrome.tabs.sendMessage(tabId, this.runtimeId, message, (response) => {
          let err = chrome.runtime.lastError;
          if (!response && err) {
            reject(err);
          }
          else {
            resolve(response);
          }
        });
      }
      else {
        chrome.runtime.sendMessage(this.dispatcher.runtimeId, message, (response) => {
          let err = chrome.runtime.lastError;
          if (!response && err) {
            reject(err);
          }
          else {
            resolve(response);
          }
        });
      }
    });
  }

  /**
   * @function addListener
   * @param {Function} callback
   */
  addListener(callback) {
    const id = this.dispatcher.register((payload) => {
      let { type, message } = payload;
      if (type === MESSAGE) {
        callback(message); // message = [request, sender, sendResponse]
      }
    });

    // Returns removeListener function
    return () => this.dispatcher.unregister(id);
  }
}
