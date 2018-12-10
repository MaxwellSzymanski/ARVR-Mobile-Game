import React from 'react';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import { Redirect } from 'react-router';
import { getFeatureVector } from '../facerecognition/FaceRecognition';

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
	  var photoSrc = localStorage.getItem("PhotoOfMe", dataUri);
    var photo = new Image;
    photo.src = "/test.jpg";
    //photo.src = photoSrc
    console.log(photo)

      var fv = await getFeatureVector(photo);
      alert(fv);

      if (fv === null) {
        console.log("No face detected!")
        alert("No face detected, try again.")
      }
      else{
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
            />
        </div>
      </div>



    );
  }
}

export default CameraComp;
