import QRCode from "react-qr-code";
import React from "react";

export function WorkOverlay({ currentWork, hideWork }) {
    let work = currentWork;
    return (
      <div
        style={{
          position: "fixed",
          background: "rgba(100, 100, 100, 0.8)",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}
        onClick={() => hideWork()}
      >
        <div
          style={{
            background: "white",
            maxWidth: "95%",
            maxHeight: "90%",
            borderRadius: 10,
          }}
        >
          <div
            style={{
              position: "relative",
              top: 0,
              left: 0,
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <span
              style={{
                width: 30,
                height: 30,
                margin: -15,
                background: "white",
                borderRadius: 40,
                color: "black",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 16,
                border: "1px solid #666",
              }}
            >
              ⨉
            </span>
          </div>
          <div
            style={{
              padding: "30px 20px 30px 20px",
              overflow: "auto",
              color: "black",
              display: "flex",
              justifyContent: "space-around",
              alignItems: "start",
            }}
          >
            <img
              src={work.cover.detail}
              style={{
                maxWidth: "25%",
                outline: "1px solid white",
                boxShadow: "10px 10px 30px 0px rgba(0,0,0,0.75)",
              }}
            />
            <div
              style={{
                display: "inline-block",
                maxWidth: "45%",
              }}
            >
              <h1
                style={{
                  marginTop: 0,
                }}
              >
                {work.titles?.full}
              </h1>
              {work?.creators?.length ? (
                <h2>Af {work.creators.map((o) => o.display).join(" & ")}</h2>
              ) : null}
              {work?.materialTypes?.length ? (
                <p>
                  <em>{work.materialTypes[0]?.materialTypeSpecific?.display}</em>
                </p>
              ) : null}
              <div>{work?.abstract?.[0]}</div>
  
              {/*<a href={"https://bib.ballerup.dk/work/work-of:" + work.pid}>test</a>*/}
            </div>
            <div
              style={{
                width: "12%",
                flexShrink: 0,
              }}
            >
              <QRCode
                style={{
                  width: window.innerWidth * 0.1,
                  height: window.innerWidth * 0.1,
                }}
                value={"https://bib.ballerup.dk/work/work-of:" + work.pid}
              />
              Scan og lån
            </div>
          </div>
        </div>
      </div>
    );
  }