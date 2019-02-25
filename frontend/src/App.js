import React, { Component } from 'react';
// eslint-disable-next-line
import {HashRouter as Router, Route, Switch, NavLink, Redirect} from 'react-router-dom';
import io from 'socket.io-client';
import './App.css';
import SocketContext from './socketContext';
import FirstPage from './FirstPage';
import CameraComp from './pages/CameraComp';
import View from './pages/View.js';
import LandingPage from './pages/LandingPage.js';
import Trial from './pages/Trial.js'
import ImageConfirm from "./pages/ImageConfirm";
import EmailVerif from "./pages/EmailVerif.js";
import ProfilePage from "./pages/ProfilePage";
import CapturePlayer from "./pages/CapturePlayer.js";
import FactionChooser from "./pages/FactionChooser";
import Settings from "./pages/Settings.js";
import Cookies from 'universal-cookie';
const cookies = new Cookies();
const url = require('./pages/serveradress.js');


class App extends Component {
  constructor() {
    super();

    this.state = {
      socket: io(url),
      loaded: false,
      loggedIn: false,
      verified: false,
    };
  }

  async componentWillMount() {
    const socket = this.state.socket;
    socket.on("connect", function() {
      console.log("Component will mount\nsocket.connected: " + socket.connected);
    });

    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    window.addEventListener('resize', () => {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    });

    const loginToken = cookies.get('loginCookie');
    if (loginToken) {
        console.log("token found");
        socket.emit("jwt", {token: loginToken});
    } else {
        this.setState({loaded: true});
    }
    const that = this;
    socket.on("jwt", (data) => {
        that.setState({
            loaded: true,
            loggedIn: data.loggedIn,
            verified: data.verified,
        })
    });
  }

    renderRedirect = () => {
        if (!this.state.loaded) {
          return <Redirect to="/landingPage"/>
        } else if (this.state.verified) {
          return <Redirect to="/map"/>
        } else if (this.state.loggedIn) {
          return <Redirect to="/verify"/>
        } else {
          return <Redirect to="/"/>
        }
    };

  render() {
    return (
      <SocketContext.Provider value={this.state.socket}>
        <Router basename="/">
          <div className="App">
              {this.renderRedirect()}
            <Switch>
              <Route exact path="/" component={FirstPage}> </Route>
              <Route exact path="/sign-in" component={FirstPage}> </Route>
              <Route exact path="/takePicture" component={CameraComp}> </Route>
              <Route exact path="/view" component={View}> </Route>
              <Route exact path="/imageConfirm" component={ImageConfirm}> </Route>
              <Route exact path="/landingPage" component={LandingPage}> </Route>
              <Route exact path="/verify" component={EmailVerif}> </Route>
              <Route exact path="/map" component={Trial}> </Route>
              <Route exact path="/profilePage" component={ProfilePage}> </Route>
              <Route exact path="/factionChooser" component={FactionChooser}> </Route>
              <Route exact path="/settings" component={Settings}> </Route>
              <Route exact path="/CapturePlayer" component={CapturePlayer}> </Route>
            </Switch>
          </div>
        </Router>
      </SocketContext.Provider>
    );
  }
}

export default App;
