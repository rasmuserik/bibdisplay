const webdavServer = "https://webdav.bibdata.dk/";
let username = "";
let password = "";

export async function saveJSON(path, data) {
  let response = await fetch(webdavServer + path, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + btoa(username + ":" + password),
    },
    body: JSON.stringify(data),
  });
  return response;
}
export async function loadJSON(path) {
  let response = await fetch(webdavServer + path, {
    headers: {
      // basic auth
      Authorization: "Basic " + btoa(username + ":" + password),
    },
  });
  return await response.json();
}
export async function login(user, pass) {
  username = user;
  password = pass;

  try {
    let now = Date.now() + String(Math.random()).slice(1);
    await saveJSON("lastlogin", now);
    let serverLastlogin = await loadJSON("lastlogin");
    console.log("login", now, serverLastlogin);
    return now === serverLastlogin;
  } catch (e) {
    console.log(e);
  }
  return false;
}
