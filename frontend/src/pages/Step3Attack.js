import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import { Player } from 'video-react';

class Step3 extends Component {



  render() {

    return(
      <div>

      <div align="center" id="stepDiv">
      <p id="stepsTitle">Step 3</p>
      <div width="100vh" id="gifDiv">
      <p align="center" id="gif3">
      </p>
      </div><p id="stepsText">Fleeing makes you take damage, so beware of that! When you lose, you get to choose a new faction.</p>
      </div>
      </div>
    );
  }

}

export default Step3;
