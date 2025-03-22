import ReactDOM from "react-dom/client";
import React, { useEffect, useState } from "react";
import { loadJSON } from "./veduz/storage.mjs";
import { array_shuffle } from "./veduz/util.mjs";
import { WorkOverlay } from "./WorkOverlay";
import { Carousel } from "./Carousel";
import { server } from "./veduz/veduz.mjs";


let timer = Date.now();
function resetTimer() {
  timer = Date.now();
}
setInterval(() => {
  if (Date.now() - timer > 1000 * 60 * 5) {
    if(location.search !== "?admin") location.reload();
  }
}, 500);
function BibDisplay({ carousels }) {
  const [currentWork, showWork] = useState(null);
  return (
    <div
      style={{
        fontSize: window.innerWidth > 1500 ? "2rem" : "1rem",
      }}
      onPointerDown={resetTimer}
    >
      {currentWork && (
        <WorkOverlay
          currentWork={currentWork}
          hideWork={() => {
            server.log("BIBDISPLAY_HIDE_WORK_" + location.search.slice(1), currentWork.pid || currentWork.url);
            showWork(null)}}
        />
      )}
      {carousels.map((carousel) => (
        <Carousel
          works={carousel.results}
          title={carousel.title}
          showWork={(work) => {
            server.log("BIBDISPLAY_SHOW_WORK_" + location.search.slice(1), work.pid || work.url);
            showWork(work)
          }}
          showcase={carousel.showcase}
        />
      ))}
    </div>
  );
}

export async function bibdisplay() {
  let displayName = location.search.slice(1);
  let carousels = [];
(async () => {
  server.log("BIBDISPLAY_ALIVE_" + location.search.slice(1), displayName);
  let work = await server.getWork("870970-basis:48953786");
  await sleep(60000);
})();

  try {
    carousels = await loadJSON("displays/" + displayName + ".json");
  } catch (e) {
    return ReactDOM.createRoot(document.getElementById("root")).render(
      <React.StrictMode>
        <h1 style={{ fontWeight: 300, color: "#999", margin: "2rem" }}>
          [Skærmen "{displayName}" mangler indhold]
        </h1>
      </React.StrictMode>,
    );

    console.error(e);
  }
  for (const carousel in carousels) {
    if (carousels[carousel].shuffle)
      carousels[carousel].results = array_shuffle(carousels[carousel].results);
  }

  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <style>
        {`
::-webkit-scrollbar {
  width: 0px;
  background: transparent; /* make scrollbar transparent */
}
div {
  -ms-overflow-style: none; 
  scrollbar-width: none;
}
body {
  -ms-overflow-style: none; 
  scrollbar-width: none;
  background: black;
  color: white;
  font-family: sans-serif;
}
bib-admin {
  background: white;
  color: black;
}
        `}
      </style>
      <BibDisplay carousels={carousels} />
    </React.StrictMode>,
  );
}

let lastInteraction = 0;
function hadInteraction() {
  if(Date.now() > lastInteraction +1000) {
    server.log("BIBDISPLAY_INTERACTION_" + location.search.slice(1));
    lastInteraction = Date.now();
  }
}

window.addEventListener("pointerdown", hadInteraction);
window.addEventListener("pointermove", hadInteraction);
window.addEventListener("scroll", hadInteraction);



