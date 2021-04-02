var recorder;
var chunks = [];
window.addEventListener('DOMContentLoaded', async () => {
  const list = document.getElementById('recordings');
  if ('MediaRecorder' in window) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
      });
      const mimeType = 'audio/webm';
      // chunks = [];
      recorder = new MediaRecorder(stream, { type: mimeType });
      recorder.addEventListener('dataavailable', event => {
        if (typeof event.data === 'undefined') return;
          if (event.data.size === 0) return;
          chunks.push(event.data);
        });
      recorder.addEventListener('stop', () => {
        const recording = new Blob(chunks, {
          type: mimeType
        });
        chunks = [];
        console.log("right before calling createDownloadLink");
        createDownloadLink(recording);
      });
    } catch {
      renderError(
        'You denied access to the microphone. Refresh and accept.'
      );
    }
  } else {
      renderError(
        'Mediarecorder not found'
      );
    }

});


function renderError(message) {
  const main = document.querySelector('main');
  main.innerHTML = `<div class="error"><p>${message}</p></div>`;
}


function startRecording() {
  console.log("in startRecording");
  //start the recording process
  recorder.start();

  console.log("Recording started");
  }

function stopRecording() {
	console.log("in stopRecording()");
	recorder.stop();
}

function createDownloadLink(blob) {
	
	var url = URL.createObjectURL(blob);
  console.log("blob size", blob.size)
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
	// au.controls = true;
	// au.src = url;

  au.setAttribute('src', url);
  au.setAttribute('controls', 'controls');

	//save to disk link
	// link.href = url;
	// link.download = filename+".wav"; //download forces the browser to donwload the file using the  filename
	// link.innerHTML = "Save to disk";

	//add the new audio element to li
	li.appendChild(au);
	
	//add the filename to the li
	li.appendChild(document.createTextNode(filename+".webm"))

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
		          console.log("Server returned: ", e.target.responseText);
		      }
		  };
      var fd=new FormData();
      // newBlob = new Blob([image.src, coordJSON, blob])
      fd.append("audioData", blob, filename + ".webm");
      // t = document.getElement("textarea");
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
    t = document.createElement("textarea");
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