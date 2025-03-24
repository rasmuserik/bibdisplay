import React from 'react';
import { server } from './veduz/veduz.mjs';

export function DisplayStats() {
  const [stats, setStats] = React.useState(null);

  React.useEffect(() => {
    (async () => {
      console.log(await server.fns());
      let displays = {total: 0};
      let entries = [...(await server.stat_entries("CLIENT_BIBDISPLAY")), ...(await server.stat_entries("REDIRECT_BIBDISPLAY"))];
      let stats = {dates: {}};
      let startDate = (new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).toISOString().slice(0, 10);
      for(let entry of entries) {
        let type, display;
        if(entry.startsWith("CLIENT_BIBDISPLAY_INTERACTION_")) {
          type = "interaction";
          display = entry.slice("CLIENT_BIBDISPLAY_INTERACTION_".length);
        } else if(entry.startsWith("CLIENT_BIBDISPLAY_SHOW_WORK_")) {
          type = "show_work";
          display = entry.slice("CLIENT_BIBDISPLAY_SHOW_WORK_".length);
        } else if(entry.startsWith("REDIRECT_BIBDISPLAY_")) {
          type = "redirect";
          display = entry.slice("REDIRECT_BIBDISPLAY_".length);
        } else {
          continue;
        }
        display = display.trim().toLowerCase();;
        if(!display || display === "test" || display === "stats" || display === "admin") continue;
        for(let [timestamp, count]of await server.stat_count_min_max_sum(entry)) {
          let date = timestamp.slice(0, 10);
          console.log(date, startDate);
          if(date < startDate) continue;
          displays[display] = (displays[display] ?? 0) + 1;
          stats.dates[date] ??= {};
          stats.dates[date][type] ??= {};
          stats.dates[date][type][display] = (stats.dates[date][type][display] ?? 0) + count;
          stats.dates[date][type].total = (stats.dates[date][type].total ?? 0) + count;
        }
      }
      stats.displays = Object.keys(displays);
      stats.displays.sort((a, b) => displays[a] - displays[b]);
      setStats(stats);
    })();
  }, []); 

  if(!stats) return <div>Loading...</div>;
  
  // This console.log will run on every render
  console.log(stats);
  let dates = Object.keys(stats.dates);
  dates.sort();
  dates.reverse();
  console.log(dates);

  return (
    <div>
      <style>
        {`
        .row {
          white-space: nowrap;
        }
        .row.heading {
          font-weight: bold;
          margin-top: 40px;
        }
        .cell {
         display: inline-block;
         width: 130px;
         height: 20px;
         text-align: right;
        }
        
        `}
      </style>

<h1>Statistik for skærme</h1>
      <div className="table-container">
          {dates.slice(0,30).map((date) => (
            <>
            <div key={date + "heading"} className="heading row">
              <div className="cell">{date}</div>
              {stats.displays.map((display) => (
                <div className="cell">{display}</div>
              ))}
            </div>
            <div key={date + "Interactions"} className="row">
              <div className="cell">Berøring</div>
              {stats.displays.map((display) => (
                <div className="cell">{stats.dates[date].interaction?.[display]}</div>
              ))}
            </div>
            <div key={date + "Show Works"} className="row">
              <div className="cell">Klik / popup</div>
              {stats.displays.map((display) => (
                <div className="cell">{stats.dates[date].show_work?.[display]}</div>
              ))}
            </div>
            <div key={date + "Redirects"} className="row">
              <div className="cell">QR-skanninger</div>
              {stats.displays.map((display) => (
                <div className="cell">{stats.dates[date].redirect?.[display]}</div>
              ))}
            </div>
            </>
          ))}
      </div>
    </div>
  );
} 