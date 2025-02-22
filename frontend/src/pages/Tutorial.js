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

  handlePrevious() {
    this.setState({ step: this.state.step-1})
  }

  render() {
    let steps;
    let buttons = [];

    if (this.state.step == 1) {
      steps = <Step1/>
    }

    if (this.state.step == 2) {
      steps = <Step2/>
    }

    if (this.state.step == 3) {
      steps = <Step3/>
    }

    if (this.state.step == 1) {
      buttons = <button className="smallButton next" onClick={() => this.handleNext()}></button>
    }
    else if (this.state.step == 3) {
      buttons = <button className="smallButton back left" onClick={() => this.handlePrevious()}></button>
    }
    else {
      buttons.push(<button className="smallButton back left" onClick={() => this.handlePrevious()}></button>);
      buttons.push(<button className="smallButton next" onClick={() => this.handleNext()}></button>)
    }


    return(
      <div id="tutorial">
      <div>{steps}</div>
      <div id="pijltjes"><p align="right" bottom="0">
      {buttons}</p></div>
      </div>
    );
  }

}

export default Tutorial;
