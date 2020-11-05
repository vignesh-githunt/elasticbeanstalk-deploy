import Config from "./config";

/**
 * A thin wrapper around the browser fetch api, it allows calling code to provide a function which adds to headers, e.g. for authorisation
 * One difference with the browser fetch api is this wrapper doesn't bubble up network errors, it catches them and returns an specific error object so calling
 * code doesn't need lots of try catches
 */
export default (additionalHeaders) => {
  return async (request, options = {}) => {
    if (typeof request === "string") {
      if (!/^https?:\/\//.test(request)) request = Config.serviceUrl + request;
    } else {
      throw new Error("Wrapped fetch only supports URL for request parameter");
    }

    options.headers = options.headers || {};
    if (additionalHeaders) {
      options.headers = await additionalHeaders(options.headers);
    }

    return window.fetch(request, options).catch((err) => {
      // this only catches network errors, catch here and return a request-like object with an error message
      return {
        status: 0,
        text: () =>
          new Promise((resolve) =>
            resolve(`A network error ocurred - ${err.message}`)
          ),
      };
    });
  };
};
