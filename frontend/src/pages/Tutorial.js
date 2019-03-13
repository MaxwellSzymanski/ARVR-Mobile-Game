import React, { Component } from 'react';
import Step1 from './Step1.js';
import Step2 from './Step2.js';
import Step3 from './Step3.js';

class Tutorial extends Component {

  constructor() {
    super();
    this.state = {
      step: 1,
    };
  }

  handleClose() {

  }

  handleNext() {
    this.setState({ step: this.state.step+1})
  }

  render() {
    let steps;
    let buttons;

    if (this.state.step == 1) {
      steps = <Step1/>
    }

    if (this.state.step == 2) {
      steps = <Step2/>
    }

    if (this.state.step == 3) {
      steps = <Step3/>
    }

    if (this.state.step == 2) {

    } else {
      buttons = <button id="tutorialButton" onClick={() => this.handleNext()}></button>
    }


    return(
      <div id="tutorial">
      {steps}
      <p align="right" bottom="0">
      {buttons}</p>
      </div>
    );
  }

}

export default Tutorial;
