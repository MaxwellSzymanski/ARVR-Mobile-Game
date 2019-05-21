import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class NotFound extends Component {

  render() {
    return(
      <div className="background">
        <div className="wolfIcon"/>
        <div className="notfound">
          <ltitle>WhereWolf</ltitle>
        </div>
        <div>
          <p className="notfound">Page not found</p>
        </div>

        <div>
          <center><Link className="linkBack" to="/map">Return to WhereWolf</Link></center>
        </div>
      </div>

    );
  }

}

export default NotFound;
