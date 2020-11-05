/* global chrome */
import { browser } from 'webextension-polyfill-ts';

import LocalStorageHelper from './lib/localStorageHelper';
// import Utils from './lib/utils';
import dispatcher from './lib/dispatcher';
// import Config from './lib/config';
import * as Constants from './lib/constants';

import GoldmineBackend from './lib/GoldmineBackend';
import fetchProvider from './lib/fetch';
// import fetchGraphqlProvider from './lib/fetch-graphql';

import ContextRuntime from './lib/contextruntime';

import * as dotenv from 'dotenv';

dotenv.config();

new Promise((resolve) => {
  LocalStorageHelper.init(resolve);
}).then(() => {
  const platformFetch = fetchProvider((headers) =>
    Object.assign({}, headers, {
      'X-Plugin-Token': ContextRuntime.getPluginToken(),
    })
  );
  require('dotenv').config();
  // const fetchGraphql = fetchGraphqlProvider(platformFetch);

  // Called when the user clicks on the browser action
  chrome.browserAction.onClicked.addListener(function (tab) {
    // Send a message to the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0];
      console.log(activeTab);
      browser.tabs.sendMessage(activeTab.id, {
        message: 'clicked_browser_action',
      });
    });
  });

  chrome.runtime.onMessage.addListener(function (data, sender, sendResponse) {
    if (data && data.type === 'platform-fetch-request') {
      console.log('Performing fetch with data:', data);
      delete data.options.signal;
      let translatedResponse;
      return platformFetch(data.request, data.options)
        .then((res) => {
          console.log('response', res);
          translatedResponse = {
            type: res.type,
            url: res.url,
            redirected: res.redirected,
            status: res.status,
            statusText: res.statusText,
            ok: res.ok,
          };
          return res.text();
        })
        .then((text) => {
          translatedResponse.text = text;
          return translatedResponse;
        })
        .then(sendResponse)
        .catch((err) => {
          console.error(err);
        });
    }
  });

  dispatcher.onMessage(Constants.SIDEBAR_EVENTS.USER_AUTHENTICATED, (data) => {
    console.log('received event notification from the sidebar');
    ContextRuntime.setPluginToken(data.user.pluginToken);
    ContextRuntime.setUser(data.user);
    ContextRuntime.setAuth(data.token);
    console.log('Context', ContextRuntime.getContext());
  });

  GoldmineBackend.init();
});
