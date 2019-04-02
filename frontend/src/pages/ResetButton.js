import React, { Component } from 'react';

class ResetButton extends React.Component {

  render() {
    return(
      <div><button onClick={this.props.reset}>Reset</button></div>

    );
  }

}

export default ResetButton;
