/* global chrome */
//=================================
// LOCAL STORAGE HELPER
//=================================
//
// Contains wrappers for browser storage frameworks, providing a means to store data
// without using localStorage.
//
// The LocalStorageHelper that is accessed by the brisk modules is an instance of the
// LocalStorageHelper class, which inherits from a StorageWrapper class, which is tailor
// made for specific browsers – at the moment only Chrome.
//
// The StorageWrapper contains all the methods necessary to act as a synchronously
// accessible Object, while providing methods to asynchronously commit and pull changes
// to/from the browser's data store.
//
// TODO: Add chrome.storage.sync support (or see if it works currently)
// TODO: Add storage wrapper for Firefox
//

// Central storage wrapper class
//---------------------------------
//
// The prototype for all browser storage derivatives, spawned via Object.create(). Any
// object that inherits form the StorageWrapper must provide the following methods:
//
// - initStorage: "constructor" function that preloads data from storage
// - pull: syncs data from storage and extends locally accessible data
// - remove: removes sync + async from storage
// - save: commits key/value pair OR entire storage to persist
//
var StorageWrapper = (function () {
  var StorageWrapper = {
    // Get a property in the storage
    getValue: function (key) {
      if (!key) return undefined;
      key += "__localstore__";
      return this.data[key];
    },
    get: function (key) {
      return this.getValue(key);
    },
    getPersistent: function (key) {
      return this.getValue("__persistent__" + key);
    },
    // FIXME: Deprecated
    getObj: function (key) {
      return this.getValue(key) || {};
    },

    // Set a property in the storage
    setValue: function (key, value, callback) {
      if (!key) return false;
      key = key + "__localstore__";
      this.data[key] = value;
      this.save({ callback: callback, key: key });
    },
    set: function () {
      this.setValue.apply(this, arguments);
    },

    // Set a property that can't be wiped with clear()
    setPersistent: function (key, value, callback) {
      this.setValue("__persistent__" + key, value, callback);
    },

    // Clear the local storage, saving only the properties marked as persisten
    clear: function (saveOnFinish, callback) {
      var _this = this;
      Object.keys(_this.data).map((key) => {
        if (!/^__persistent__/.exec(key)) {
          try {
            delete _this.data[key];
          } catch (err) {
            debugger;
          }
        }
        return true;
      });
      chrome.storage[this.method].clear(function () {
        // Rewrite the persistent data
        _this.save({
          callback: function () {
            if (callback) {
              callback();
            }
          },
        });
      });
    },
    qClear: function (saveOnFinish) {
      var def = new Promise();
      this.clear(saveOnFinish, function () {
        def.resolve();
      });
      return def;
    },
  };
  return StorageWrapper;
})();

// Chrome storage wrapper class
//---------------------------------
var ChromeStorageWrapper = (function () {
  var ChromeStorageWrapper = Object.create(StorageWrapper);

  // Gets the entire Chrome storage on init and then uses it to allow synchronous
  // get requests.
  ChromeStorageWrapper.initStorage = function (callback, method) {
    var _this = this;
    this.method = method || "local";
    this.data = {};
    this.pull(function () {
      // Setup listener for changes
      chrome.storage.onChanged.addListener(function (object) {
        Object.keys(object).map( (key) => {
          if (/__localstore__$/.exec(key)) {
            if (object[key].newValue) {
              _this.data[key] = object[key].newValue;
            } else if (
              _this.data.hasOwnProperty(key) &&
              !/^__persistent__/.exec(key)
            ) {
              // Remove the key
              delete _this.data[key];
            }
          }
          return true;
        });
      });

      if (callback) {
        callback();
      }
      return this;
    });
  };

  // Re-fetch storage
  ChromeStorageWrapper.pull = function (callback) {
    var _this = this;
    chrome.storage[this.method].get(function (data) {
      for (var i in data) {
        if (/__localstore__$/.exec(i)) {
          _this.data[i] = data[i];
        }
      }
      if (callback) {
        callback();
      }
    });
  };

  // Remove a property
  ChromeStorageWrapper.remove = function (key, callback) {
    key += "__localstore__";
    if (!this.data[key]) {
      return false;
    }
    delete this.data[key];
    chrome.storage[this.method].remove(key, callback);
  };

  // Asynchronously store changes in data to Chrome storage
  ChromeStorageWrapper.save = function (options) {
    if (!options) options = {};
    var callback = options.callback;
    var key = options.key;
    var data;

    if (key && this.data[key]) {
      data = {};
      data[key] = this.data[key];
      chrome.storage[this.method].set(data, function () {
        callback && callback.apply(null, arguments);
      });
    } else {
      chrome.storage[this.method].set(this.data, function () {
        callback && callback.apply(null, arguments);
      });
    }
  };
  return ChromeStorageWrapper;
})();

// Publicly accessible storage class
//---------------------------------
//
// Inherits from a StorageWrapper derivative.
//
// Provide an "onInit" method to this class to run it once storage is prefetched.
//
var LocalStorageHelper = (function () {
  var LocalStorageHelper = Object.create(ChromeStorageWrapper);
  LocalStorageHelper.init = function (callback) {
    LocalStorageHelper.__instance = this;
    this.initStorage(function () {
      callback && callback();
    });
  };
  return LocalStorageHelper;
})();

// Return singleton instance of selected storage class
module.exports = Object.create(LocalStorageHelper);
