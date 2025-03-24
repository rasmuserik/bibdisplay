//import "../oss/bib/admin/main.jsx"
import { bibdisplay } from "./bibdisplay";
import ReactDOM from "react-dom/client";
import React from "react";
import { BibAdmin } from "./BibAdmin";
import { DisplayStats } from "./DisplayStats";

async function main() {
  if (location.search === "?stats") {
    ReactDOM.createRoot(document.getElementById("root")).render(
      <React.StrictMode>
        <style>
          {`
body {
  font-family: sans-serif;
  margin: 3ex;
}
`}
        </style>
        <DisplayStats />
      </React.StrictMode>
    );
  } else if (location.search === "?admin") {
    ReactDOM.createRoot(document.getElementById("root")).render(
      <React.StrictMode>
        <style>
          {`
body {
  font-family: sans-serif;
  margin: 3ex;
}
input {
  width: 99%
}
label {
  margin-top: 1ex;
}
div {
  margin: 1ex 0 1ex 0;

}
`}
        </style>

        <BibAdmin />
      </React.StrictMode>,
    );
  } else {
    bibdisplay();
  }
}
main();
