// ---- Edit these three lines to change the event ----
var EVENT_START = new Date("2026-10-31T00:00:00"); // local time of the viewer
var LOCATION = "129 D.agmashenebeli alley";
var RSVP_EMAIL = "razmadzedachi@gmail.com"; // replies are sent to this address
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

// ---- RSVP ----
var firstInput = document.getElementById("firstName");
var lastInput = document.getElementById("lastName");
var yesBtn = document.getElementById("yes");
var noBtn = document.getElementById("no");
var msg = document.getElementById("msg");

function setBusy(busy){
  yesBtn.disabled = busy; noBtn.disabled = busy;
  firstInput.disabled = busy; lastInput.disabled = busy;
}

function rsvp(coming){
  var first = firstInput.value.trim();
  var last = lastInput.value.trim();
  msg.className = "msg";
  if (!first || !last){
    msg.className = "msg error";
    msg.textContent = "Please enter your first and last name.";
    (first ? lastInput : firstInput).focus();
    return;
  }
  if (RSVP_EMAIL.indexOf("example.com") !== -1){
    msg.className = "msg error";
    msg.textContent = "RSVP email isn't set up yet.";
    return;
  }
  setBusy(true);
  msg.textContent = "Sending...";

  fetch("https://formsubmit.co/ajax/" + encodeURIComponent(RSVP_EMAIL), {
    method: "POST",
    headers: {"Content-Type": "application/json", "Accept": "application/json"},
    body: JSON.stringify({
      _subject: "RSVP: " + first + " " + last + " - " + (coming ? "YES" : "NO"),
      _template: "table",
      _captcha: "false",
      "First name": first,
      "Last name": last,
      "Coming": coming ? "Yes" : "No"
    })
  })
  .then(function(r){ if (!r.ok) throw new Error("bad response"); })
  .then(function(){
    msg.className = "msg done";
    msg.textContent = coming
      ? "Thanks, " + first + "! We'll see you there."
      : "Thanks for letting us know, " + first + ". We'll miss you!";
  })
  .catch(function(){
    setBusy(false);
    msg.className = "msg error";
    msg.textContent = "Something went wrong sending your RSVP. Please try again.";
  });
}
yesBtn.addEventListener("click", function(){ rsvp(true); });
noBtn.addEventListener("click", function(){ rsvp(false); });
