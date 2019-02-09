import React from 'react';
import {loadMtcnnModel, loadFaceLandmarkModel, loadFaceDetectionModel, loadFaceRecognitionModel, toNetInput, mtcnn, extractFaces, computeFaceDescriptor} from 'face-api.js';

  async function calculateFeatureVector(image) {

    await loadFaceDetectionModel('/weights')
    await loadFaceRecognitionModel('/weights')
    await loadFaceLandmarkModel('/weights')
    await loadMtcnnModel('/weights')

    const allignedface = await locateAndAlignFacesWithMtcnn(image)
    if (allignedface != null) {
      var descriptor = await computeFaceDescriptor(allignedface)
      console.log(descriptor)
      return descriptor;
    }
    else {
      return null;
    }
  }

  async function locateAndAlignFacesWithMtcnn(inputImg) {

    const minConfidence = 0.7;

    const input = await toNetInput(inputImg)
    const results = await mtcnn(input, { minFaceSize: 100 })

    const unalignedFaceImages = await extractFaces(input.getInput(0), results.map(res => res.faceDetection))

    const alignedFaceBoxes = results
      .filter(res => res.faceDetection.score > minConfidence)
      .map(res => res.faceLandmarks.align())

    const alignedFaceImages = await extractFaces(input.getInput(0), alignedFaceBoxes)
    console.log(alignedFaceImages)
    return alignedFaceImages[0]
  }

  async function getFeatureVector(image) {
    var fv = await calculateFeatureVector(image);
    return fv
  }

  export {getFeatureVector}
