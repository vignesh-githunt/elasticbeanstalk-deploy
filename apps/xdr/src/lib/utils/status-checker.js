/* global chrome */
import config from '../config';
import ContextRuntime from '../contextruntime';

export default class StatusChecker {
  async fetch() {
    const pluginToken = ContextRuntime.getPluginToken();
    const results = await Promise.all([
      this.network(),
      this.mothership(pluginToken),
      this.websocket(pluginToken),
      this.linkedin(),
      this.linkedinNavigator(),
    ]);

    return {
      network: results[0],
      platform: results[1],
      websocket: results[2],
      linkedIn: results[3],
      salesNavigator: results[4],
      version: chrome.app.getDetails().version,
    };
  }

  network() {
    return fetch('https://www.google.com')
      .then((response) => {
        if (response.ok) {
          return { success: true, text: 'Network: connected', link: null };
        }
        throw new Error();
      })
      .catch((error) => {
        return { success: false, text: 'Network: disconnected', link: null };
      });
  }

  mothership(token) {
    const success = token && true;
    if (success) return { success: true, text: 'Mothership: Ok', link: null };
    return {
      success: false,
      text: 'Login in Mothership',
      link: 'https://app.outboundworks.com/login',
    };
  }

  websocket(token) {
    const success = token && true;
    const error = {
      success: false,
      text: 'Login in SDR',
      link: 'https://app.outboundworks.com/login',
    };
    if (!success) {
      return error;
    }

    return fetch(config.pluginUrl + '/pusher/whoami', {
      headers: { 'X-Plugin-Token': token },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error();
      })
      .then((data) => {
        return {
          success: true,
          text: 'SDR: ' + data.user_info.name + ' ' + data.user_info.email,
          link: null,
        };
      })
      .catch((_e) => {
        return error;
      });
  }

  linkedin() {
    const error = {
      success: false,
      text: 'Login to LinkedIn',
      link: 'https://linkedin.com/login',
    };
    const success = { success: true, text: 'LinkedIn: Ok', link: null };

    return fetch('https://www.linkedin.com/', { credentials: 'include' })
      .then((response) => {
        if (response.ok) {
          return response.text();
        }
        throw new Error();
      })
      .then((data) => {
        if (data.includes('login-form')) {
          return error;
        }
        return success;
      })
      .catch((_e) => {
        return error;
      });
  }

  linkedinNavigator() {
    const error = {
      success: false,
      text: 'Login to LinkedIn Sales Navigator',
      link: 'https://business.linkedin.com/sales-solutions/sales-navigator',
    };
    const success = {
      success: true,
      text: 'LinkedIn Sales Navigator: Ok',
      link: null,
    };

    return fetch('https://www.linkedin.com/sales', { credentials: 'include' })
      .then((response) => {
        if (response.ok) {
          if (response.redirected) {
            return response.url;
          }
          return response.text();
        }
        throw new Error();
      })
      .then((data) => {
        const cc = data.includes('contract-chooser');
        const gnt = data.includes('global-nav-typeahead');
        if (cc || gnt) {
          return success;
        }
        return error;
      })
      .catch((_e) => {
        return error;
      });
  }

  discoverOrg() {
    const error = {
      success: false,
      text: 'Login to DiscoverOrg',
      link: 'https://go.discoverydb.com/eui/#/login',
    };
    // const success = { success: true, text: 'DiscoverOrg: Ok', link: null }

    return new Promise((resolve, reject) => {
      resolve(error);
      // PROBLEM - Opens a new tab everytime it needs to check the status

      // chrome.tabs.create({ url: 'https://go.discoverydb.com/eui/' }, function(tab) {
      //   chrome.tabs.onUpdated.addListener(function(tabId, changed, _tab){
      //     if(changed.status === 'complete' && _tab.id === tab.id) {
      //       const url = _tab.url
      //       chrome.tabs.remove(tab.id)
      //
      //       if(url.includes('login')) { resolve(error) }
      //       else { resolve(success) }
      //     }
      //   });
      // });

      // // PROBLEM - cookie is not accesible

      // const attrs = { url: "https://go.discoverydb.com", name: "JSESSIONID" }
      // chrome.cookies.get(attrs, (cookie) => {
      //   if (cookie) resolve({ success: true, text: 'DiscoverOrg: Ok', link: null })
      //   if (!cookie) resolve(error)

      // PROBLEM - response is the same always

      //   $.ajax({ url: 'https://go.discoverydb.com/eui/', method: "GET" })
      //   .done(function (response, status, xhr) {
      //     console.log('maxi1234', response, status, xhr)
      //     if(response.includes('login-form')) resolve(error)
      //     resolve({ success: true, text: 'DiscoverOrg: Ok', link: null })
      //   })
      //   .fail(() => resolve(error))
      // })
    });
  }
}
