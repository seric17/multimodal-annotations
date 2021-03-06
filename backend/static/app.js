// things for audio recording
//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

var gumStream; 						//stream from getUserMedia()
var rec; 							//Recorder.js object
var input; 							//MediaStreamAudioSourceNode we'll be recording

// shim for AudioContext when it's not avb. 
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext //audio context to help us record

/*
  Simple constraints object, for more advanced audio features see
  https://addpipe.com/blog/audio-constraints-getusermedia/
*/
  
var constraints = { audio: true, video:false }

/*
    Disable the record button until we get a success or fail from getUserMedia() 
*/

// recordButton.disabled = true;
// stopButton.disabled = false;
// pauseButton.disabled = false

/*
    We're using the standard promise based getUserMedia() 
    https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
*/

navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
  console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

  /*
    create an audio context after getUserMedia is called
    sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
    the sampleRate defaults to the one set in your OS for your playback device

  */
  audioContext = new AudioContext();

  //update the format 
  // document.getElementById("formats").innerHTML="Format: 1 channel pcm @ "+audioContext.sampleRate/1000+"kHz"

  /*  assign to gumStream for later use  */
  gumStream = stream;
  
  /* use the stream */
  input = audioContext.createMediaStreamSource(stream);

  /* 
    Create the Recorder object and configure to record mono sound (1 channel)
    Recording 2 channels  will double the file size
  */
  rec = new Recorder(input,{numChannels:1})


}).catch(function(err) {
    //enable the record button if getUserMedia() fails
    // recordButton.disabled = false;
    // stopButton.disabled = true;
    // pauseButton.disabled = true
    console.log("getUserMedia() failed");
    console.log(err);
});


function startRecording() {
  console.log("in startRecording");
  //start the recording process
  rec.record()

  console.log("Recording started");
}

// function stopRecording() {
// 	console.log("stopButton clicked");

// 	//disable the stop button, enable the record too allow for new recordings
// 	stopButton.disabled = true;
// 	recordButton.disabled = false;
// 	pauseButton.disabled = true;

// 	//reset button just in case the recording is stopped while paused
// 	pauseButton.innerHTML="Pause";
	
// 	//tell the recorder to stop the recording
// 	rec.stop();

// 	//stop microphone access
// 	gumStream.getAudioTracks()[0].stop();

// 	//create the wav blob and pass it on to createDownloadLink
// 	rec.exportWAV(createDownloadLink);
// }


function stopRecording() {
	console.log("in stopRecording()");

	//disable the stop button, enable the record too allow for new recordings
	// stopButton.disabled = true;
	// recordButton.disabled = false;
	// pauseButton.disabled = true;

	//reset button just in case the recording is stopped while paused
	// pauseButton.innerHTML="Pause";
	
	//tell the recorder to stop the recording
	rec.stop();

	//stop microphone access
	gumStream.getAudioTracks()[0].stop();

  console.log("right before calling createDownloadLink")

	//create the wav blob and pass it on to createDownloadLink
	rec.exportWAV(createDownloadLink);
}


function createDownloadLink(blob) {
	
	var url = URL.createObjectURL(blob);
	var au = document.createElement('audio');
	var li = document.createElement('li');
  var link = document.createElement('a');
  // var textField = document.createElement('textBox');
  // text.setAttribute('id', 'div_' + intTextBox);
  // text.innerHTML = 'Textbox ' + intTextBox + 
  // ': <input type="text" id="tb_' + intTextBox + '" name="tb_' + intTextBox + '"/>';
  // text.type = "text";
  // textField.setAttribute('type', 'text');
  // textField.setAttribute("value", "Hello World!");

  // document.getElementById('userText').appendChild(textField);
  // document.body.appendChild(textField);

  console.log("In create download link")



	//name of .wav file to use during upload and download (without extendion)
	var filename = new Date().toISOString();

	//add controls to the <audio> element
	au.controls = true;
	au.src = url;

	//save to disk link
	// link.href = url;
	// link.download = filename+".wav"; //download forces the browser to donwload the file using the  filename
	// link.innerHTML = "Save to disk";

	//add the new audio element to li
	li.appendChild(au);
	
	//add the filename to the li
	li.appendChild(document.createTextNode(filename+".wav "))

	//add the save to disk link to li
	li.appendChild(link);
	
	//upload link
	var upload = document.createElement('a');
	upload.href="#";
	upload.innerHTML = "Upload";
	upload.addEventListener("click", function(event){
		  var xhr= new XMLHttpRequest();
		  xhr.onload=function(e) {
		      if(this.readyState === 4) {
		          console.log("Server returned: ",e.target.responseText);
		      }
		  };
      var fd=new FormData();
      // newBlob = new Blob([image.src, coordJSON, blob])
      fd.append("audioData", blob, filename + ".wav");
      const imageSrcBlob = new Blob([image.src + "\n" + t.value], {type : 'text/plain'});
      fd.append("imageSrc", imageSrcBlob, "imageSrc.txt");
      coordJSON = JSON.stringify(coordinates);
      coordBlob = new Blob([coordJSON], {type: "application/json"});
      fd.append("coordJSON", coordBlob, "coord.json");
      // fd.append("audio_data", newBlob, filename);
		  xhr.open("POST","/", true);
		  xhr.send(fd);
	})
	li.appendChild(document.createTextNode (" "))//add a space in between
	li.appendChild(upload)//add the upload link to li

	//add the li element to the ol
	recordingsList.appendChild(li);
}

// helper function

const RADIUS = 10;

function degToRad(degrees) {
  var result = Math.PI / 180 * degrees;
  return result;
}

const result = document.getElementById("result");

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
if (typeof SpeechRecognition === "undefined") {
  console.log("Speech recognition didn't work.")
} else {
  // good stuff to come here
  // console.log("in speech recognition")
}

const recognition = new SpeechRecognition();
const start = () => {
  recognition.start();
};

const stop = () => {
  recognition.stop();
};

const onResult = event => {
  result.innerHTML = "";
  for (const res of event.results) {
    const text = document.createTextNode(res[0].transcript);
    const t = document.createElement("textarea");
    t.appendChild(text)
    result.appendChild(t)
  }
};

recognition.continuous = true;
recognition.addEventListener("result", onResult);




// setup of the canvas

// var canvas = document.querySelector('canvas');
// var ctx = canvas.getContext('2d');
var image = document.getElementById("curImage");
console.log("path of image", image.src)
image.remove()
var canvas = document.createElement("canvas");
canvas.width  = image.width;
canvas.height = image.height;
document.body.appendChild(canvas);
var ctx = canvas.getContext("2d");

var x = 50;
var y = 50;

function canvasDraw() {
  // var img = new Image()
  // img.src = "/api/a"
  // console.log("Got image")
  // var image = document.getElementById("curImage");
  // var canvas = document.createElement("canvas");
  // document.body.appendChild(canvas);
  // canvas.width  = image.width;
  // canvas.height = image.height;
  // var ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0);
  ctx.fillStyle = "black";
  // ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#f00";
  ctx.beginPath();
  ctx.arc(x, y, RADIUS, 0, degToRad(360), true);
  ctx.fill();
}
canvasDraw();

// pointer lock object forking for cross browser

canvas.requestPointerLock = canvas.requestPointerLock ||
                            canvas.mozRequestPointerLock;

document.exitPointerLock = document.exitPointerLock ||
                           document.mozExitPointerLock;

canvas.onclick = function() {
  canvas.requestPointerLock();
};

// pointer lock event listeners

// Hook pointer lock state change events for different browsers
document.addEventListener('pointerlockchange', lockChangeAlert, false);
document.addEventListener('mozpointerlockchange', lockChangeAlert, false);

function lockChangeAlert() {
  if (document.pointerLockElement === canvas ||
      document.mozPointerLockElement === canvas) {
    console.log('The pointer lock status is now locked');
    startRecording()
    start()
    coordTimer = setInterval(updateCoordinates, 15);
    console.log("coordTimer" + coordTimer);
    document.addEventListener("mousemove", updatePosition, false);
  } else {
    console.log('The pointer lock status is now unlocked');
    stopRecording()
    stop()
    document.removeEventListener("mousemove", updatePosition, false);
    console.log("coord " + coordTimer)
    clearInterval(coordTimer);
  }
}

var tracker = document.getElementById('tracker');
// var history = document.getElementById('history');

var coordinates = [];

function updateCoordinates() {
  coordinates.push([(x / canvas.width).toFixed(4), (y / canvas.height).toFixed(4), Date.now()]);
  // console.log(coordinates[coordinates.length - 1])
  console.log(x / canvas.width, y / canvas.height, canvas.width)
}

var animation;
function updatePosition(e) {
  x += e.movementX;
  y += e.movementY;
  if (x > canvas.width + RADIUS) {
    x = -RADIUS;
  }
  if (y > canvas.height + RADIUS) {
    y = -RADIUS;
  }  
  if (x < -RADIUS) {
    x = canvas.width + RADIUS;
  }
  if (y < -RADIUS) {
    y = canvas.height + RADIUS;
  }
  tracker.textContent = "X position: " + x + ", Y position: " + y + " time: " + Date.now();
  // coordinates.push([x, y, Date.now()]);
  // console.log(coordinates[coordinates.length - 1])
  
  if (!animation) {
  animation = requestAnimationFrame(function() {
    animation = null;
    canvasDraw();
  });
  }
}
