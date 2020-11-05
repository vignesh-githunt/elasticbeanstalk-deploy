/* global chrome */
const ERR_FAILED_CONNECTION = 'Could not establish port. Most likely the extension has been updated.';
const FAILED_TO_RECONNECT = 'ChromeDispatcher:FailedReconnect';

/**
 * @class ChromePortHandler
 *
 * Chrome.runtime.port helper for ChromeDispatcher
 *
 * Handles all communication sent via chrome runtime ports and routes the payloads
 * through the dispatcher as necessary.
 * 
 */
export default class ChromePortHandler {

  /**
   * @constructs ChromePortHandler
   * @param {ChromeDispatcher} dispatcher
   */
  constructor(dispatcher) {
    this.dispatcher = dispatcher;
    this.ports = [];

    if (this.dispatcher.server) {
      this.listenForPortConnections();
    }
    else {
      this.connectToPort();
    }
  }

  /**
   * @function listenForPortConnections
   *
   * Listen for port connections that have the same name as parent dispatcher's port 
   */
  listenForPortConnections() {
    chrome.runtime.onConnect.addListener((port) => {
      if (port.name !== this.dispatcher.portName) { return; }
      this._handlePortConnection(port);
    });
  }

  /**
   * @function connectToPort
   *
   * Create a port connection to any listener that shares parent dispatcher's port name
   */
  connectToPort() {
    // Only connect to a port if the runtimeId is defined,
    // Otherwise code will crash (e.g. in the nit tests)
    if (this.dispatcher.runtimeId) {
      const port = chrome.runtime.connect(this.dispatcher.runtimeId, { name: this.dispatcher.portName });
      this._handlePortConnection(port);
    }
  }

  /**
   * @function _handlePortConnection
   * @param {Port} port
   */
  _handlePortConnection(port) {
    this.ports.push(port);
    port.onMessage.addListener((msg, port) => this.dispatch(msg, port));
    port.onDisconnect.addListener(() => this._handlePortDisconnection(port));
  }
  
  /**
   * @function _handlePortDisconnection
   * @param {Port} port
   */
  _handlePortDisconnection(port) {
    let idx = this.ports.findIndex((_port) => _port === port);
    this.ports.splice(idx, 1);
    if (!this.dispatcher.server) {
      setTimeout(() => {
        try {
          this.connectToPort();
        }
        catch (err) {
          console.warn(ERR_FAILED_CONNECTION);
          this.dispatcher.dispatch({ type: FAILED_TO_RECONNECT });
        }
      }, 100);
    }
  }

  /**
   * @function dispatch
   * @param {Message} message
   */
  dispatch(...params) {
    const { portName } = this.dispatcher;
    this.dispatcher.dispatch({ type: portName, message: params });
  }

  /**
   * @function sendPortMessage
   * @param {*} message
   * @param {*} [port]
   */
  sendMessage(message, port) {
    if (port) {
      let _port = port;
      if (typeof port === 'number') {
        let idx = this.ports.findIndex((port) => port.sender.tabId === port);
        _port = this.ports[idx];
      }
      if (_port) {
        _port.postMessage(message);
      }
    }
    else {
      this.ports.forEach((port) => port.postMessage(message));
    }

    setTimeout(() => {
      this.dispatch(message);
    }, 0);
  }

  /**
   * @function addListener
   * @param {Function} callback
   */
  addListener(callback) {
    const { portName } = this.dispatcher;

    const id = this.dispatcher.register((payload) => {
      let { type, message } = payload;
      if (type === portName) {
        if (message.hasOwnProperty('length')) {
          let [ _message, port ] = message;
          callback(_message, port);
        }
      }
    });

    // Returns removeListener function
    return () => this.dispatcher.unregister(id);
  }
}
