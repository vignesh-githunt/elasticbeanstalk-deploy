/* global chrome */
import { Dispatcher } from 'flux';
import ChromePortHandler from './ChromePortHandler';
import ChromeMessageHandler from './ChromeMessageHandler';

const PORT_NAME = 'chrome-dispatcher';
const FAILED_TO_RECONNECT = 'ChromeDispatcher:FailedReconnect';

/**
 * @class ChromeDispatcher
 *
 * Flux dispatcher to handle app-internal messaging across threads.
 *
 * Has a ports component that handles messages using chrome.runtime.Port long-lived
 * connections, as well as one that handles sending one-off requests using
 * chrome.runtime.sendMessage.
 *
 * Needs to be instantiated in either server mode or client mode. The difference between
 * them is that server sets up a _listener_ for port connections, whereas clients
 * establish the connection to that listener.
 *
 * Server would typically be used on a background page, and client in content script.
 *
 */
export default class ChromeDispatcher extends Dispatcher {

  /**
   * @constructs ChromeDispatcher
   *
   * You can supply runtime id explicitly, or it falls back to chrome.runtime.id.
   *
   * Usage:
   *
   * const dispatcher = new ChromeDispatcher({
   *   runtimeId: 'myExtensionRuntimeId'
   * });
   */
  constructor(options = {}) {
    super();

    let { server, portName, runtimeId } = options;

    this.server = !!server;
    this.portName = portName || PORT_NAME;
    this.runtimeId = runtimeId || chrome.runtime.id || window.chromeExtensionId;

    this.portHandler = new ChromePortHandler(this);
    this.messageHandler = new ChromeMessageHandler(this);
  }

  /**
   * @function onMessage
   *
   * Pick up a message using chrome.runtime.Port
   *
   * Usage:
   *
   * dispather.onMessage('foo', (msgData) => console.log(msgData));
   *
   * @param {String} msgName
   * @param {Function} callback
   */
  onMessage(msgName, callback) {
    return this.portHandler.addListener((message, port) => {
      if (message.hasOwnProperty('length')) {
        let [ _msgName, _msgData ] = message;
        if (_msgName === msgName) {
          callback(_msgData, port);
        }
      }
    });
  }

  /**
   * @function onMessageOnce
   * @param {*} msgName
   */
  onMessageOnce(msgName) {
    return new Promise((resolve) => {
      const unsubscribe = this.onMessage(msgName, msgData => {
        resolve(msgData);
        unsubscribe();
      });
    });
  }

  /**
   * @function sendMessage
   *
   * Dispatches a named message with an optional data chunk using chrome.runtime.Port.
   *
   * Usage:
   *
   * // Dispatch message to all connected ports
   * dispatcher.sendMessage('foo', { bar: 'baz' });
   *
   * // Dispatch message to specific port, useful for replying to a message from a
   * // specific content script/tab etc.
   * dispatcher.sendMessage('foo', { bar: 'baz' }, port);
   *
   * @param {String} msgName
   * @param {*} [msgData]
   * @param {Port|Number} [port] Port or tabId
   */
  sendMessage(msgName, msgData, port) {
    return this.portHandler.sendMessage([msgName, msgData], port);
  }

  /**
   * @function onRequest
   *
   * Picks up a requets using chrome.runtime.onMessage.addListener.
   *
   * Also picks up messages via onMessageExternal.
   *
   * Usage:
   *
   * dispatcher.onRequest('foo', (request, sender, sendResponse) => {
   *   sendResponse('bar');
   * });
   *
   * @param {String} msgName
   * @param {Function} callback
   */
  onRequest(msgName, callback) {
    return this.messageHandler.addListener((message) => {
      let [request, sender, sendResponse] = message;

      // Make sure that request is an array before destructuring it
      if (request.hasOwnProperty("length")) {
        let [ _msgName, _msgData ] = request;

        if (_msgName === msgName) {
          let params = [_msgData, sender, sendResponse];

          callback(...params);
        }
      }
    });
  }

  /**
   * @function sendRequest
   *
   * Dispatches a named message using chrome.runtime.sendMessage.
   *
   * Usage:
   *
   * dispatcher.sendRequest('foo').then((response) => console.log(response));
   *
   * @param {String} msgName
   * @param {*} msgData
   * @param {Number} [tabId]
   *
   * @returns Promise
   */
  sendRequest(msgName, msgData, tabId) {
    return this.messageHandler.sendMessage([msgName, msgData], tabId);
  }

  /**
   * @function onDisconnect
   *
   * Register a listener for when the connection to the server dispatcher has been
   * irreparably broken, meaning the content script will likely need to be refreshed.
   *
   * @param {Function} callback
   */
  onDisconnect(callback) {
    this.register((payload) => {
      if (payload.type === FAILED_TO_RECONNECT) {
        callback();
      }
    });
  }
}

