import React, { Component } from 'react';
// eslint-disable-next-line
import { HashRouter as Router, Route, Switch, NavLink, Redirect } from 'react-router-dom';
import FirstPage from './FirstPage';
import CameraComp from './pages/CameraComp';
import Map from './pages/Map.js';
import Radars from './pages/Radars.js';

import './App.css';
import axios from "axios";
import Cookies from 'universal-cookie';
const cookies = new Cookies();

const url = 'https://localhost:8080';

// determine whether someone is logged in
// if so, a cookie containing a login token would be stored in the browser
// that token is sent to the back-end server to check if it's valid
// this method returns a value about the existence/correctness of the stored token
// this method is used to allow or deny a user access to user-only pages of the app (cf. routing)
function loggedIn() {
    const loginToken = cookies.get('loginCookie');
    console.log(loginToken);
    if (loginToken) {
        console.log("token found");
        const dataToSend = {token: "zerytuyu", request: "jwt"};
        const obj = JSON.stringify(dataToSend);
        axios.post(url, obj)
            .then(
                function (json) {
                    if (json.data.result) return false;
                    return true;
                }
            );
    } else {
        console.log("no token found");
        return true;
    }
}

class App extends Component {
  render() {
    return (
      <Router basename="/react-auth-ui/">
        <div className="App">
          <Switch>
            <Route exact path="/" component={FirstPage}></Route>
            <Route exact path='/radar' component={Radars}></Route>
            <Route exact path="/sign-in" render={ () => (
                !loggedIn() ? <Redirect to="/map"/> : <FirstPage />
                // false ? <Redirect to="/map"/> : <FirstPage />
            )}/>
            <Route exact path="/takePicture" component={CameraComp}></Route>
            <Route exact path="/map" render={ () => (
                loggedIn() ? <Redirect to="/sign-in"/> : <Map />
                // false ? <Redirect to="/sign-in"/> : <Map />
            )}/>
          </Switch>
          }
        </div>
      </Router>
    );
  }
}

export default App;
