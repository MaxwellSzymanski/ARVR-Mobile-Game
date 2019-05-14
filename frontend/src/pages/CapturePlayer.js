import React from 'react';
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import { Link, Redirect } from 'react-router-dom';
import { getFeatureVector, getFVDistance } from '../facerecognition/FaceRecognition';
import swal from '@sweetalert/with-react';
import SocketContext from "../socketContext";
import Cookies from 'universal-cookie';
import Webcam from "react-webcam";

const cookies = new Cookies();

class CapturePlayer extends React.Component {

    constructor(props) {
        super(props);
        this.onTakePhoto = this.onTakePhoto.bind(this);
    }

  state = {
    redirect : false,
    calculating: false,
    width: 0,
  };

  setRedirect = () => {
      this.setState({redirect: true})
    };

  renderRedirect = () => {
    if (this.state.redirect) {return <Redirect to="/battlePage" />}
  };


  async onTakePhoto () {
      let dataUri = this.refs["webcam"].getScreenshot();
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
              button: "Try again!",
          });
      }

      else {
          localStorage.setItem("PhotoOfPlayer", dataUri);
          //localStorage.setItem("fv", JSON.stringify(fv));
          this.context.emit('getFVMatch', {FV: JSON.stringify(fv), enemy: cookies.get("enemy")});
      }
  }

  componentWillMount() {
      window.addEventListener('resize', this.updateWindowDimensions);
      this.updateWindowDimensions();
  }

  componentDidMount() {
     this.context.on('sentFVMatch', async (match) => {
        //let capturedPlayer = await this.getMatchingPlayerFromFV(match)
        let capturedPlayer = match;

        if (capturedPlayer === null){
            this.setState({calculating:false});
            swal({
              title: "Unkown Person",
              text: "The Person in the photo is not a Game of Wolves player.\nSure you followed game protocol?",
              icon: "warning",
              button: "Try again!",
          });
        }

        else {

          if (cookies.get('name') === capturedPlayer.name){

            this.setState({calculating:false});
            swal({
              title: "This is you!",
              text: "You can not capture yourself! Nice try though.",
              icon: "warning",
              button: "Try again!",
              });
          }

          else {
            console.log(capturedPlayer._id);
            cookies.remove("enemy");
            if (capturedPlayer.token !== null && capturedPlayer.token !== undefined) {
                const options = {
                    path: '/',
                    expires: new Date(new Date().getTime() + 15 * 60 * 1000)   // expires in 15 minutes
                };
                cookies.set('attackToken', capturedPlayer.token, options);
                swal({ title: "Player found!",
                    text: "Go ahead and attack, if you're not afraid",
                    icon: "success",
                    confirm: true}).then( (value) => {
                        this.setRedirect();
                });
            }
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
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
      this.setState({ width: window.innerWidth });
  }

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
      console.log(results[index].name);
      return (results[index]);
    }
    else return null;
  };


  async showCapturedPlayer(id) {
    this.context.emit('getCapturedPlayerStats', id);
  };

  render () {
      const videoConstraints = {
          facingMode: "environment"
      };
      let size = this.state.width - 60;
    return (
      <div className="background">
        {this.renderRedirect()}
          {!this.state.calculating && <div className="polaroid">
              <Webcam
                  audio={false}
                  ref="webcam"
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  width={size}
              />
              <button className="smallButton antiquewhite camera" onClick={this.onTakePhoto}> </button>
          </div>}
          {this.state.calculating && <div className="polaroid">
              <div className="cameraLoader"></div>
              <p>Please wait while we look for this player.</p>
          </div>}
          <Link to="/map"><button className="smallButton back antiquewhite topLeftIcon fadeIn0"/></Link>
      </div>
    );
  }
}



CapturePlayer.contextType = SocketContext;

export default CapturePlayer;
