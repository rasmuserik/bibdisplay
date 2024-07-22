import { create } from "zustand";
import { server } from "./veduz/veduz.mjs";
import { sleep } from "./veduz/util.mjs";
import { search } from "./fbi.js";
import { loadJSON, login, saveJSON } from "./storage.mjs";

const useBibAdminsState = create((set, get) => ({
  display: [],
  ui: {
    webdavServer: "",
    agency: "715700",
    currentDisplay: "",
    loggedIn: false,
    username: "",
    password: "",
  },
  fbiToken: "",
  actions: {
    setUsernamePassword: async (username, password) => {
      set((state) => ({ ui: { ...state.ui, username, password } }));
      const loggedIn = await login(username, password);
      let prev = get().ui;
      if (prev.username === username && prev.password === password) {
        set((state) => ({ ui: { ...state.ui, loggedIn } }));
      }
    },
    setWebdavServer: (webdavServer) =>
      set((state) => ({ ui: { ...state.ui, webdavServer } })),
    setAgency: async (agency) => {
      agency = agency.trim();
      set((state) => ({ ui: { ...state.ui, agency } }));
      let token = "";
      if (agency.length === 6) token = await server.fbiToken({ agency });
      if (agency.length === 0) token = await server.fbiToken();
      set({ fbiToken: token });
    },
    setTitle(index, title) {
      set((state) => {
        let display = [...state.display];
        display[index].title = title;
        return { display };
      });
      syncToServer(set, get);
    },
    toggleShuffle: (index) => {
      set((state) => {
        let display = [...state.display];
        display[index].shuffle = !display[index].shuffle;
        return { display };
      });
      syncToServer(set, get);
    },
    setQuery: async (index, query) => {
      set((state) => {
        let display = [...state.display];
        display[index].query = query;
        return { display };
      });

      let prevDisplay = get().display?.[index];
      await sleep(500);
      if (get().display?.[index] !== prevDisplay) return;
      let results = await search({ cql: query, agency: get().ui.agency });
      set((state) => {
        let display = [...state.display];
        if (display?.[index] === prevDisplay) display[index].results = results;
        return { display };
      });
      syncToServer(set, get);
    },
    setCurrentDisplay: (currentDisplay) => {
      set((state) => ({ ui: { ...state.ui, currentDisplay } }));
      syncFromServer(currentDisplay, set, get);
    },
    addCarousel: () => {
      set((state) => ({
        display: [
          ...state.display,
          { title: "", query: "", shuffle: false, results: [], maxResults: 20 },
        ],
      }));
      syncToServer(set, get);
    },
  },
}));

async function syncToServer(set, get) {
  let display = get().display;
  await sleep(1000);
  if (get().display !== display) return;
  await saveDisplay(get().ui.currentDisplay, display);
}
async function saveDisplay(name, display) {
  let displayName = encodeURIComponent(name + ".json");
  await saveJSON("displays/" + displayName, display);
}

async function syncFromServer(currentDisplay, set, get) {
  let displayName = encodeURIComponent(currentDisplay + ".json");
  let display;
  try {
    display = await loadJSON("displays/" + displayName);
  } catch (e) {
    display = [];
  }
  set((state) => ({ display, ui: { ...state.ui, currentDisplay } }));
}

export default useBibAdminsState;
