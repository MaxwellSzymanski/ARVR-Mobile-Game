import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import { Player } from 'video-react';

class Step1 extends Component {



  render() {

    return(
      <div>

      <div align="center" id="stepDiv">
      <p id="stepsTitle">Find another wolf</p>
      <div width="100vh" id="gifDiv">
      <p align="center" id="gif1">
      </p>
      </div>
      <p id="stepsText">Look for other wolves on the map and send them a handshake to show them you want to battle</p>
      </div>
      </div>
    );
  }

}

export default Step1;
