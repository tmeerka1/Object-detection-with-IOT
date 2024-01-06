const firebaseConfig = {
  apiKey: "AIzaSyArHHCwjJABdQH7dpP-Vnq_FZn6oly-h8k",
  authDomain: "test-14f29.firebaseapp.com",
  databaseURL: "https://test-14f29-default-rtdb.firebaseio.com",
  projectId: "test-14f29",
  storageBucket: "test-14f29.appspot.com",
  messagingSenderId: "869193651738",
  appId: "1:869193651738:web:0b95bc35418cbb22d423a3",
  measurementId: "G-12QKGVHQKB"
};
firebase.initializeApp(firebaseConfig);//Initate the connection to firebase using the config
////////////////////Assign all the HTML objects/////////////////////
////////////////////////////////////////////////////////////////////
const database = firebase.database();
const switchToggle = document.getElementById("switchtoggle");
///////////////////////////////////////////////////////////////////
let mode = "FB";
switchToggle.addEventListener("change", function () {
  if (this.checked) {
    mode = "Local";
  } else {
    mode = "FB";
  }
});


//THIS FUNCTION GETS VALUE AND PATH AND BASED ON THE MODE SENDS IT TO THE RIGHT PLACE//
//////////////////////////////////////////////////////////////////////////////////////
function sendValue(value,path = "")
{
  if (value !== "") {
    if (mode == "FB") {
      sendDataToFB(value, path);
      printToLog(value, "fb-out");
    } else {
      sendDataToESP(value);
      printToLog(value, "esp-direct-out");
    }
  }
}
//////////////////////////////////////////////////////////////////////////////////////






/////////THIS FUNCTION SENDS VALUES TO THE ESP THROUGH THE /sendToESP SOCKET/////////
////////////////////////////////////////////////////////////////////////////////////
function sendDataToESP(value) {
  fetch("/sendToESP", {
    method: "POST", 
    body: new URLSearchParams({ value: value }), 
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
}
////////////////////////////////////////////////////////////////////////////////////

//THIS FUNCTION SENDS VALUE TO PATH IN THE FIREBASE//
////////////////////////////////////////////////////
function sendDataToFB(value, path) {
  database.ref(path).set(parseInt(value));
}
////////////////////////////////////////////////////


//this is to print to the logdiv, purely for debugging purposes
//if you for whatever reason remove the logdiv delete this whole function
function printToLog(value, source, i = 0) {
  let element;
  switch (source) {
      case "esp-direct-in":
          element = document.createElement("p");
          element.textContent =
              "ESP(direct): " + value + getTime(" Received directly from ESP RX");
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
        case "fb-RX":
            element = document.createElement("p");
            element.textContent =
                "ESP(Firebase):  " + value + getTime(" received from firebase RX");
            logDiv.appendChild(element);
            break;
      case "fb-out":
          element = document.createElement("p");
          element.textContent =
              "User (Value): " + value + getTime(" sent to firebase");
          logDiv.appendChild(element);
          break;
  }

  //Limit it to only 8 entries
  while(logDiv.childElementCount > 8) {
      logDiv.removeChild(logDiv.firstChild);
  }
}

//get current time
function getTime(text) {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  return text + " at " + hours + ":" + minutes + ":" + seconds;
}







//שימו לב שנקראות כאן פונקציות ומשתנים שקיימים בקובץ הסקריפט
const textOutput = document.getElementById("textOutput");//קישור משתנה לאובייקט HTML
const textOutput1 = document.getElementById("textOutput1");//קישור משתנה לאובייקט HTML
const forward = document.getElementById("send5Button");
const right= document.getElementById("send1Button");
const numberInput = document.getElementById("numberInput");
const sendButton = document.getElementById("sendButton");
const logDiv = document.getElementById("output");//OUTPUT LOG
const clear = document.getElementById("clear");
const sendToESPButton = document.getElementById("sendToESPButton");
const backward= document.getElementById("send3button");
const left = document.getElementById("send4button");
const stopp = document.getElementById("send0button");
const piazo = document.getElementById("piazo")

//פונקציות שנקראות כשהכפתורים נלחצים
forward.addEventListener("click", () => {
  let number = 5;
  sendValue(number,"/user/input");
});


right.addEventListener("click", () => {
  let number = 1;
  sendValue(number,"/user/input");
});

backward.addEventListener("click", () => {
  let number = 3;
  sendValue(number,"/user/input");
});

left.addEventListener("click", () => {
  let number = 4;
  sendValue(number,"/user/input");
}); 

stopp.addEventListener("click", () => {
  let number = 0;
  sendValue(number,"/user/input");
});

piazo.addEventListener("click", () => {
  let number = 8;
  sendValue(number,"/user/input");
});



//SEND INPUT BOX VALUE
sendButton.addEventListener("click", () => {
  let number = numberInput.value.trim();
  sendValue(number,"user/input");
});


//CLEAR LOG BUTTON
clear.addEventListener("click", () => {
  logDiv.innerHTML = "";
});

textOutput.textContent = 0;//איפוס ערך 
textOutput1.textContent = 0;//איפוס ערך 

//Initiate the SSE links
var rxSource = new EventSource('/rx');// Create event source at /RX
var runtimeSource = new EventSource('/runtime');// Create event source at /runtime


  //THIS RUNS WHEN THERE WAS AN UPDATE AT /esp/uptime IN FIREBASE//
  ////////////////////////////////////////////////////////////////
database.ref("/esp/uptime").on("value", (snapshot) => {
  if (mode == "FB"){
    const firebaseRuntimeValue = snapshot.val();
    textOutput.textContent = firebaseRuntimeValue;
  }
});
////////////////////////////////////////////////////////////////
/////////////////get ip frome f.b///////////////////////////
database.ref("/ip").on("value", (snapshot) => {
  if (mode == "FB"){
    document.getElementById("espVideo").src = "http://"+snapshot.val()+":81/stream";
    
  }
});






//THIS RUNS WHEN THERE WAS AN UPDATE IN THE RUNTIME WEBSOCKET//
//////////////////////////////////////////////////////////////
runtimeSource.onmessage = function(event) {
  if (mode == "Local")
  {
      const localRuntimeValue = event.data;//store the variable
      textOutput.textContent = localRuntimeValue;
  }
};
//////////////////////////////////////////////////////////////

//THIS RUNS WHEN THERE WAS AN UPDATE AT /esp/rx IN FIREBASE//
////////////////////////////////////////////////////////////
database.ref("/esp/rx").on("value", (snapshot) => {
    if (mode == "FB"){// if we're in firebase mode
    const firebaseRX = snapshot.val();//store the variable
    textOutput1.textContent = firebaseRX;//set it in the text box
    printToLog(firebaseRX, "fb-RX");//print it to the log
    }
  });
////////////////////////////////////////////////////////////

//THIS RUNS WHEN THERE WAS A SERVERSIDE EVENT AT /RX//
///////////////////////////////////////////////////////////
  rxSource.onmessage = function(event) {
    if (mode == "Local")
    {
      const localRX = event.data;
      textOutput1.textContent = localRX;
      printToLog(localRX,"esp-direct-in");
    }
  };



/////////////////////////////////////////////////////////////

let classifier;
let targetClass;

document.getElementById('startDetection').addEventListener('click', () => {
  // Set the target class based on the user's choice
  targetClass = document.getElementById('targetObject').value;
  console.log(`Selected Target Class: ${targetClass}`);

  // Initialize the image classifier
  classifier = ml5.imageClassifier('https://teachablemachine.withgoogle.com/models/Ps6gBEhQv/', modelLoaded);
});

// When the model is loaded
function modelLoaded() {
  console.log('Model Loaded!');
  
  setInterval(() => {
    // Assuming you have an image with the id 'espVideo'
    classifier.classify(document.getElementById('espVideo'), (err, results) => {
      // Extract detected class names and their probabilities
      const detectedClasses = results.map(result => result.label);
      const detectedProbabilities = results.map(result => result.confidence);

      results.forEach((result, index) => {
        console.log(`Class: ${result.label}, Confidence: ${result.confidence}`);
      });

      // Check if the selected target class is detected with a probability higher than 0.9
      const targetClassIndex = detectedClasses.indexOf(targetClass);
      const conditionMet = targetClassIndex !== -1 && detectedProbabilities[targetClassIndex] > 0.9;

      console.log(conditionMet);

      if (conditionMet) {
        let number = 8;
        sendValue(number,"/user/input");
        console.log("true");
        // Send the value of 1 to Firebase
        console.log("The object is detected with high probability!!");
      }
      else{
        let number = 0;
        sendValue(number,"/user/input");
      }
    });
  }, 1000);
}


