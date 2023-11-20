
// function updateDistance() {
//   // Make a GET request to the Firebase Realtime Database
//   fetch('https://test-14f29-default-rtdb.firebaseio.com/distance.json')
//     .then(response => {
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       return response.json();
//     })
//     .then(data => {
//       // Display the distance value
//       document.getElementById('distance-value').textContent = 'Distance: ' + data;
//     })
//     .catch(error => {
//       console.error('Error fetching data:', error);
//       document.getElementById('distance-value').textContent = 'Error fetching distance';
//     });
// }

// // Update the distance every 5 seconds (adjust the interval as needed)
// setInterval(updateDistance, 10);

// // Initial call to set the initial value
// updateDistance();


// userId = 100
// function saveData(){
//   emailInput = document.getElementById("email").value
//   ageInput = document.getElementById("age").value
//   idInput = document.getElementById("id").value

//   data = {
//       id:idInput,
//       email:emailInput,
//       age:ageInput
//   }

// firebase.database().ref('users/'+data.id ).set(data);

// }









function checkLogin() {
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value; // ID named 'password' exists twice in the code. Are they on the same page? If yes it is an issue worth changing one. - Royi

  if (username === "Shadow" && password === "tracker") {
    window.location.href = "Neuralnetwork.html"; // Redirect to another page on successful login
  } else {
    document.getElementById("login-error").textContent = "Try again. Invalid credentials.";
  }
}


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


//Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
console.log(app)

var starCountRef = firebase.database().ref('/distance');
starCountRef.on('value', newData);

function newData(data){
  console.log(data.val())
  document.getElementById("distance").innerHTML = '<span class="distance-container">'+data.val()+'</span>'
}



// פונים לפונקציה דרך האובייקט
//json is the object in java


// main.js

// Your Firebase configuration and initialization code here

function sendCommand(direction) {
  let value;

  // Determine the value based on the direction
  switch (direction) {
    case 'forward':
      value = 5;
      break;
    case 'backward':
      value = 10;
      break;
    case 'left':
      value = 1;
      break;
    case 'right':
      value = 4;
      break;
    case 'center':
      value = 15;
      break;
    default:
      // Handle any other direction or error case
      console.error('Invalid direction:', direction);
      return;
  }
  console.log('Setting value to:', value);


  firebase.database().ref('motors/').set({
    motors: value
  });

  console.log(`Command sent: ${direction}, Value: ${value}`);

  // Clear Firebase data object
  fbdo.clear();
}

