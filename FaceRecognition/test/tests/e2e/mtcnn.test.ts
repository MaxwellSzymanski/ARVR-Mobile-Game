import * as faceapi from '../../../src';
import { describeWithNets, expectAllTensorsReleased, sortByDistanceToOrigin } from '../../utils';
import { expectMtcnnResults } from './expectedResults';
import { IPoint } from '../../../src';


describe('mtcnn', () => {

  let imgEl: HTMLImageElement
  let expectedMtcnnLandmarks: IPoint[][]

  beforeAll(async () => {
    const img = await (await fetch('base/test/images/faces.jpg')).blob()
    imgEl = await faceapi.bufferToImage(img)
    expectedMtcnnLandmarks = await (await fetch('base/test/data/mtcnnFaceLandmarkPositions.json')).json()
  })

  describeWithNets('uncompressed weights', { withMtcnn: { quantized: false } }, ({ mtcnn }) => {


    it('minFaceSize = 20, finds all faces', async () => {
      const forwardParams = {
        minFaceSize: 20
      }

      const results = await mtcnn.forward(imgEl, forwardParams)
      expect(results.length).toEqual(6)

      const deltas = {
        maxBoxDelta: 2,
        maxLandmarksDelta: 5
      }
      expectMtcnnResults(results, expectedMtcnnLandmarks, deltas)
    })

    it('minFaceSize = 80, finds all faces', async () => {
      const forwardParams = {
        minFaceSize: 80
      }

      const results = await mtcnn.forward(imgEl, forwardParams)

      expect(results.length).toEqual(6)
      const deltas = {
        maxBoxDelta: 15,
        maxLandmarksDelta: 13
      }
      expectMtcnnResults(results, expectedMtcnnLandmarks, deltas)
    })

    it('all optional params passed, finds all faces', async () => {
      const forwardParams = {
        maxNumScales: 10,
        scaleFactor: 0.8,
        scoreThresholds: [0.8, 0.8, 0.9],
        minFaceSize: 20
      }

      const results = await mtcnn.forward(imgEl, forwardParams)
      expect(results.length).toEqual(6)

      const deltas = {
        maxBoxDelta: 8,
        maxLandmarksDelta: 7
      }
      expectMtcnnResults(results, expectedMtcnnLandmarks, deltas)
    })

    it('scale steps passed, finds all faces', async () => {
      const forwardParams = {
        scaleSteps: [0.6, 0.4, 0.2, 0.15, 0.1, 0.08, 0.02]
      }

      const results = await mtcnn.forward(imgEl, forwardParams)
      expect(results.length).toEqual(6)

      const deltas = {
        maxBoxDelta: 8,
        maxLandmarksDelta: 10
      }
      expectMtcnnResults(results, expectedMtcnnLandmarks, deltas)
    })

  })

  describe('no memory leaks', () => {

    describe('NeuralNetwork, uncompressed model', () => {

      it('disposes all param tensors', async () => {
        await expectAllTensorsReleased(async () => {
          const res = await fetch('base/weights_uncompressed/mtcnn_model.weights')
          const weights = new Float32Array(await res.arrayBuffer())
          const net = faceapi.createMtcnn(weights)
          net.dispose()
        })
      })

    })

    describe('NeuralNetwork, quantized model', () => {

      it('disposes all param tensors', async () => {
        await expectAllTensorsReleased(async () => {
          const net = new faceapi.Mtcnn()
          await net.load('base/weights')
          net.dispose()
        })
      })

    })

  })

})