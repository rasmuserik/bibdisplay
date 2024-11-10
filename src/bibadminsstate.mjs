import { create } from "zustand";
import { server } from "./veduz/veduz.mjs";
import { sleep } from "./veduz/util.mjs";
import { search } from "./fbi.js";
import { loadJSON, login, saveJSON } from "./veduz/storage.mjs";

const useBibAdminsState = create((set, get) => {
  // Try to login on startup using stored credentials
  const username = localStorage.getItem("bibadmin-username") || "";
  const password = localStorage.getItem("bibadmin-password") || "";
  if (username && password) {
    login(username, password).then(async loggedIn => {
      console.log("loggedIn", loggedIn);
      set(state => ({ ui: { ...state.ui, loggedIn } }));
      if (!loggedIn && await login(username, password)) {
        set(state => ({ ui: { ...state.ui, loggedIn: true } }));
      }
    });
  }

  return ({
    display: [],
    ui: {
      webdavServer: "",
      agency: "715700", 
      currentDisplay: "",
      loggedIn: false,
      username,
      password,
      token: "",
      searchProfile: "",
    },
    fbiToken: "",
    actions: {
      setUsernamePassword: async (username, password) => {
        set((state) => ({ ui: { ...state.ui, username, password } }));
        localStorage.setItem("bibadmin-username", username);
        localStorage.setItem("bibadmin-password", password);
        const loggedIn = await login(username, password);
        let prev = get().ui;
        if (prev.username === username && prev.password === password) {
          set((state) => ({ ui: { ...state.ui, loggedIn } }));
        }
      },
      setWebdavServer: (webdavServer) =>
        set((state) => ({ ui: { ...state.ui, webdavServer } })),
      setToken: async (token) => {
        token = token.trim();
        set((state) => ({ ui: { ...state.ui, token } }));
        set({ fbiToken: token });
      },
      setSearchProfile: (searchProfile) => {
        set((state) => ({ ui: { ...state.ui, searchProfile } }));
      },
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
      setShowcase: (index, showcase) => {
        set((state) => {
          let display = [...state.display];
          display[index].showcase = showcase;
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
        let results = await search({ cql: query, agency: get().ui.agency, token: get().ui.token, searchProfile: get().ui.searchProfile });
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
  });
});

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
