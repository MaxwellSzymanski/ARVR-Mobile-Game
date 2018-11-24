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
    if (this.state.redirect) {return <Redirect to="/" />}
  }
  onTakePhoto (dataUri) {
    // Do stuff with the dataUri photo...
    localStorage.setItem("PhotoOfMe", dataUri);
    this.setRedirect();
  }

  redirect() {
    return <Redirect to="/view"/>;
  }

  render () {
    return (
      <div className="App">
        {this.renderRedirect()}
        <Camera
          onTakePhoto = { (dataUri) => { this.onTakePhoto(dataUri); } }
        />

      </div>

    );
  }
}

export default CameraComp;
