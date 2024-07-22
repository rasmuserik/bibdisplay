import React from "react";

function materialIcon(work) {
    let type = work?.materialTypes?.[0]?.materialTypeSpecific?.display
    if(type.match(/lydbog/i)) return "audiobook.webp"
    if(type.match(/e-bog/i) || type.match(/bog.*online/i)) return "ebook.webp"
    if(type.match(/gameboy|nintendo|computerspil|playstation|psp|wii|xbox/i)) return "game.webp"
    if(type.match(/film|tv-serie/i)) return "movies.webp"
    if(type.match(/musik|node/i)) return "music.webp"
    if(type.match(/bog/i)) return "book.webp"
    return "articles.webp"
}

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
            paddingLeft: window.innerWidth/30,
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
            paddingLeft: window.innerWidth/30,
          }}
        >
          {works &&
            works.map((work) => (
                <div style={{
                    display: "inline-block",
                    position: "relative",
                    height: 290 *window.innerWidth/1000,
                  marginRight: window.innerWidth/15,
                  marginBottom: window.innerWidth/15,
                }}
                key={work.pid}
                >
                    <img src={materialIcon(work)} style={{
                        height: window.innerWidth/15,
                        position: "absolute",
                        left: -window.innerWidth / 30,
                        bottom: -window.innerWidth / 30,
                        borderRadius: 5,
                        background: "rgba(0,0,0,0.7)"
                    }}
                    />
              <img
                src={work.cover.detail}
                style={{
                  //height: 275*scale,
                  height: 290 *window.innerWidth/1000,
                  // margin: "0 40px 40px 0"
                  marginTop: 0,
                  marginLeft: 0,
                }}
                key={work.pid}
                onClick={() => showWork(work)}
              />
                </div>
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
  