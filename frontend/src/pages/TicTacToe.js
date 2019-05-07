import React, { Component } from 'react';
import './TicTacToe.css';
import Announcement from './Announcement.js';
import Tile from './Tile.js';
import ResetButton from './ResetButton.js';
import swal from "@sweetalert/with-react";
import Cookies from "universal-cookie";
import SocketContext from "../socketContext";
import BattlePage from "./BattlePage";

const cookies = new Cookies();

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
       ownIcon: ''
     };

    this.updateBoard = this.updateBoard.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {
    let attackToken = cookies.get("attackToken");

    if (cookies.get('initiatedTicTac') === "true") {
      alert("Initiating tictac!!");
      this.context.emit("initTictac", {token: cookies.get("token"), enemy: attackToken});
      cookies.set('initiatedTicTac', false)
    }
    //swal("Started. Your icon is >" + this.state.ownIcon + "<\n The turn is >" + this.state.turn + "<");

    this.context.on("initResponse", (data) => {
      this.setState({
        ownIcon: data.ownIcon,
        turn: data.turn
      });
      cookies.set('attackToken', data.oppId);
    });

    this.context.on("oppMove", (data) => {
      this.setState({
        gameBoard: data.board,
        turn: this.state.ownIcon
      });
      swal("Opponent board received! Your icon is >" + this.state.ownIcon + "<")
    });

    this.context.on("lose", () => {
      cookies.set('attackToken', false);
      cookies.set('initiatedTicTac', false);
      swal("You lose..")
    });

    this.context.on("win", () => {
      cookies.set('attackToken', false);
      cookies.set('initiatedTicTac', false);
      swal("You win!")
    });
  }

  componentWillUnmount() {
    cookies.set('initiatedTicTac', false);
  }

  updateBoard(loc, player) {
    cookies.set("initiatedTicTac", false);
    // For attack
    // this.context.emit("fight", {token: cookies.get('token'), enemy: cookies.get("attackToken")});
    if (this.state.turn !== this.state.ownIcon) {
      return;
    }

    let attackToken = cookies.get("attackToken");


    if  (this.state.gameBoard[loc] === 'x' || this.state.gameBoard[loc] === 'o' || this.state.winner) {
      //Invalid move
      return;
    }
    let currentGameBoard =  this.state.gameBoard;
    currentGameBoard.splice(loc, 1, this.state.turn);
    this.setState({gameBoard: currentGameBoard});

    this.context.emit("tictacMove",{board: this.state.gameBoard, token: cookies.get('token'), enemy: attackToken});

    //
    // Verplaatst naar serverside
    //

    this.setState({turn: (this.state.ownIcon === 'x') ? 'o' : 'x'})
  }


  render() {
    return (
      <div className= "container">
        <div id="menu">
          <div id="title"><h1 id="titleText">Tic-Tac-Toe</h1></div>
          <div  id="text"><Announcement
                              winner={this.state.turn}/></div>
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

TicTacToe.contextType = SocketContext;
export default TicTacToe;
