import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class NotFound extends Component {

  render() {
    return(
      <div className="background">
        <div className="wolfIcon"/>
        <div className="notfound">
          <ltitle>Game of Wolves</ltitle>
        </div>
        <div>
          <p className="notfound">Page not found</p>
        </div>

        <div>
          <center><Link className="linkBack" to="/map">Return to Game of Wolves</Link></center>
        </div>
      </div>

    );
  }

}

export default NotFound;
