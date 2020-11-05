/* global chrome */
import isBackground from "./isBackground";
import ChromeDispatcher from "./ChromeDispatcher";

let options;

if (isBackground()) {
  options = { server: true };
} else {
  options = {};
}

let dispatcher;
if (chrome && chrome.runtime) {
  dispatcher = new ChromeDispatcher(options);
}

export default dispatcher;
