import React from 'react';
import {allFacesTinyYolov2, createCanvasFromMedia, detectLandmarks , drawLandmarks, loadMtcnnModel, loadFaceLandmarkModel, loadFaceDetectionModel, loadFaceRecognitionModel, toNetInput, mtcnn, extractFaces, computeFaceDescriptor, euclideanDistance, loadTinyYolov2Model, tinyYolov2} from 'face-api.js';

  async function calculateFeatureVector(image) {

    await loadTinyYolov2Model('/weights')
    await loadFaceDetectionModel('/weights')
    await loadFaceRecognitionModel('/weights')
    await loadFaceLandmarkModel('/weights')
    //await loadMtcnnModel('/weights')

  const forwardParams = { inputSize: 608, scoreThreshold: 0.5 }
  const facedescriptor = await allFacesTinyYolov2(image, forwardParams)
  if (facedescriptor.length === 0) {
    return null
  }
  let biggestDetection = {detection: null, area: 0}
  for (let i = 0; i < facedescriptor.length; i++) {
    let thisDetection = facedescriptor[i]
    let thisArea = thisDetection.detection.box.width * thisDetection.detection.box.height
    if (biggestDetection.area < thisArea) {
      biggestDetection.detection = thisDetection
      biggestDetection.area = thisArea
    }
  }
  return biggestDetection.detection.descriptor
}

  async function showDetectedFace(inputImg) {
    let drawLines = true
    let landmarks = await detectLandmarks(inputImg)
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

  async function getFVDistance(fv1, fv2) {
    return euclideanDistance(fv1, fv2);
  }

  export {getFeatureVector, getFVDistance}
