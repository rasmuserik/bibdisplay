import {encode, decode} from "cbor-x";
let session = localStorage.getItem("veduz_session");
if (!session) { 
  session = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(18))));
  localStorage.setItem("veduz_session", session);
}
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
