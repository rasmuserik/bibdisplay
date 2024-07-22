import React from "react";

export function Carousel({ works, title, showWork }) {
    return (
      <>
        <h2
          style={{
            fontFamily: "FaktPro-SemiBold,sans-serif",
            fontSize: "1.5rem",
            fontWeight: 500,
            lineHeight: 24 + `px`,
            marginTop: 60,
            marginBottom: 20,
          }}
        >
          {title}
        </h2>
        <div
          style={{
            display: "block",
            whiteSpace: "nowrap",
            overflowX: "auto",
            scrollbarWidth: "none",
          }}
        >
          {works &&
            works.map((work) => (
              <img
                src={work.cover.detail}
                style={{
                  //height: 275*scale,
                  height: 290 *window.innerWidth/1000,
                  // margin: "0 40px 40px 0"
                  marginTop: 0,
                  marginRight: 40,
                  marginBottom: 40,
                  marginLeft: 0,
                }}
                key={work.pid}
                onClick={() => showWork(work)}
              />
            ))}
        </div>
        <hr
          style={{
            border: "1px solid #474747",
          }}
        />
      </>
    );
  }
  