import React from 'react';
// eslint-disable-next-line
import { Link } from 'react-router-dom';
import Radar from './Radar.js';
import LoadingScreen from 'react-loading-screen';
import LoaderComponent from './LoaderComponent.js';

const url = require('./serveradress.js');


class Map extends React.Component {



    render() {
      return(
        <div className="background">
        <div className="loader"></div>
        <meta http-equiv="refresh" content="1; url=https://nl.wikipedia.org/wiki/Aardappel"></meta>
        </div>);

    }
}



export default Map;
