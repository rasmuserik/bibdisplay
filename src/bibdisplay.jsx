import ReactDOM from "react-dom/client";
import React, { useEffect, useState } from "react";
import { loadJSON } from "./veduz/storage.mjs";
import { array_shuffle } from "./veduz/util.mjs";
import { WorkOverlay } from "./WorkOverlay";
import { Carousel } from "./Carousel";


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
  console.log("carousels", carousels);
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
          hideWork={() => showWork(null)}
        />
      )}
      {carousels.map((carousel) => (
        <Carousel
          works={carousel.results}
          title={carousel.title}
          showWork={showWork}
          showcase={carousel.showcase}
        />
      ))}
    </div>
  );
}

export async function bibdisplay() {
  let displayName = location.search.slice(1);
  let carousels = [];
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
