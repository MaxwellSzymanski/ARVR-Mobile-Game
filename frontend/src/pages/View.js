import React from 'react';
import {Redirect} from 'react-router';

class View extends React.Component {

  state = {
    Picture : false,
    SignUp : false };

  setRedirectPicture = () => {
      this.setState({Picture: true})
    }

  setRedirectSignUp = () => {
    this.setState({SignUp: true})
  }

  renderRedirectPicture = () => {
    if (this.state.Picture) {return <Redirect to="/takePicture" />}
  }

  renderRedirectSignUp = () => {
    if (this.state.SignUp) {return <Redirect to="/" />}
  }

  render () {
    var img = localStorage.getItem("PhotoOfMe")
    return (
      <div className="App">
      {this.renderRedirectSignUp()}
      {this.renderRedirectPicture()}
        <img alt="" src={img} />
        <button onClick={this.setRedirectSignUp()} >Save</button>
        <button onClick={this.setRedirectPicture()}>Retake</button>
      </div>

    );
  }
}

export default View;
