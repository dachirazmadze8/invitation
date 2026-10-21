var EVENT_START = new Date("2026-10-30T10:00:00");
var LOCATION = "თეგეტას სათავო ოფისი";
var RSVP_URL = "https://script.google.com/macros/s/AKfycbz7zt0GY6szetGx8fUREdVZji5dDxm2lJ5Ohh3bqA66VPvZqBBh2mBBU4T9xlIcYZzK/exec";


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
  if (RSVP_URL.indexOf("YOUR_ID") !== -1){
    msg.className = "msg error";
    msg.textContent = "RSVP destination isn't set up yet.";
    return;
  }
  setBusy(true);
  msg.textContent = "Sending...";

  // text/plain + no-cors keeps this a simple request, which Google Apps Script accepts from any site
  fetch(RSVP_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {"Content-Type": "text/plain;charset=utf-8"},
    body: JSON.stringify({firstName: first, lastName: last, coming: coming})
  })
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
