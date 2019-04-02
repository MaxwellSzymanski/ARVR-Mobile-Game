import React, { Component } from 'react';
import './Announcement.css';

class Announcement extends React.Component {


  render() {
    return (
      <div className={this.props.winner ? 'visible' : 'hidden '}>
        <p id='ann'>{this.props.winner} won </p>

      </div>
    );
  }
}


export default Announcement;
