let synced = {};

export function sync(arg) {
  let { serverPath, localPath, get, update } = arg;
  synced[localPath] = arg;
  console.log("sync", arg);
}
