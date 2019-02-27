import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from "axios";
import Cookies from 'universal-cookie';
const cookies = new Cookies();
import "./profilePage.css"

const url = require('./serveradress.js');

class CaptureResult extends React.Component {
  constructor() {
      super();
  }

  stats = {
    image : null,
    name: null,
    level: null,
    health: null
  }

  render() {
      return (
          <div>
              <button className="smallButton back topLeft"/>;
              <div className="profileCard">
                  <div className="profilePhoto"> </div>
                  <h1 className="name"> </h1>
                  <h3 className="smallText"> </h3>
              <button className="smallButton settings topRight"/>
          </div>
  }
}
