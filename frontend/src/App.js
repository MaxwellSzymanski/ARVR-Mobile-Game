import React, { Component } from 'react';
// eslint-disable-next-line
import {HashRouter as Router, Route, Switch, NavLink, Redirect} from 'react-router-dom';
import { AuthRoute, UnauthRoute } from 'react-router-auth';
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
import QRCode from "./pages/QRCode";
import BattlePage from "./pages/BattlePage";
import Settings from "./pages/Settings.js";
import Cookies from 'universal-cookie';
const cookies = new Cookies();
const url = require('./pages/serveradress.js');

class App extends Component {
    constructor() {
        super();

        this.state = {
            socket: io(url),
            loggedIn: false,
            verified: false,
            // verified: true,
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

        const loginToken = cookies.get('token');
        if (loginToken) {
            console.log("token found");
            socket.emit("jwt", {token: loginToken});
        }
        const that = this;
        socket.on("jwt", (data) => {
            that.setState({
                loggedIn: data.loggedIn,
                verified: data.verified,
            })
        });
    }

    render() {
        return (
            <SocketContext.Provider value={this.state.socket}>
                <Router basename="/">
                    <div className="App">
                        <Switch>
                            <Route path="/fieldtest/:token" component={LandingPage}/>

                            {/*<UnauthRoute exact path="/landingPage" component={LandingPage} redirectTo="/map" authenticated={this.state.verified}/>*/}

                            <UnauthRoute exact path="/" component={FirstPage} redirectTo="/map" authenticated={this.state.verified}/>
                            <UnauthRoute exact path="/sign-in" component={FirstPage} redirectTo="/map" authenticated={this.state.verified}/>
                            <UnauthRoute exact path="/takePicture" component={CameraComp} redirectTo="/map" authenticated={this.state.verified}/>
                            <UnauthRoute exact path="/imageConfirm" component={ImageConfirm} redirectTo="/map" authenticated={this.state.verified}/>
                            <UnauthRoute exact path="/verify" component={EmailVerif} redirectTo="/map" authenticated={this.state.verified}/>

                            <Route exact path="/factionChooser" component={FactionChooser} />

                            <AuthRoute exact path="/map" component={Trial} redirectTo="/sign-in" authenticated={this.state.verified}/>
                            <AuthRoute exact path="/profilePage" component={ProfilePage} redirectTo="/sign-in" authenticated={this.state.verified}/>
                            <AuthRoute exact path="/settings" component={Settings} redirectTo="/sign-in" authenticated={this.state.verified} />
                            <AuthRoute exact path="/qrCode" component={QRCode} redirectTo="/map" authenticated={this.state.verified}/>
                            <AuthRoute exact path="/capturePlayer" component={CapturePlayer} redirectTo="/sign-in" authenticated={this.state.verified}/>
                            <AuthRoute exact path="/view" component={View} redirectTo="/sign-in" authenticated={this.state.verified} />
                            <Route exact path="/battlePage" component={BattlePage} redirectTo="/sign-in" authenticated={this.state.verified} />
                        </Switch>
                    </div>
                </Router>
            </SocketContext.Provider>
        );
    }
}

export default App;
