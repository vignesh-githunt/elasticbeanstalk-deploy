/* global chrome */
// import Config from '../config';
import StatusChecker from '../utils/status-checker';
import StatusCheckerNotifier from '../utils/status-checker-notifier';
import loggingService from '../utils/logging-service';
import fetchProvider from '../fetch';
import fetchGraphqlProvider from '../fetch-graphql';
import { addLinkedInCsrfTokenHeader } from './csrf-token-header';
import LoggingService from './services/LoggingService';
import FetchableService from './services/FetchableService';
import ContractChooserResolver from './services/ContractChooserResolver';
import dispatcher from '../dispatcher';
import ContextRuntime from '../contextruntime';
import { pusherInit } from './pusher-init';
import { SIDEBAR_EVENTS } from '../constants';
import * as Utils from './helpers';

const statusChecker = new StatusCheckerNotifier(
  new StatusChecker(),
  loggingService
);

let logger;
let pusher;

const GlobalGoldmine = {};

class GoldmineBackend {
  constructor() {
    this.pusher = pusher;

    const platformFetch = fetchProvider((headers) =>
      Object.assign({}, headers, {
        'X-Plugin-Token': ContextRuntime.getPluginToken(),
      })
    );

    const targetFetch = fetchProvider(addLinkedInCsrfTokenHeader);
    const fetchGraphql = fetchGraphqlProvider(platformFetch);
    this.fetchGraphql = fetchGraphql;
    logger = new LoggingService(fetchGraphql);
    this.logger = logger;

    GlobalGoldmine.contractChooserResolver = new ContractChooserResolver(
      targetFetch,
      logger
    );
    GlobalGoldmine.fetchableService = new FetchableService(
      logger,
      platformFetch,
      targetFetch
    );
  }

  init(userMeta) {
    this.initListeners();
    if (ContextRuntime.getContext().user) {
      this.login();
    }
    console.log('Goldmine Init');
    // start queue polling with the fetchable service
    GlobalGoldmine.fetchableService.startQueuePolling();
    // start polling the status notifier
    statusChecker.startNotifyPolling();
  }

  login() {
    // pusherInit with pluginToken
    if (!this.pusher) {
      pusherInit(ContextRuntime.getPluginToken()).then((result) => {
        this.pusher = result;
        //window.postMessage({message: 'pusher_authenticated_from_sdr_flow'}, "*");
        this.ensureUserChannel();
      });
    }
  }

  logout() {
    console.log('logout');
    ContextRuntime.removePluginToken();
    // Clear storage
    // Stop Notify Polling
    // Stop Queue Polling
    // leaveUserChannel
  }

  ensureUserChannel() {
    // call whoami to get userId and Email ( no need )
    // redo this so that it uses the platformFetch
    // call join user Channel

    if (ContextRuntime.getContext().user) {
      if (this.pusher.connection.state === 'connected') {
        if (this.pusher.allChannels().length === 0) {
          //this.pusher.connect();
          logger.info('No pusher channels active, attempting to join');
          this.joinUserChannel();
        } else {
          const channel = this.pusher.allChannels()[0];
          if (channel.subscriptionPending) {
            //stuck in a weird state - lets reconnect
            logger.warn(
              'Pusher channel subscription pending, attempting to subscribe'
            );
            channel.subscribe();
          }
        }
      } else {
        console.log('pusher not connected');
      }
    }
  }

  joinUserChannel() {
    // join private channel

    const channel = this.pusher.subscribe(
      'private-user-' + ContextRuntime.getContext().user.id
    );
    channel.bind('upgrade-notification', function (data) {
      Utils.notifyUpgrade(data.message);
    });

    channel.bind('notification', function (data) {
      Utils.createNotification(data);
    });

    channel.bind('server-notification', function (data) {
      Utils.notifyAdmin(data);
    });

    channel.bind('minables-updated', function () {
      logger.info('Server notified fetchable queue has been updated');
      console.log('Fetchableservice:', GlobalGoldmine.fetchableService);
      GlobalGoldmine.fetchableService.fetchNextQueueItemIfNotProcessing();
    });

    channel.bind('minables-restart', function (data) {
      logger.info('Server notified to restart fetchable queue process');
      GlobalGoldmine.fetchableService.fetchNextQueueItemIfNotProcessing();
    });

    channel.bind('open-sales-nav', function (event) {
      const eventData = JSON.parse(event.message);
      // attempts to resolve the contract chooser interstitial
      logger.info('Server requested resolving contract chooser');
      GlobalGoldmine.contractChooserResolver
        .resolveContractChooser(eventData.linkedInPageInstance)
        .then(() =>
          GlobalGoldmine.fetchableService.fetchNextQueueItemIfNotProcessing()
        );
    });

    channel.bind('send-status', function () {
      logger.info('Server asked client to send status');
      statusChecker.notify();
    });

    ContextRuntime.setPusherInitCompleted();
    dispatcher.sendMessage('pusher:connected');
    //statusChecker.notify();
    // subscribe to events
  }

  leaveUserChannel() {
    if (ContextRuntime.getContext().user) {
      this.pusher.unsubscribe(
        'private-user-' + ContextRuntime.getContext().user.id
      );
    }
  }

  requestPermissions() {
    console.log('requesting permissions');
    chrome.permissions.request(
      {
        origins: ['https://*/*'],
      },
      function (granted) {
        return granted
          ? (dispatcher.sendMessage('permissions:granted'),
            console.log('granted permissions'))
          : (dispatcher.sendMessage('permissions:denied'),
            console.log('permissions denied'));
      }
    );
  }

  checkPermissions() {
    console.log('checking permissions');
    chrome.permissions.getAll(function (t) {
      console.log(t);
    });
    chrome.permissions.contains(
      {
        origins: ['https://*/*'],
      },
      function (t) {
        return t
          ? (dispatcher.sendMessage('permissions:granted'),
            console.log('granted already permissions'))
          : (dispatcher.sendMessage('permissions:denied'),
            console.log('permissions currently denied'));
      }
    );
  }

  initListeners() {
    dispatcher.onMessage(SIDEBAR_EVENTS.USER_AUTHENTICATED, () => {
      this.login();
    });
    dispatcher.onMessage('logout:completed', () => {
      this.logout(); //maybe we should keep the user logged in for passive prospecting actions
    });
  }
}

export default new GoldmineBackend();
