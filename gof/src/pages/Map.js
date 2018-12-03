import React from 'react';
// eslint-disable-next-line
import { Link } from 'react-router-dom';
const url = require('./serveradress.js');


class Map extends React.Component {



    render() {
      return(
        <div className="background">
        <div className="loader"></div>
        <meta http-equiv="refresh" content="1; url=https://35.241.198.186/"></meta>
        </div>);

    }
}



export default Map;
