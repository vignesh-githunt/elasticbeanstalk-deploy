/*global chrome*/

import LocalStorageHelper from '../localStorageHelper';
import { STORAGE_KEYS } from '../constants';

export function sendTabMessage(tabId, message) {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, message, function(data) {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      }
      else {
        resolve(data);
      }
    });
  });
}

export function executeScript(tabId, code) {
  return new Promise((resolve, reject) => {
    chrome.tabs.executeScript(tabId, {
      code: code,
    }, (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      }
      else {
        resolve(result);
      }
    });
  });
}

export function getActiveTab() {
  return LocalStorageHelper.getPersistent(STORAGE_KEYS.ACTIVE_TAB_ID);
}

export function setActiveTab(tabId) {
  // Store the new value
  LocalStorageHelper.setPersistent(STORAGE_KEYS.ACTIVE_TAB_ID, tabId);
}
