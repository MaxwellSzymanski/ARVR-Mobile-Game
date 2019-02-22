import React, { Component } from 'react';
// eslint-disable-next-line
import { HashRouter as Router, Route, Switch, NavLink } from 'react-router-dom';
import io from 'socket.io-client';
import './App.css';
import SocketContext from './socketContext';

import FirstPage from './FirstPage';
import CameraComp from './pages/CameraComp';
import Maps from './pages/Maps.js';
import View from './pages/View.js';
import LandingPage from './pages/LandingPage.js';
import Trial from './pages/Trial.js'
import ImageConfirm from "./pages/ImageConfirm";
import EmailVerif from "./pages/EmailVerif.js";
import ProfilePage from "./pages/ProfilePage";
import FactionChooser from "./pages/FactionChooser.js";

const url = require('./pages/serveradress.js');

class App extends Component {
  constructor() {
    super();

    this.state = { socket: io(url) };
  }

  async componentWillMount() {
    const socket = this.state.socket;
    socket.on("connect", function() {
      console.log("Component will mount\nsocket.connected: " + socket.connected);
    })
  }


  render() {
    return (
      <SocketContext.Provider value={this.state.socket}>
        <Router basename="/">
          <div className="App">
            <Switch>
              <Route exact path="/" component={FirstPage}> </Route>
              <Route exact path="/sign-in" component={FirstPage}> </Route>
              <Route exact path="/takePicture" component={CameraComp}> </Route>
              <Route exact path="/map" component={Maps}> </Route>
              <Route exact path="/view" component={View}> </Route>
              <Route exact path="/imageConfirm" component={ImageConfirm}> </Route>
              <Route exact path="/landingPage" component={LandingPage}> </Route>
              <Route exact path="/verify" component={EmailVerif}> </Route>
              <Route exact path="/trial" component={Trial}> </Route>
              <Route exact path="/profilePage" component={ProfilePage}> </Route>
              <Route exact path="/factionChooser" component={FactionChooser}> </Route>
            </Switch>
          </div>
        </Router>
      </SocketContext.Provider>
    );
  }
}

export default App;
