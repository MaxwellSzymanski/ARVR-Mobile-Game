import React, { Component } from 'react';
import { HashRouter as Router, Route, NavLink, Switch } from 'react-router-dom';
import SignUpForm from './pages/SignUpForm';
import SignInForm from './pages/SignInForm';
import FirstPage from './FirstPage';
import Map from './pages/Map';
import CameraComp from './pages/CameraComp';

import './App.css';



class App extends Component {
  render() {
    return (
      <Router basename="/react-auth-ui/">
        <div className="App">
        <Switch>
          <Route exact path="/" component={FirstPage}></Route>
          <Route path="/map" component={Map}></Route>
          <Route path="/takePicture" component={CameraComp}></Route>
      </Switch>

        </div>
      </Router>
    );
  }
}

export default App;
