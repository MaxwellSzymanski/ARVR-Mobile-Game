import React, { Component } from 'react';
import './TicTacToe.css';
import Announcement from './Announcement.js';
import Tile from './Tile.js';
import ResetButton from './ResetButton.js';
import swal from "@sweetalert/with-react";
import Cookies from "universal-cookie";
import SocketContext from "../socketContext";
import BattlePage from "./BattlePage";
import {Redirect} from "react-router-dom";

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
       ownIcon: 'x',
       redirect: false,
       redirectFaction: false
     };

    this.updateBoard = this.updateBoard.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {
    let attackToken = cookies.get("attackToken");

    if (cookies.get('initiatedTicTac') === "true") {
      this.context.emit("initTictac", {token: cookies.get("token"), enemy: attackToken});
      cookies.set('initiatedTicTac', false)
    }

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
    });

    this.context.on("lose", (data) => {
      cookies.set('attackToken', false);
      cookies.set('initiatedTicTac', false);
      swal({title: 'You lose!', icon: 'error', text: data.message, confirm: true})
          .then(() => {
            if (data.dead) {
              this.setState({redirectFaction: true})
            }
            else {
              this.setState({redirect: true})
            }

          });
    });

    this.context.on("draw", (data) => {
      cookies.set('attackToken', false);
      cookies.set('initiatedTicTac', false);
      swal({title: 'Draw!', icon: 'warning', text: data.message, confirm: true})
          .then((value) => {
            this.setState({redirect: true})
          });
    });

    this.context.on("win", (data) => {
      cookies.set('attackToken', false);
      cookies.set('initiatedTicTac', false);
      swal({title: 'You win!', icon: 'success', text: data.message, confirm: true})
          .then((value) => {
            if (data.kills % 10 === 0 || data.kills === 1) {
              swal({title: 'Achievement unlocked!', icon: 'success', text: "You killed " + data.kills + " people in total.", confirm: true})
                  .then((value) => {
                    this.setState({redirect: true})
                  });
            }
            else {
              this.setState({redirect: true})
            }
          });
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

  renderRedirect = () => {
    if (this.state.redirect) {return <Redirect to="/map" />;}
  };

  renderRedirectDied = () => {
    if (this.state.redirectFaction) {return <Redirect to="/factionChooserPath" />;}
  };

  getTurn() {
    if (this.state.ownIcon === this.state.turn) return "Your";
    return "Opponents";
  }


  render() {
    return (
        <div>
          {this.renderRedirect()}
          {this.renderRedirectDied()}
      <div className= "container">
        <div id="menu">
          <div id="title"><h1 id="titleText">Tic-Tac-Toe</h1></div>
          <h2>{this.getTurn()} turn</h2>
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
        </div>
    );
  }
}

TicTacToe.contextType = SocketContext;
export default TicTacToe;
