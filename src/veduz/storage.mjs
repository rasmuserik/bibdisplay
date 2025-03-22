const webdavServer = "https://webdav.bibdata.dk/";
let username = "";
let password = "";

export async function saveBinary(data) {
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashBase64 = btoa(String.fromCharCode(...hashArray))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  const url = webdavServer + "files/" + hashBase64;

  const checkResponse = await fetch(url, {
    method: "HEAD",
    headers: {
      Authorization: "Basic " + btoa(username + ":" + password),
    },
  });
  if (checkResponse.ok) {
    return url;
  }

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: "Basic " + btoa(username + ":" + password),
    },
    body: data,
  });

  if (!response.ok) {
    throw new Error(
      `Failed to save binary: ${response.status} ${response.statusText}`,
    );
  }

  return url;
}

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
