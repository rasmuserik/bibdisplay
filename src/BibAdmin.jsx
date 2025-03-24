import React, { useEffect } from "react";
import useBibAdminsState from "./bibadminsstate.mjs";
import { Carousel } from "./Carousel";
import { saveBinary } from "./veduz/storage.mjs";

function Setting({ label, value, onChange }) {
  return (
    <>
      <label htmlFor={label}>{label}:</label>
      <input id="label" value={value} onChange={onChange} />
    </>
  );
}

export function BibAdmin() {
  const {
    currentDisplay,
    token,
    agency,
    username,
    password,
    loggedIn,
    searchProfile,
  } = useBibAdminsState((state) => state.ui);
  const {
    swapCarousel,
    setCurrentDisplay,
    setToken,
    setSearchProfile,
    setAgency,
    addCarousel,
    deleteCarousel,
    toggleShuffle,
    setTitle,
    setQuery,
    setUsernamePassword,
    setShowcase,
    loadCurrentDisplay,
  } = useBibAdminsState((state) => state.actions);
  const fbiToken = useBibAdminsState((state) => state.fbiToken);
  const display = useBibAdminsState((state) => state.display);

  // Load display data when component mounts
  useEffect(() => {
    if (currentDisplay) {
      loadCurrentDisplay();
    }
  }, [currentDisplay, loadCurrentDisplay]);

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
          <div>
            Logget ind, og <b>HUSKER brugenavn/kode</b>, så{" "}
            <b style={{ color: "red" }}>husk at logge ud</b> (fjern koden
            herover).
          </div>
        ) : (
          <div>
            <b style={{ color: "red" }}>
              Kunne ikke logge ind, så ændringer bliver ikke gemt.
            </b>{" "}
            Enten er brugernavn/kode forkert, eller der er ingen forbindelse til
            serveren.
          </div>
        )}
        <div style={{ opacity: loggedIn ? 1 : 0.6, color: "#900" }}>
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
              <hr style={{ marginTop: 40, marginBottom: 40 }} />
              <div style={{ fontSize: 32 }}>
                {i < display.length - 1 && (
                  <span onClick={() => swapCarousel(i, i + 1)}>⬇️</span>
                )}{" "}
                {i > 0 && (
                  <span onClick={() => swapCarousel(i, i - 1)}>⬆️</span>
                )}{" "}
                <span
                  onClick={() => {
                    if (
                      window.confirm(
                        "Er du sikker på at du vil slette denne karrusel?",
                      )
                    ) {
                      deleteCarousel(i);
                    }
                  }}
                  style={{ cursor: "pointer" }}
                >
                  🗑️
                </span>
              </div>
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
                  <div
                    style={{
                      outline: "1px solid black",
                      margin: 0,
                      padding: 10,
                      borderRadius: 10,
                    }}
                  >
                    <h2>Showcase</h2>
                    <button onClick={() => setShowcase(i, null)}>
                      Fjern Showcase
                    </button>
                    <div>
                      <label htmlFor={`showcaseImage${i}`}>
                        Billede (url eller uploadet billede):
                      </label>
                      <input
                        type="text"
                        value={
                          carousel.showcase?.image &&
                          !carousel.showcase?.image?.startsWith(
                            "https://webdav.bibdata.dk",
                          )
                            ? carousel.showcase.image
                            : ""
                        }
                        onChange={(e) =>
                          setShowcase(i, {
                            ...carousel.showcase,
                            image: e.target.value,
                          })
                        }
                      />
                      <input
                        id={`showcaseImage${i}`}
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (file) {
                            try {
                              const arrayBuffer = await file.arrayBuffer();
                              const url = await saveBinary(arrayBuffer);
                              setShowcase(i, {
                                ...carousel.showcase,
                                image: url,
                              });
                            } catch (error) {
                              console.error("Failed to upload image:", error);
                              alert("Failed to upload image");
                            }
                          }
                        }}
                      />
                      {carousel.showcase.image && (
                        <img
                          src={carousel.showcase.image}
                          alt="Preview"
                          style={{ maxWidth: "200px", marginTop: "10px" }}
                        />
                      )}
                    </div>
                    <div>
                      <label htmlFor={`showcaseDesc${i}`}>Beskrivelse:</label>
                      <textarea
                        id={`showcaseDesc${i}`}
                        value={carousel.showcase.markdown || ""}
                        onChange={(e) =>
                          setShowcase(i, {
                            ...carousel.showcase,
                            markdown: e.target.value,
                          })
                        }
                        rows={4}
                        style={{
                          width: "95%",
                          resize: "vertical",
                          fontFamily: "sans-serif",
                        }}
                      />
                    </div>
                    <div>
                      <label htmlFor={`showcaseUrl${i}`}>URL:</label>
                      {carousel.showcase.url &&
                        !/https?:\/\//i.test(carousel.showcase.url) && (
                          <div style={{ color: "red", fontWeight: "bold" }}>
                            Advarsel: normalt starter url'en med https:// eller
                            lignende
                          </div>
                        )}
                      <input
                        id={`showcaseUrl${i}`}
                        value={carousel.showcase.url || ""}
                        onChange={(e) =>
                          setShowcase(i, {
                            ...carousel.showcase,
                            url: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label htmlFor={`date${i}`}>Udløbsdato:</label>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          gap: "10px",
                        }}
                      >
                        <input
                          type="checkbox"
                          id={`expires${i}`}
                          style={{ width: "auto" }}
                          checked={!!carousel.showcase.expires}
                          onChange={(e) =>
                            setShowcase(i, {
                              ...carousel.showcase,
                              expires: e.target.checked,
                            })
                          }
                        />
                        <input
                          id={`date${i}`}
                          type="date"
                          style={{ width: "auto" }}
                          value={carousel.showcase.expirydate || ""}
                          onChange={(e) => {
                            console.log(
                              "expiry",
                              e.target.value,
                              carousel.showcase.expires,
                              carousel.showcase.expirydate,
                            );
                            setShowcase(i, {
                              ...carousel.showcase,
                              expirydate: e.target.value,
                            });
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor={`fullwidth${i}`}>Fuld bredde:</label>
                      <div style={{ display: "flex", flexDirection: "row" }}>
                        <input
                          type="checkbox"
                          id={`fullwidth${i}`}
                          style={{ width: "auto" }}
                          checked={!!carousel.showcase.fullwidth}
                          onChange={(e) =>
                            setShowcase(i, {
                              ...carousel.showcase,
                              fullwidth: e.target.checked,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() =>
                      setShowcase(i, {
                        image: "",
                        title: "",
                        markdown: "",
                        url: "",
                      })
                    }
                  >
                    Tilføj Showcase
                  </button>
                )}
              </div>

              <div style={{ marginTop: 20 }}>Preview:</div>
              <div
                style={{
                  backgroundColor: "black",
                  color: "white",
                  overflow: "auto",
                  borderRadius: 10,
                }}
              >
                <Carousel
                  works={carousel.results}
                  title={carousel.title}
                  showcase={carousel.showcase}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
