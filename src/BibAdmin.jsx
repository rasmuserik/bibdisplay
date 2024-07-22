import React from "react";
import useBibAdminsState from "./bibadminsstate.mjs";
import { Carousel } from "./Carousel";

function Setting({ label, value, onChange }) {
  return (
    <>
      <label htmlFor={label}>{label}:</label>
      <input id="label" value={value} onChange={onChange} />
    </>
  );
}

export function BibAdmin() {
  const { currentDisplay, token, agency, username, password, loggedIn, searchProfile } =
    useBibAdminsState((state) => state.ui);
  const {
    setCurrentDisplay,
    setToken,
    setSearchProfile,
    setAgency,
    addCarousel,
    toggleShuffle,
    setTitle,
    setQuery,
    setUsernamePassword,
  } = useBibAdminsState((state) => state.actions);
  const fbiToken = useBibAdminsState((state) => state.fbiToken);
  const display = useBibAdminsState((state) => state.display);

  return (
    <>
      <div
        style={{
          className: "bib-admin",
          display: "flex",
          flexDirection: "column",
          fontFamily: "sans-serif",
        }}
      >
        <Setting
          label="Brugernavn"
          value={username}
          onChange={(e) => setUsernamePassword(e.target.value, password)}
        />
        <Setting
          label="Kode"
          value={password}
          onChange={(e) => setUsernamePassword(username, e.target.value)}
        />
        {loggedIn ? (
          "Logget ind"
        ) : (
          <div>
            <b style={{ color: "red" }}>
              Kunne ikke logge ind, så ændringer bliver ikke gemt.
            </b>{" "}
            Enten er brugernavn/kode forkert, eller der er ingen forbindelse til
            serveren.
          </div>
        )}
        <div style={{ opacity: loggedIn ? 1 : 0.3 }}>
          <Setting
            label="FBI Token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <Setting
            label="Søgeprofil"
            value={searchProfile}
            onChange={(e) => setSearchProfile(e.target.value)}
          />
          {/* 
          <Setting
            label="Agency"
            value={agency}
            onChange={(e) => setAgency(e.target.value)}
          />
          */}
          <Setting
            label="Display name"
            value={currentDisplay}
            onChange={(e) => setCurrentDisplay(e.target.value)}
          />
          <button onClick={addCarousel}>Tilføj Karrusel</button>
          {display.map((carousel, i) => (
            <div key={i}>
              <div>
                <label htmlFor={`title${i}`}>Overskrift:</label>
                <input
                  id={`title${i}`}
                  value={carousel.title}
                  onChange={(e) => setTitle(i, e.target.value)}
                />
              </div>
              <div>
                <label htmlFor={`query${i}`}>Query:</label>
                <input
                  id={`query${i}`}
                  value={carousel.query}
                  onChange={(e) => setQuery(i, e.target.value)}
                />
              </div>
              <div
                style={{
                  textAlign: "left",
                  // row
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <input
                  id={`shuffle${i}`}
                  style={{ width: 40 }}
                  type="checkbox"
                  checked={carousel.shuffle}
                  onChange={() => toggleShuffle(i)}
                />
                <label htmlFor={`shuffle${i}`}>Shuffle</label>
              </div>
              
              <Carousel works={carousel.results} title={carousel.title} />
                    {/*
              <div style={{ display: "flex", flexDirection: "row" }}>
                {carousel?.results?.map((result, j) => (
                  <div
                    key={j}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: 200,
                      flex: 0,
                    }}
                  >
                    <img src={result.cover.detail} style={{ height: 100 }} />
                  </div>
                ))}
              </div>
                  */}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
