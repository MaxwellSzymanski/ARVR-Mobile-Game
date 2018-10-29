import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch, NavLink } from 'react-router-dom';
import FirstPage from './FirstPage';
import CameraComp from './pages/CameraComp';
import Map from './pages/CameraComp';

import './App.css';



class App extends Component {
  render() {
    return (
      <Router basename="/react-auth-ui/">
        <div className="App">
          <Switch>
            <Route exact path="/" component={FirstPage}></Route>
            <Route exact path="/sign-in" component={FirstPage}></Route>
            <Route exact path="/takePicture" component={CameraComp}></Route>
            <Route exact path="/map" component={Map}></Route>
          </Switch>
          }
        </div>
      </Router>
    );
  }
}

export default App;
