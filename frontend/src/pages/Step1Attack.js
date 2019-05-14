import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import { Player } from 'video-react';

class Step1Attack extends Component {



  render() {

    return(
      <div>

      <div align="center" id="stepDiv">
      <p id="stepsTitle">Step 1</p>
      <div width="100vh" id="gifDiv">
      <p align="center" id="gif1">
      </p>
      </div>
      <p id="stepsText">Play a game of tic-tac-toe to win against the opponent. Note that your stamina and motivation affect the damage you inflict.</p>
      </div>
      </div>
    );
  }

}

export default Step1Attack;
