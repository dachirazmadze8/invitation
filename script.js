// ---- Edit these two lines to change the event ----
var EVENT_START = new Date("2026-10-30T10:00:00"); // local time of the viewer
var LOCATION = "129 D.Agmashenebeli Alley";
// --------------------------------------------------

document.getElementById("place").textContent = LOCATION;
document.getElementById("dateText").textContent =
  EVENT_START.toLocaleDateString(undefined,{weekday:"long",year:"numeric",month:"long",day:"numeric"});
document.getElementById("timeText").textContent =
  EVENT_START.toLocaleTimeString(undefined,{hour:"numeric",minute:"2-digit"});

function pad(n){return String(n).padStart(2,"0");}
function tick(){
  var diff = EVENT_START - new Date();
  if (diff <= 0){
    document.getElementById("timer").style.display = "none";
    document.getElementById("started").style.display = "block";
    return;
  }
  var t = Math.floor(diff/1000);
  document.getElementById("d").textContent = Math.floor(t/86400);
  document.getElementById("h").textContent = pad(Math.floor(t%86400/3600));
  document.getElementById("m").textContent = pad(Math.floor(t%3600/60));
  document.getElementById("s").textContent = pad(t%60);
}
tick(); setInterval(tick, 1000);
