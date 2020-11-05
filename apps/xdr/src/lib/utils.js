/* global chrome */
// =================================
// VERSION CHECK UTILS
// =================================
//
// Some functions to determine version of plugin and determine if it's deprecated.
//
import LocalStorageHelper from "./localStorageHelper";

const getCurrentVersion = function () {
  let version = LocalStorageHelper.get("currentVersion");
  if (!version) {
    version = chrome.app.getDetails().version;
  }
  return version;
};

const versionCheck = function () {
  let beforeVersion = LocalStorageHelper.get("version");
  let currentVersion = this.getCurrentVersion();

  if (beforeVersion === undefined) {
    LocalStorageHelper.set("version", currentVersion);
  }

  updateToStorage();
};

const updateToStorage = function () {
  // if there are persistant data in local storage,
  // try to move it
  if (localStorage.persistent) {
    console.log("lets upgrade persistent");

    // Read up all persistant data
    let oldPersistent = {};
    try {
      oldPersistent = JSON.parse(localStorage.persistent);
    } catch (error) {
      console.error(error);
    }

    for (let key in oldPersistent) {
      // Set old value if there is none
      if (!LocalStorageHelper.getPersistent(key)) {
        console.log("updating the key: " + key);
        LocalStorageHelper.setPersistent(key, oldPersistent[key]);
      }
    }

    // Clear the old localstorage version, so we don't
    // do this again
    window.localStorage.removeItem("persistent");
  }
};

const elipseString = function (string, options) {
  if (!string || !options || !options.maxLen) {
    return string;
  }

  let len = string.length;
  if (len < options.maxLen) {
    return string;
  }

  let sublen = Math.floor(options.maxLen / 2) - 1;

  return (
    string.substr(0, sublen).trim() +
    "..." +
    string.substr(len - sublen, sublen).trim()
  );
};

export default {
  getCurrentVersion,
  versionCheck,
  elipseString,
};
