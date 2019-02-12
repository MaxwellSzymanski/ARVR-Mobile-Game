import React, { Component } from 'react';
// eslint-disable-next-line
import { HashRouter as Router, Route, Switch, NavLink } from 'react-router-dom';
import FirstPage from './FirstPage';
import CameraComp from './pages/CameraComp';
import Maps from './pages/Maps.js';
import View from './pages/View.js';
import LandingPage from './pages/LandingPage.js';
import Trial from './pages/Trial.js'

import './App.css';
import ImageConfirm from "./pages/ImageConfirm";

import EmailVerif from "./pages/EmailVerif.js";

class App extends Component {
  render() {
    return (
      <Router basename="/">
        <div className="App">
          <Switch>
            <Route exact path="/" component={FirstPage}></Route>
            <Route exact path="/sign-in" component={FirstPage}></Route>
            <Route exact path="/takePicture" component={CameraComp}></Route>
            <Route exact path="/map" component={Maps}></Route>
            <Route exact path="/view" component={View}></Route>
            <Route exact path="/imageConfirm" component={ImageConfirm}></Route>
            <Route exact path="/landingPage" component={LandingPage}></Route>
            <Route exact path="/verify" component={EmailVerif}></Route>
            <Route exact path="/trial" component={Trial}></Route>
          </Switch>

        </div>
      </Router>
    );
  }
}

export default App;
