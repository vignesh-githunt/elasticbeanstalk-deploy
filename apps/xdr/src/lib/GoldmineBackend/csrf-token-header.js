/* global chrome */
export const addLinkedInCsrfTokenHeader = (headers) => {
  return new Promise(function (resolve) {
    chrome.cookies.get(
      { url: "https://www.linkedin.com", name: "JSESSIONID" },
      (cookie) => {
        if (!cookie) return;
        const match = cookie.value.match(/(ajax:[0-9]+)/);
        if (!match.length) return;
        resolve(Object.assign({}, headers, { "csrf-token": match[0] }));
      }
    );
  });
};
