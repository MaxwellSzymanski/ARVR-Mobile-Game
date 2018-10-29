import React from 'react';
import { HashRouter as Router, Route, NavLink } from 'react-router-dom';
import SignUpForm from './pages/SignUpForm';
import SignInForm from './pages/SignInForm';

import './App.css';

import SignUpForm from './pages/SignUpForm';
import SignInForm from './pages/SignInForm';

>>>>>>> 2bfc6dce1f316acba87ec05cb85bbbef9970d489
class FirstPage extends React.Component {
  render() {
    return(
      <div>
      <div className="Title">
        <h1>Game Of Wolves</h1>
      </div>
      <div className="App__Form">
        <div className="PageSwitcher">
            <NavLink to="/sign-in" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">Sign In</NavLink>
            <NavLink exact to="/" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">Sign Up</NavLink>
          </div>


          <Route exact path="/" component={SignUpForm}>
          </Route>
          <Route path="/sign-in" component={SignInForm}>
          </Route>
          <Route path="/map" component={Map}></Route>
      </div>
      </div>
    );
  }

}

export default FirstPage;
