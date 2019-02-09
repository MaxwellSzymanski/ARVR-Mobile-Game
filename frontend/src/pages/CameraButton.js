import React from 'react';

class CameraButton extends React.Component {



  render() {
    let button;
    if (localStorage.getItem("SelfieTaken") === null) {
      button = <img className="button" src={ require('../camera2.png') } />;
    } else {
      button = <img  src={require('../WOLF.png')}/>
    }

    return( {button});
  }

}

export default CameraButton;
