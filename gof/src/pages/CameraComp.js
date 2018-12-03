import React from 'react';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import { Redirect } from 'react-router';

class CameraComp extends React.Component {

  state = {
    redirect : false }

  setRedirect = () => {
      this.setState({redirect: true})
    }

  renderRedirect = () => {
    if (this.state.redirect) {return <Redirect to="/imageConfirm" />}
  }
  onTakePhoto (dataUri) {
    // TODO: Check face



      if (false) {
        alert("No face detected, try again.")
      }
      else{
          localStorage.setItem("PhotoOfMe", dataUri);
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
