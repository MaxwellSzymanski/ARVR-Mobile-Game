import React, { Component } from 'react';
import './TicTacToe.css';
import Announcement from './Announcement.js';
import Tile from './Tile.js';
import ResetButton from './ResetButton.js';
import swal from "@sweetalert/with-react";



class TicTacToe extends React.Component {

  constructor() {
     super();
     this.state = {
       gameBoard : [
         ' ', ' ', ' ',
         ' ', ' ', ' ',
         ' ', ' ', ' '
       ],
       turn: 'x',
       ownIcon: '',
       winner: null,
     }
  }

  componentDidMount() {
    let attackToken = cookies.get("attackToken");

    this.context.emit("initTictac", {token: cookies.get("token"), enemy: attackToken});

    this.context.on("initResponse", (data) => {
      this.setState({
        ownIcon: data.ownIcon,
        turn: data.turn
      });
    });

    this.context.on("tictac", (data) => {
      this.setState({
        gameBoard: data.gameBoard,
        turn: this.state.ownIcon
      });

    });

  }


  updateBoard(loc, player) {
    if (this.state.turn === this.state.ownIcon) {
      return;
    }
    this.context.emit("initTictac", {token: cookies.get("token"), enemy: attackToken});

    if  (this.state.gameBoard[loc] === 'x' || this.state.gameBoard[loc] === 'o' || this.state.winner) {
      //Invalid move
      return;
    }
    let currentGameBoard =  this.state.gameBoard;
    currentGameBoard.splice(loc, 1, this.state.turn);
    this.setState({gameBoard: currentGameBoard});
    let topRow = this.state.gameBoard[0] + this.state.gameBoard[1] + this.state.gameBoard[2];
    if (topRow.match(/xxx|ooo/)) {
      this.setState({winner: this.state.turn});
      return;
    }
    let middleRow = this.state.gameBoard[3] + this.state.gameBoard[4] + this.state.gameBoard[5];
    if (middleRow.match(/xxx|ooo/)) {
      this.setState({winner: this.state.turn});
      return;
    }
    let downRow = this.state.gameBoard[6] + this.state.gameBoard[7] + this.state.gameBoard[8];
    if (downRow.match(/xxx|ooo/)) {
      this.setState({winner: this.state.turn});
      return;
    }
    let leftCol = this.state.gameBoard[0] + this.state.gameBoard[3] + this.state.gameBoard[6];
    if (leftCol.match(/xxx|ooo/)) {
      this.setState({winner: this.state.turn});
      return;
    }
    let middleCol = this.state.gameBoard[1] + this.state.gameBoard[4] + this.state.gameBoard[7];
    if (middleCol.match(/xxx|ooo/)) {
      this.setState({winner: this.state.turn});
      return;
    }
    let rightCol = this.state.gameBoard[2] + this.state.gameBoard[5] + this.state.gameBoard[8];
    if (rightCol.match(/xxx|ooo/)) {
      this.setState({winner: this.state.turn});
      return;
    }
    let leftDiag  = this.state.gameBoard[0] + this.state.gameBoard[4] + this.state.gameBoard[8];
    if (leftDiag.match(/xxx|ooo/)) {
      this.setState({winner: this.state.turn});
      return;
    }
    let rightDiag = this.state.gameBoard[2] + this.state.gameBoard[4] + this.state.gameBoard[6];
    if (rightDiag.match(/xxx|ooo/)) {
      this.setState({winner: this.state.turn});
      return;
    }
    let moves = this.state.gameBoard.join('').replace(/ /g,'');
    if (moves.length === 9 ) {
      this.setState({winner: 'nobody'});
      return;
    }
    this.setState({turn: (this.state.turn === 'x') ? 'o' : 'x'})
  }




  render() {
    return (
      <div className= "container">
        <div id="menu">
          <div id="title"><h1>Tic-Tac-Toe</h1></div>
          <div  id="text"><Announcement
                              winner={this.state.winner}/></div>
        </div>
        <div className="theBoard">
        {this.state.gameBoard.map(function(value, i) {
          return (<Tile
            key={i}
            loc={i}
            value={value}
            updateBoard={this.updateBoard.bind(this)}
            turn={this.state.turn} />)

        }.bind(this))}
        </div>
      </div>
    );
  }
}

export default TicTacToe;
