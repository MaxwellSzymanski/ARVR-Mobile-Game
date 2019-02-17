import React from 'react';
import Popup from "reactjs-popup";
import Modal from 'react-modal'
import PopPop from 'react-poppop'

class AlertBox extends React.Component {

  constructor(props) {
  super(props);
  this.state = {
    show: true
  }
  }

  toggleShow = show => {
    this.setState({show});
  }

  render () {
        const {show} = this.state;
    return(
      <PopPop open={show} closeBtn={true} closeOnEsc={true} onClose={() => this.toggleShow(false)} closeOnOverlay={true}>
          {this.props.content}
      </PopPop>

        )
  }
}

export default AlertBox
