import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import { Player } from 'video-react';

class Step2 extends Component {



  render() {

    return(
      <div>

      <div align="center" id="stepDiv">
      <p id="stepsTitle">Capture player</p>
      <div width="100vh" id="gifDiv">
      <p align="center" id="gif2">
      </p>
      </div><p id="stepsText">Take a picture of another player. If the player is recognised by the game, you can attack him.</p>
      </div>
      </div>
    );
  }

}

export default Step2;
