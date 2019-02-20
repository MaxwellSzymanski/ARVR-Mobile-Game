import React from 'react';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import { Redirect } from 'react-router';
import { getFeatureVector } from '../facerecognition/FaceRecognition';
import swal from '@sweetalert/with-react';

class CameraComp extends React.Component {

  state = {
    redirect : false }

  setRedirect = () => {
      this.setState({redirect: true})
    }

  renderRedirect = () => {
    if (this.state.redirect) {return <Redirect to="/imageConfirm" />}
  }
  async onTakePhoto (dataUri) {
      // TODO: Check face
      var photoSrc = dataUri;
      var photo = new Image;
      photo.src = photoSrc;
      console.log(photo);

      var fv = await getFeatureVector(photo);

      if (fv === null) {
          console.log("No face detected!")
          swal({
              title: "No face detected",
              text: "Make sure you are facing the camera with good lighting conditions.",
              icon: "warning",
              button: "I'll try!",
          });
      }
      else {
          localStorage.setItem("PhotoOfMe", dataUri);
          localStorage.setItem("fv", fv);
          this.setRedirect();
      }

  }

  redirect() {
    return <Redirect to="/view"/>;
  }


  render () {
    return (
      <div className="background">
        {this.renderRedirect()}
        <div className="polaroid">
            <Camera
                onTakePhoto = { (dataUri) => { this.onTakePhoto(dataUri); } }
                isImageMirror = {true}
                imageType = {IMAGE_TYPES.PNG}
                imageCompression = {0.97}
            />
        </div>
      </div>



    );
  }
}

export default CameraComp;
