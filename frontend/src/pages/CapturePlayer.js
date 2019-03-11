import React from 'react';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import { Link, Redirect } from 'react-router-dom';
import { getFeatureVector, getFVDistance } from '../facerecognition/FaceRecognition';
import swal from '@sweetalert/with-react';
import SocketContext from "../socketContext";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

class CapturePlayer extends React.Component {

  state = {
    redirect : false,
    calculating: false
  }

  setRedirect = () => {
      this.setState({redirect: true})
    }

  renderRedirect = () => {
    if (this.state.redirect) {return <Redirect to="/battlePage" />}
  }


  async onTakePhoto (dataUri) {
      this.setState({calculating:true});
      var photoSrc = dataUri;
      var photo = new Image;
      photo.src = photoSrc;

      var fv = await getFeatureVector(photo);

      if (fv === null) {
          this.setState({calculating:false});
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
          localStorage.setItem("fv", JSON.stringify(fv));
          this.context.emit('getFVfromDB');
      }
  }

  componentDidMount() {
     this.context.on('sentFVfromDB', async (results) => {
        let capturedPlayer = await this.getMatchingPlayerFromFV(results)

        if (capturedPlayer == null){
            this.setState({calculating:false});
            swal({
              title: "Unkown Person",
              text: "The Person in the photo is NOT a player",
              icon: "warning",
              button: "try again!",
          });
        }

        else {

          if (cookies.get('name') == capturedPlayer.name){

            this.setState({calculating:false});
            swal({
              title: "This is you!",
              text: "You can NOT capture yourself!",
              icon: "warning",
              button: "try again!",
              });
          }

          else {
            console.log(capturedPlayer._id);
            localStorage.setItem("capturedPlayerId", capturedPlayer._id);
            localStorage.setItem("capturedPlayerName", capturedPlayer.name);
            this.setRedirect();
          }
        }
    });

    this.interval = setInterval(() => {
      this.sendLocation();
    }, 750);
  }

  sendLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.context.emit("location", {
        token: cookies.get('token'),
        longitude: position.coords.longitude,
        latitude: position.coords.latitude,
        accuracy: Math.round(position.coords.accuracy)
      })
    });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }



  async getPlayerId() {

  };


  async getMatchingPlayerFromFV(results) {

    let fv1 = Object.values(JSON.parse(localStorage.getItem("fv")));
    let minDist = 1;
    let index = null;
    const threshold = 0.52;
    console.log(results)
    let i = 0
    for (i ; i < results.length; i++) {
      if (results[i].featureVector != null) {
      let fv2 = Object.values(JSON.parse(results[i].featureVector));
      let dist = await getFVDistance(fv1, fv2)
      if (minDist > dist && dist <= threshold) {
        console.log(dist);
        minDist = dist;
        index = i;
        }
      }
    }
    if (index != null) {
      console.log(results[index].name)
      return (results[index]);
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
          {!this.state.calculating && <div className="polaroid">
              <Camera
                  onTakePhoto = { (dataUri) => { this.onTakePhoto(dataUri); } }
                  isImageMirror = {true}
              />
          </div>}
          {this.state.calculating && <div className="polaroid">
              <div className="cameraLoader"></div>
              <p>Please wait while we look for this player.</p>
          </div>}

      </div>
    );
  }
}

CapturePlayer.contextType = SocketContext;

export default CapturePlayer;
