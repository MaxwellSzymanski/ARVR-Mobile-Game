import React, { Component } from 'react';
import './Tile.css';

class Tile extends React.Component {

  tileClick(props) {
    props.updateBoard(props.loc, props.turn);
  }

  render() {
    return(
      <div className={"tile"} onClick={() => this.tileClick(this.props)}>
        <div id="sign"><p id="text" >{this.props.value}</p></div>
      </div>
    );
  }
}

export default Tile;
