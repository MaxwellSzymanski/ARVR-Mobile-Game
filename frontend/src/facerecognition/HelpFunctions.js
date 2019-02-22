import React from 'react';
import {loadMtcnnModel, loadFaceLandmarkModel, loadFaceDetectionModel, loadFaceRecognitionModel, toNetInput, mtcnn, extractFaces, euclideanDistance} from '/face-api';
import openSocket from 'socket.io-client';
const  socket = openSocket('http://localhost:8000');

class HelpFunctions extends React.Component {
let minConfidence = 0.6

function setConfidence() {
minConfidence = document.getElementById("confidence").value
console.log(minConfidence)
}

var loadFile1 = function(event) {
    var tgt = event.target || window.event.srcElement,
        files = tgt.files;

    // FileReader support
    if (FileReader && files && files.length) {
        var fr = new FileReader();
        fr.onload = function () {
            document.getElementById("inputImg1").src = fr.result;
        }
        fr.readAsDataURL(files[0]);
    }
}

var loadFile2 = function(event) {
    var tgt = event.target || window.event.srcElement,
        files = tgt.files;

    // FileReader support
    if (FileReader && files && files.length) {
        var fr = new FileReader();
        fr.onload = function () {
            document.getElementById("inputImg2").src = fr.result;
        }
        fr.readAsDataURL(files[0]);
    }
}

async function updateResults() {

  descriptor1 = await getDescriptorImg1()
  descriptor2 = await getDescriptorImg2()

  if (descriptor1 != null && descriptor2 != null) {
    distance = faceapi.round(
      faceapi.euclideanDistance(descriptor1, descriptor2)
    )
    document.getElementById("distanceLabel").innerHTML = "Distance:  " + distance;

    //Print Feature Vectors
    //console.log(descriptor1, descriptor2)
    distances.push(distance)
    return distance
  }

  else {
    document.getElementById("distanceLabel").innerHTML = "No comparisson";
    distances.push(1)
    return 1
  }
}

async function getDescriptorImg1() {
  const inputImgEl = $('#inputImg1').get(0)
  const { width, height } = inputImgEl

  sleep(100)
  const allignedface = await locateAndAlignFacesWithMtcnn(inputImgEl)
  if (allignedface != null) {
    var descriptor = await faceapi.computeFaceDescriptor(allignedface)
    return descriptor;
  }
  else {
    console.log("No face found!")
    return null
  }
}

async function calculateFeatureVector(image) {

  await loadFaceDetectionModel('/weights')
  await loadFaceRecognitionModel('/weights')
  await loadFaceLandmarkModel('/weights')
  await loadMtcnnModel('/weights')

  const allignedface = await locateAndAlignFacesWithMtcnn(inputImgEl)
  if (allignedface != null) {
    var descriptor = await computeFaceDescriptor(allignedface)
    return descriptor;
  }
  else {
    console.log("No face found!")
    return null;
  }
}

async function locateAndAlignFacesWithMtcnn(inputImg) {

  const input = await toNetInput(inputImg)
  const results = await mtcnn(input, { minFaceSize: 100 })

  const unalignedFaceImages = await extractFaces(input.getInput(0), results.map(res => res.faceDetection))

  const alignedFaceBoxes = results
    .filter(res => res.faceDetection.score > minConfidence)
    .map(res => res.faceLandmarks.align())

  const alignedFaceImages = await faceapi.extractFaces(input.getInput(0), alignedFaceBoxes)
  return alignedFaceImages[0]
}


function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}


//Connect with server
const port = 8000;
io.listen(port);
console.log('listening on port ', port);


async function getFVDistance(fv1, fv2) {
  return euclideanDistance(fv1, fv2);
}

async function {

}
}


export default HelpFunctions;
