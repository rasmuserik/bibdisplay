import {encode, decode} from "cbor-x";
let session = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(18))));
function rpc(server) {
  return new Proxy({}, {
    get: (target, fnName) => async (...args) =>
      decode(new Uint8Array(await
        (await fetch(`${server}/${fnName}`, {
          method: 'POST',
          body: encode(args),
          headers: { 'Authorization': `Bearer ${session}` }
        })).arrayBuffer()
      ))
  });
}

export let server = rpc("https://api.veduz.com/v3")
