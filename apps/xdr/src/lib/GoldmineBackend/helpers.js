/* global chrome */
import Config from '../config';

var notificationOnClickedCallbacks = [];
var notificationOnButtonClickedCallbacks = [];

export function notifyAdmin(message) {
  var opts = {
    type: 'basic',
    iconUrl: 'icons/icon128.png',
    title: 'XDR Notification',
    message: message.toString(),
  };

  var now = new Date();
  var id = now.getTime().toString();
  chrome.notifications.create(id, opts, function () {
    /* Error checking goes here */
  });
}

export function notifyUpgrade(message) {
  var opts = {
    type: 'basic',
    iconUrl: 'icons/icon128.png',
    title: 'XDR Notification',
    message: message.toString(),
    buttons: [
      {
        title: 'Upgrade',
      },
    ],
  };

  var now = new Date();
  var id = now.getTime().toString();

  notificationOnButtonClickedCallbacks[id] = [];
  notificationOnButtonClickedCallbacks[id][0] = function () {
    chrome.tabs.create({ url: Config.serviceUrl + '/setup/billing' });
  };

  chrome.notifications.create(id, opts, function (id) {
    // var myNotificationID = id;
  });
}

export function createNotification(notification_data) {
  var now = new Date();
  var id = now.getTime().toString();

  if (notification_data.onClick) {
    // eslint-disable-next-line
    notificationOnClickedCallbacks[id] = new Function(
      notification_data.onClick
    );
  }

  if (
    notification_data.onButtonClick &&
    notification_data.onButtonClick.length > 0
  ) {
    notificationOnButtonClickedCallbacks[id] = [];

    for (var i = 0; i < notification_data.onButtonClick.length; i++) {
      // eslint-disable-next-line
      notificationOnButtonClickedCallbacks[id][i] = new Function(
        notification_data.onButtonClick[i]
      );
    }
  }

  chrome.notifications.create(id, notification_data.opts, function () {
    /* Error checking goes here */
  });
}

export function setBadge(count) {
  chrome.browserAction.setBadgeBackgroundColor({ color: '#faa732' });
  if (count <= 0) count = '';
  chrome.browserAction.setBadgeText({ text: count.toString() });
}

window.base64 = function base64(data) {
  var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  var o1,
    o2,
    o3,
    h1,
    h2,
    h3,
    h4,
    bits,
    i = 0,
    ac = 0,
    enc = '',
    tmp_arr = [];

  if (!data) {
    return data;
  }

  data = utf8Encode(data);

  do {
    // pack three octets into four hexets
    o1 = data.charCodeAt(i++);
    o2 = data.charCodeAt(i++);
    o3 = data.charCodeAt(i++);

    bits = (o1 << 16) | (o2 << 8) | o3;

    h1 = (bits >> 18) & 0x3f;
    h2 = (bits >> 12) & 0x3f;
    h3 = (bits >> 6) & 0x3f;
    h4 = bits & 0x3f;

    // use hexets to index into b64, and append result to encoded string
    tmp_arr[ac++] =
      b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
  } while (i < data.length);

  enc = tmp_arr.join('');

  switch (data.length % 3) {
    case 1:
      enc = enc.slice(0, -2) + '==';
      break;
    case 2:
      enc = enc.slice(0, -1) + '=';
      break;
    default:
      break;
  }

  return enc;

  function utf8Encode(string) {
    string = (string + '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    var utftext = '',
      start,
      end;
    var stringl = 0,
      n;

    start = end = 0;
    stringl = string.length;

    for (n = 0; n < stringl; n++) {
      var c1 = string.charCodeAt(n);
      var enc = null;

      if (c1 < 128) {
        end++;
      } else if (c1 > 127 && c1 < 2048) {
        enc = String.fromCharCode((c1 >> 6) | 192, (c1 & 63) | 128);
      } else {
        enc = String.fromCharCode(
          (c1 >> 12) | 224,
          ((c1 >> 6) & 63) | 128,
          (c1 & 63) | 128
        );
      }
      if (enc !== null) {
        if (end > start) {
          utftext += string.substring(start, end);
        }
        utftext += enc;
        start = end = n + 1;
      }
    }

    if (end > start) {
      utftext += string.substring(start, string.length);
    }

    return utftext;
  }
};
