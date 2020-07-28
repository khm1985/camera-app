var Kairos = require('kairos-api');
var client = new Kairos('2ca5d8f9', 'd43201f27ced5053559410fba987f2a4');

// Set constraints for the video stream
var constraints = { video: { facingMode: "user" }, audio: false };
var track = null;

// Define constants
const cameraView = document.querySelector("#camera--view"),
  cameraOutput = document.querySelector("#camera--output"),
  cameraSensor = document.querySelector("#camera--sensor"),
  //cameraTrigger = document.querySelector("#camera--trigger");
  ipInfoOutput = document.querySelector("#ipinfo--output"),
  kairosOutput = document.querySelector("#kairos--output");

// Access the device camera and stream to cameraView
function cameraStart() {
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (stream) {
      track = stream.getTracks()[0];
      cameraView.srcObject = stream;
    })
    .catch(function (error) {
      console.error("Oops. Something is broken.", error);
    });
}

// Take a picture when cameraTrigger is tapped
//cameraTrigger.onclick = function() {
function cameraTrigger() {
  cameraSensor.width = cameraView.videoWidth;
  cameraSensor.height = cameraView.videoHeight;
  cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
  cameraOutput.src = cameraSensor.toDataURL("image/jpeg");
  cameraOutput.classList.add("taken");

  var cameraOutputSrcBase64 = cameraOutput.src.toString().replace('data:image/jpeg;base64,', '');

  var params = {
    image: cameraOutputSrcBase64,
    subject_id: 'subtest1',
    gallery_name: 'gallerytest1'
  };

  client.enroll(params)   // return Promise
    //  result: {
    //    status: <http status code>,
    //    body: <data>
    //  }
    .then(function (result) {
      kairosOutput.innerHTML = JSON.stringify(result.body, undefined, 4);
    })
    // err -> array: jsonschema validate errors
    //        or throw Error
    .catch(function (err) { });
  // track.stop();
};

var simulateClick = function (elem) {
  // Create our event (with options)
  var evt = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window
  });
  // If cancelled, don't dispatch our event
  var canceled = !elem.dispatchEvent(evt);
};

// Start the video stream when the window loads
window.addEventListener("load", cameraStart, false);

window.setTimeout(() => cameraTrigger(), 3000);

window.setInterval(() => {
  //simulateClick(cameraTrigger);
  cameraTrigger();
}, 60000);

const bearer_token = '17b98a188950d1';
const url = "https://ipinfo.io?token=" + bearer_token;
var bearer = 'Bearer ' + bearer_token;
fetch(url, {
  method: 'GET',
  //withCredentials: true,
  //credentials: 'include',
  headers: {
    //'Authorization': bearer,
    'Content-Type': 'application/json'
  }
}).then(responseJson => {
  responseJson.json().then(data => {
    console.log(data);
    ipInfoOutput.innerHTML = JSON.stringify(data, undefined, 4);
  });

}).catch();

// Install ServiceWorker
// if ('serviceWorker' in navigator) {
//   console.log('CLIENT: service worker registration in progress.');
//   navigator.serviceWorker.register( '/camera-app/sw.js?v3' , { scope : ' ' } ).then(function() {
//     console.log('CLIENT: service worker registration complete.');
//   }, function() {
//     console.log('CLIENT: service worker registration failure.');
//   });
// } else {
//   console.log('CLIENT: service worker is not supported.');
// }

