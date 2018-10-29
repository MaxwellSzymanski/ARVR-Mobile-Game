import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import FirstPage from './FirstPage';
import Maps from './pages/Maps';
import CameraComp from './pages/CameraComp';

import './App.css';



class App extends Component {
  render() {
    return (
      <Router basename="/react-auth-ui/">
        <div className="App">
        <Switch>
          <Route exact path="/" component={FirstPage}></Route>
          <Route path="/map" component={Maps}></Route>
          <Route path="/takePicture" component={CameraComp}></Route>
      </Switch>

        </div>
      </Router>
    );
  }
}

export default App;
