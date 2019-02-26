import React from 'react';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import { Redirect } from 'react-router';
import { getFeatureVector, getFVDistance } from '../facerecognition/FaceRecognition';
import swal from '@sweetalert/with-react';
import SocketContext from "../socketContext";

class CapturePlayer extends React.Component {

  state = {
    redirect : false }

  setRedirect = () => {
      this.setState({redirect: true})
    }

  renderRedirect = () => {
    if (this.state.redirect) {return <Redirect to="/captureResult" />}
  }


  async onTakePhoto (dataUri) {

      var photoSrc = dataUri;
      var photo = new Image;
      photo.src = photoSrc;
      console.log(photo);

      var fv = await getFeatureVector(photo);

      if (fv === null) {
          console.log("No face detected!")
          swal({
              title: "No face detected",
              text: "Make sure the target is exposed to enough light.",
              icon: "warning",
              button: "try again!",
          });
      }

      else {
          localStorage.setItem("PhotoOfPlayer", dataUri);
          localStorage.setItem("fv", fv);
          this.context.emit('getFVfromDB');
      }
  }

  componentDidMount() {
    this.context.on('sentFVfromDB', (results) => {
        let matchingPlayerId = this.getMatchingPlayerFromFV(results);
        if (matchingPlayerId != null) {
          localStorage.setItem("matchingPlayerId", matchingPlayerId);
          this.setRedirect();
        }
        //else if (matchingPlayerId = playerId){ "You can't capture yourself!" }
        else {
          swal({
              title: "Unkown Person",
              text: "The Person in the photo is NOT a player",
              icon: "warning",
              button: "try again!",
          });

        }
    });
  }

  async getMatchingPlayerFromFV(results) {
    console.log(results)
    console.log(JSON.parse(results[0].featureVector))
    let fv1 = localStorage.getItem("fv");
    let minDist = 1;
    let index = null;
    const threshold = 0.52;
    let i = 0
    for (i ; i < results.length; i++) {
      let fv2 = Object.values(results[i].featureVector);
      let dist = getFVDistance(fv1, fv2)
      if (minDist > dist && dist <= threshold) {
        minDist = dist;
        index = i;
      }
    }
    if (index != null) {
      return (results[i]._id);
    }
    else return null;
  };


  async showCapturedPlayer(id) {
    this.context.emit('getCapturedPlayerStats', id);
  };


  render () {
    return (
      <div className="background">
        {this.renderRedirect()}
        <div className="polaroid">
            <Camera
                onTakePhoto = { (dataUri) => { this.onTakePhoto(dataUri); } }
                isImageMirror = {true}
            />
        </div>
      </div>
    );
  }
}

CapturePlayer.contextType = SocketContext;

export default CapturePlayer;
