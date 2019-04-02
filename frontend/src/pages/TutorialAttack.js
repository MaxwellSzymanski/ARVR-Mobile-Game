import React, { Component } from 'react';
import Step1Attack from './Step1Attack.js';
import Step2Attack from './Step2Attack.js';
import Step3Attack from './Step3Attack.js';

class TutorialAttack extends Component {

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
      steps = <Step1Attack/>
    }

    if (this.state.step == 2) {
      steps = <Step2Attack/>
    }

    if (this.state.step == 3) {
      steps = <Step3Attack/>
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

export default TutorialAttack;
