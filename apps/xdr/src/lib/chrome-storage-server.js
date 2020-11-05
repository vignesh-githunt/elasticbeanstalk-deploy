/* global chrome */
import dispatcher from './dispatcher';

const GET_STORAGE = 'Storage:get';
const SET_STORAGE = 'Storage:set';
const REMOVE_STORAGE = 'Storage:remove';

dispatcher.onRequest(GET_STORAGE, (request, sender, sendResponse) => {
  const key = request;
  if (key) {
    chrome.storage.local.get(key, (res) => sendResponse(res[key]));
  }
  else {
    chrome.storage.local.get(res => sendResponse(res));
  }
});

dispatcher.onRequest(SET_STORAGE, (request, sender, sendResponse) => {
  const [ key, value ] = request;
  const obj = {};
  obj[key] = value;
  chrome.storage.local.set(obj, () => sendResponse());
});

dispatcher.onRequest(REMOVE_STORAGE, (request, sender, sendResponse) => {
  const key = request;
  chrome.storage.local.remove(key, () => sendResponse());
});
