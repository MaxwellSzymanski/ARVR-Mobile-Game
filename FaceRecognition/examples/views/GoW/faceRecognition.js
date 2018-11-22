let minConfidence = 0.7
let result1
let result2
let descriptor1
let descriptor2
let distance
var distances = []

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

async function getDescriptorImg2() {
  const inputImgEl = $('#inputImg2').get(0)
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

async function locateAndAlignFacesWithMtcnn(inputImgEl) {
  const input = await faceapi.toNetInput(inputImgEl)

  const results = await faceapi.mtcnn(input, { minFaceSize: 100 })

  const unalignedFaceImages = await faceapi.extractFaces(input.getInput(0), results.map(res => res.faceDetection))

  const alignedFaceBoxes = results
    .filter(res => res.faceDetection.score > minConfidence)
    .map(res => res.faceLandmarks.align())

  const alignedFaceImages = await faceapi.extractFaces(input.getInput(0), alignedFaceBoxes)
  return alignedFaceImages[0]
}

async function run() {
  await faceapi.loadFaceDetectionModel('/')
  await  faceapi.loadFaceRecognitionModel('/')
  await faceapi.loadFaceLandmarkModel('/')
  await faceapi.loadMtcnnModel('/')
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}
