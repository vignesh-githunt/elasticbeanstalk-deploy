/* global chrome */
export default async (request, options = {}) => {
  return new Promise((resolve) => {
    const callback = (value) => {
      const result = {};
      result.ok = value.ok;
      result.status = value.status;
      result.text = () =>
        new Promise((res, reject) => {
          res(value.text);
        });
      resolve(result);
    };
    chrome.runtime.sendMessage(
      { type: 'platform-fetch-request', request, options },
      callback
    );
  });
};
