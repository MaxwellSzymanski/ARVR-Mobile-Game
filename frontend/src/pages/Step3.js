import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import { Player } from 'video-react';

class Step3 extends Component {



  render() {

    return(
      <div>

      <div align="center" id="stepDiv">
      <p id="stepsTitle">Attack player</p>
      <div width="100vh" id="gifDiv">
      <p align="center" id="gif3">
      </p>
      </div><p id="stepsText">Click the attack button to start the battle.</p>
      </div>
      </div>
    );
  }

}

export default Step3;
