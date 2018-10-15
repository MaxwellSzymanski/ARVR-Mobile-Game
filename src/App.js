
import React, { Component } from 'react';
import { Router, browserHistory, Route, Link } from 'react-router';
import './App.css';

const Page = ({ title }) => (
    <div className="App">
      <div className="App-header">
        <img src="WOLF.png" className="App-logo" alt="logo" />
        <h2>{title}</h2>
      </div>
      <div id="onderkant">
      <p id="Welcome" className="App-intro">
        Welcome to Game of Wolves
      </p>
      <p>
        <Link class='link' to="/">Home</Link>
      </p>
      <p>
        <Link class='link' to="/about">About</Link>
      </p>
      <p>
        <Link class='link' to="/settings">Settings</Link>
      </p></div>
    </div>
);

const Home = (props) => (
  <Page title="Game of Wolves"/>
);

const About = (props) => (
  <Page title="About"/>
);

const Settings = (props) => (
  <Page title="Settings"/>
);

class App extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={Home}/>
        <Route path="/about" component={About}/>
        <Route path="/settings" component={Settings}/>
      </Router>
    );
  }
}

export default App;
