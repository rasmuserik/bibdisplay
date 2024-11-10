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
    setShowcase,
  } = useBibAdminsState((state) => state.actions);
  const fbiToken = useBibAdminsState((state) => state.fbiToken);
  const display = useBibAdminsState((state) => state.display);
  console.log("setShowcase", setShowcase);

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
          <div>Logget ind, og <b>HUSKER brugenavn/kode</b>, så <b style={{color: "red"}}>husk at logge ud</b> (fjern koden herover).</div>

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

              <div style={{ marginTop: "10px" }}>
                {carousel.showcase ? (
                  <div style={{outline: "1px solid black", margin: 0, padding: 10, borderRadius: 10}}>
                    <h2>Showcase</h2>
                    <button onClick={() => setShowcase(i, null)}>Fjern Showcase</button>
                    <div>
                      <label htmlFor={`showcaseImage${i}`}>Billede:</label>
                      <input
                        id={`showcaseImage${i}`}
                        value={carousel.showcase.image || ''}
                        onChange={(e) => setShowcase(i, { ...carousel.showcase, image: e.target.value })}
                      />
                    </div>
                    <div>
                      <label htmlFor={`showcaseTitle${i}`}>Titel:</label>
                      <input
                        id={`showcaseTitle${i}`}
                        value={carousel.showcase.title || ''}
                        onChange={(e) => setShowcase(i, { ...carousel.showcase, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <label htmlFor={`showcaseDesc${i}`}>Beskrivelse:</label>
                      <input
                        id={`showcaseDesc${i}`}
                        value={carousel.showcase.description || ''}
                        onChange={(e) => setShowcase(i, { ...carousel.showcase, description: e.target.value })}
                      />
                    </div>
                    <div>
                      <label htmlFor={`showcaseUrl${i}`}>URL:</label>
                      <input
                        id={`showcaseUrl${i}`}
                        value={carousel.showcase.url || ''}
                        onChange={(e) => setShowcase(i, { ...carousel.showcase, url: e.target.value })}
                      />
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setShowcase(i, { image: '', title: '', description: '', url: '' })}>
                    Tilføj Showcase
                  </button>
                )}
              </div>
              
              <Carousel works={carousel.results} title={carousel.title} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
