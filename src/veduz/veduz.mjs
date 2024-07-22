import { call } from "./messaging.mjs";
const v = (self.veduz = self.veduz || {});
v.server =
  v.server ||
  new Proxy(
    {},
    {
      get(target, prop, reciever) {
        return (args) => call(0, prop, args);
      },
    },
  );
v.log =
  v.log ||
  function log(log_type, ...args) {
    console.log("LOG", log_type, ...args);
    if (typeof log_type !== "string") {
      log_type = "CLIENT_LOG";
      args.unshift(log_type);
    }
    call(0, "log", { log_type, args });
  };

export let server = v.server;
export let log = v.log;
