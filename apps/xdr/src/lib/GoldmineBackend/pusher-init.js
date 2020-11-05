import Pusher from "pusher-js";
// import debugLog from "lib/goldmine/debug-log";
import Config from "../config";

export function pusherInit(pluginToken) {
  // Pusher
  if (Config.debug) {
    Pusher.log = function (message) {
      window.console.log("PUSHER DEBUG: " + message);
    };
  }

  return new Promise((resolve) => {
    console.log("inside pusher init")
    var pusher;
    if (Pusher.instances.length > 0) {
      console.log("Pushre instances length", Pusher.instances.length);
      pusher = Pusher.instances[0];
      if (pusher.connection.state !== "connected") {
        pusher.connect();
      }
    } else {
      console.log("Authenticating")
      pusher = new Pusher(Config.pusherAppKey, {
        cluster: Config.pusherCluster,
        encrypted: true,
        authEndpoint: Config.pluginUrl + "/pusher/auth",
        auth: {
          headers: {
            "X-Plugin-Token": pluginToken,
          },
        },
      });
    }
    pusher.connection.bind("error", function (err) {
      Pusher.log("There was an error when connecting: ");
      Pusher.log(err);
    });

    pusher.connection.bind("connected", () => {
      resolve(pusher);
    })
  });
}
export {
  Pusher, // the class
};
