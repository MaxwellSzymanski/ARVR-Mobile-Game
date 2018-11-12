import React from 'react';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

class CameraComp extends React.Component {
  onTakePhoto (dataUri) {
    // Do stuff with the dataUri photo...
    localStorage.setItem("PhotoOfMe", dataUri);
  }

  render () {
    return (
      <div className="App">
        <Camera
          onTakePhoto = { (dataUri) => { this.onTakePhoto(dataUri); } }
        />
      </div>

    );
  }
}

export default CameraComp;
