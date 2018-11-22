//distance threshold: 0.5 -> 0% false positives / 2.5% false negatives
//                    0.6 -> 0% false positives / 2.5% false negatives
//                    0.4 -> 0% false positives / 15.5% false negatives

let testSrc = "GoW/FaceTests/"
let fullSrc = ""
let testPhotos = 10
let distThreshold = 0.6


async function runTests() {
  //await runTestFalsePositive(100,"Set0");
  //await runTestFalsePositive(400,"Set1");
  //await runTestFalsePositive(400,"Set2");
  await runTestFalseNegative(20,"Set3");
  //await runTestFalseNegative(20,"Set4");
}

async function runTestFalsePositive(testPhotos, testSet) {
  document.getElementById("inputImg1").src = testSrc + testSet + "/image (0)" + ".jpg"
  for (i = 1; i <= testPhotos ; i++) {
    fullSrc = testSrc + testSet + "/image (" + i + ")" + ".jpg"
    document.getElementById("inputImg2").src = fullSrc
    var distance = await updateResults()
  }
  console.log(distances)

  var falsePos = 0
  for (j = 0; j < testPhotos; j++)  {
    if (distances[j] <= distThreshold) {
      falsePos += 1
    }
  }
  console.log(falsePos + "/" + testPhotos + " false positives detected!")
  console.log(falsePos/testPhotos * 100 + " % false positives detected!")
}

async function runTestFalseNegative(testPhotos, testSet) {
  document.getElementById("inputImg1").src = testSrc + testSet + "/image (0)" + ".jpg"
  for (i = 1; i <= testPhotos ; i++) {
    fullSrc = testSrc + testSet + "/image (" + i + ")" + ".jpg"
    document.getElementById("inputImg2").src = fullSrc
    var distance = await updateResults()
  }
  console.log(distances)

  var falseNeg = 0
  for (j = 0; j < testPhotos; j++)  {
    if (distances[j] > distThreshold) {
      falseNeg += 1
    }
  }
  console.log(falseNeg + "/" + testPhotos + " false negatives detected!")
}


function wait(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}
