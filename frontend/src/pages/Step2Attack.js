import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import { Player } from 'video-react';

class Step2 extends Component {



  render() {

    return(
      <div>

      <div align="center" id="stepDiv">
      <p id="stepsTitle">Step 2</p>
      <div width="100vh" id="gifDiv">
      <p align="center" id="gif2">
      </p>
      </div><p id="stepsText">Gain achievements by killing more players and become the best player of your faction.</p>
      </div>
      </div>
    );
  }

}

export default Step2;
