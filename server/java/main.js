
const introGif = document.getElementById('introduction');
const introContainer = document.getElementById('introContainer');

// Play the GIF once
introGif.addEventListener('load', function () {
    introGif.play();
});

// Hide the introduction after the GIF finishes playing
introGif.addEventListener('ended', function () {
    introContainer.style.display = 'none';
});

const firebaseConfig = {};
firebase.initializeApp(firebaseConfig);
 
const database = firebase.database();
const numberInput = document.getElementById("numberInput");
const sendButton = document.getElementById("sendButton");
const logDiv = document.getElementById("output");
const cyclesInput = document.getElementById("cyclesInput");
const sendCyclesButton = document.getElementById("sendCyclesButton");
const clear = document.getElementById("clear");
const sendToESPButton = document.getElementById("sendToESPButton");
const switchToggle = document.getElementById("switchtoggle");
let mode = "FB";
const ws = new WebSocket("ws://" + location.host + "/ws");
 
switchToggle.addEventListener("change", function () {
  if (this.checked) {
    mode = "Local";
  } else {
    mode = "FB";
  }
});
 
sendButton.addEventListener("click", () => {
  let number = numberInput.value.trim();
  if (number !== "") {
    if (mode == "FB") {
      sendDataToFB(number, "input");
      printToLog(number, "fb-out");
    } else {
      sendDataToESP(number);
      printToLog(number, "esp-direct-out");
    }
  }
});
 
clear.addEventListener("click", () => {
  logDiv.innerHTML = "";
});
 
sendCyclesButton.addEventListener("click", async () => {
  let number = numberInput.value.trim();
  let cycles = cyclesInput.value.trim();
 
  if (number !== "" && cycles !== "") {
    for (let i = 0; i < parseInt(cycles); i++) {
      number = (parseInt(number) + 1).toString();
      if (mode == "FB") {
        sendDataToFB(number, "input");
        printToLog(number, "fb-out-cycle", (i = i));
      } else {
        sendDataToESP(number);
        printToLog(number, "esp-direct-out-cycle", (i = i));
      }
    }
  }
});
 
//הפונקציה הזאת נקראת כשיש אירוע בוובסוקט
ws.onmessage = function (event) {
  const receivedValue = event.data;
  printToLog(receivedValue, "esp-direct-in");
};
//הפונקציה הזאת נקראת כשהיה עדכון בכתובת באאוטפוט במסד הנתונים
database.ref("output").on("value", (snapshot) => {
  const output = snapshot.val();
  printToLog(output, "fb-in");
});
 
//sendToESP הפונקציה הזאת שולחת את הערך הנקלט ישירות לבקר דרך הנתיב
// היא משתמשת בבקשת פוסט כדי לשלוח את הערך
function sendDataToESP(value) {
  fetch("/sendToESP", {
    method: "POST", // שיטת הבקשה
    body: new URLSearchParams({ value: value }), // הגוף של הבקשה
    headers: {
      "Content-Type": "application/x-www-form-urlencoded", // סוג התוכן של הבקשה
    },
  })
    .then((response) => response.text())
    .then((data) => {});
}
 
// הפונקציה הזאת שולחת את הערך הנקלט לכתובת הנקלטת במסד הנתונים
function sendDataToFB(value, path) {
  database.ref(path).set(parseInt(value)); // שמירת הערך בכתובת הנתונה
}
 
function printToLog(value, source, i = 0) {
  let element;
  switch (source) {
    case "esp-direct-in":
      element = document.createElement("p");
      element.textContent =
        "ESP(direct): " + value + getTime(" Received directly from ESP");
      logDiv.appendChild(element);
      break;
    case "esp-direct-out":
      element = document.createElement("p");
      element.textContent =
        "User (Value): " + value + getTime(" sent directly to ESP");
      logDiv.appendChild(element);
      break;
    case "fb-in":
      element = document.createElement("p");
      element.textContent =
        "ESP(Firebase):  " + value + getTime(" received from firebase");
      logDiv.appendChild(element);
      break;
    case "fb-out-cycle":
      element = document.createElement("p");
      element.textContent =
        "User (Cycle " + (i + 1) + "): " + value + getTime(" sent to Firebase");
      logDiv.appendChild(element);
      break;
    case "esp-direct-out-cycle":
      element = document.createElement("p");
      element.textContent =
        "User (Cycle " +
        (i + 1) +
        "): " +
        value +
        getTime(" sent directly to ESP");
      logDiv.appendChild(element);
      break;
    case "fb-out":
      element = document.createElement("p");
      element.textContent =
        "User (Value): " + value + getTime(" sent to firebase");
      logDiv.appendChild(element);
      break;
  }
}
 
function getTime(text) {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  return text + " at " + hours + ":" + minutes + ":" + seconds;
}








