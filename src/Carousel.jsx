import React from "react";
import { marked } from "marked";

function materialIcon(work) {
    let type = work?.materialTypes?.[0]?.materialTypeSpecific?.display
    if(type.match(/lydbog/i)) return "icons/audio.webp"
    if(type.match(/e-bog/i) || type.match(/bog.*online/i)) return "icons/ebook.webp"
    if(type.match(/gameboy|nintendo|computerspil|playstation|psp|wii|xbox/i)) return "icons/play.webp"
    if(type.match(/film|tv-serie/i)) return "icons/play.webp"
    if(type.match(/musik|node/i)) return "icons/audio.webp"
    if(type.match(/bog/i)) return "icons/books.webp"
    if(type.match(/podcast/i)) return "icons/podcast.webp"
    if(type.match(/magasin/i)) return "icons/magasin.webp"
    if(type.match(/avis/i)) return "icons/newspaper.webp"
    if(type.match(/artikel/i)) return "icons/document.webp"
    return "icons/magasin.webp"
}

// Podcast
// Fysisk bog books
// Film play
// E-bog
// Lydbog
// Magasin
// Avis
// Artikel

export function Carousel({ works, title, showWork, showcase }) {
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
            verticalAlign: "top",
            scrollbarWidth: "none",
            paddingLeft: window.innerWidth/30,
          }}
        >
          {showcase && (
            <div style={{
              display: "inline-block",
              position: "relative",
              marginRight: window.innerWidth/15,
              marginBottom: window.innerWidth/15,
              verticalAlign: "top",
              marginTop: 0,
              paddingTop: 0,
            }}
            className="showcase"
            onClick={() => showcase.url && showWork(showcase)}
            >
              {showcase.image && <img src={showcase.image} 
              style={{
                height: 290 *window.innerWidth/1000,
              }}
              />} 
              <style>
                {`
                h1, h2, h3, h4, h5, h6 {
                  margin-top: 0;
                  padding-top: 0;
                }
`}
              </style>
              <div style={{
                verticalAlign: "top",
                display: "inline-block",
                maxWidth: "60%",
                marginLeft: 40,
                marginRight: 40,
                fontFamily: "sans-serif",
                whiteSpace: "normal",
              }}
                dangerouslySetInnerHTML={{ __html: marked(showcase.markdown || '', {
                  sanitize: true,
                  gfm: true
                }) }}>
              </div>
            </div>
          )}
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
                        background: "rgba(0,0,0,0)"
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
  