import React from 'react';
import 'react-html5-camera-photo/build/css/index.css';
import { Redirect } from 'react-router';
import { getFeatureVector } from '../facerecognition/FaceRecognition';
import swal from '@sweetalert/with-react';
import Webcam from "react-webcam";

class CameraComp extends React.Component {
  constructor() {
      super();
      this.state = {
          redirect : false,
          picture: null,
          calculating: false,
          width: 0,
      };

      this.handleUpload = this.handleUpload.bind(this);
      this.onTakePhoto = this.onTakePhoto.bind(this);
      this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

    componentWillMount() {
        window.addEventListener('resize', this.updateWindowDimensions);
        this.updateWindowDimensions();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
      this.setState({ width: window.innerWidth });
    }

    setRedirect = () => {
        this.setState({redirect: true})
    };

    renderRedirect = () => {
        if (this.state.redirect) {return <Redirect to="/imageConfirm" />}
    };

    async onTakePhoto() {
        let dataUri = this.refs['webcam'].getScreenshot();
        this.setState({ calculating: true});
        let photo = new Image;
        let photoSrc = dataUri;
        photo.src = photoSrc;
        console.log(photo);
        let fv = await getFeatureVector(photo);

        if (fv === null) {
          console.log("No face detected!");
          swal({
              title: "No face detected",
              text: "Make sure you are facing the camera with good lighting conditions.",
              icon: "warning",
              button: "I'll try!",
          });
          this.setState({ calculating: false});
        }
        else {
          localStorage.setItem("PhotoOfMe", dataUri);
          localStorage.setItem("fv", JSON.stringify(fv));
          this.setRedirect();
        }

    }

    redirect() {
        return <Redirect to="/view"/>;
    }

    async handleUpload(picture) {
        if (picture.toString() !== "") {
          this.setState({ calculating: true});
          let photo = new Image;
          let photoSrc = URL.createObjectURL(picture[0])
          photo.src = photoSrc;
          let fv = await getFeatureVector(photo);
          if (fv === null) {
            console.log("No face detected!");
            swal({
                title: "No face detected",
                text: "Make sure you are facing the camera with good lighting conditions.",
                icon: "warning",
                button: "I'll try!",
            });
            this.setState({ calculating: false});
          }
          else {
            localStorage.setItem("PhotoOfMe", photoSrc);
            localStorage.setItem("fv", JSON.stringify(fv));
            this.setRedirect();
          }
        }
        else {
            // Error, either too big or
            swal("Make sure the picture is jpg or png and smaller than 5MB.")
        }
    }

    showInfo() {
        swal("Why am I seeing this page?", "Since you are using an iOS device, the camera component is not" +
        " compatible with the web app. That's why we are offering you a way to choose a photo from your camera roll.")
    }


    render () {
        const videoConstraints = {
            facingMode: "user"
        };
        let size = this.state.width - 60;
    return (
      <div className="background">
        {this.renderRedirect()}
        <p className="subTitle">Take your profile picture</p>
          {!this.state.calculating && <div className="polaroidMirror">
              <div className="inlineBlock">
                  <Webcam
                  ref="webcam"
                  audio={false}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  width={size}
              /></div>
              <button className="smallButton antiquewhite camera" onClick={this.onTakePhoto}> </button>
          </div>}
          {this.state.calculating && <div className="polaroid">
              <div className="cameraLoader"></div>
              <p>Detecting face. This can take up to 30 seconds.</p>
          </div>}
      </div>
      );
      }

}

export default CameraComp;
