import React from 'react';
import {loadMtcnnModel, loadFaceLandmarkModel, loadFaceDetectionModel, loadFaceRecognitionModel, toNetInput, mtcnn, extractFaces, computeFaceDescriptor, euclideanDistance, loadTinyYolov2Model, tinyYolov2} from 'face-api.js';

  async function calculateFeatureVector(image) {

    await loadTinyYolov2Model('/weights')
    await loadFaceDetectionModel('/weights')
    await loadFaceRecognitionModel('/weights')
    await loadFaceLandmarkModel('/weights')
    await loadMtcnnModel('/weights')

    //tinyYolov2 implemnatation
    //let scoreThreshold = 0.5
    //let sizeType = 'lg'
    //const detections = await tinyYolov2(inputImgEl, forwardParams)

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
    console.log("hello")
    return fv
  }

  async function getFVDistance(fv1, fv2) {
    return euclideanDistance(fv1, fv2);
  }

  export {getFeatureVector, getFVDistance}
