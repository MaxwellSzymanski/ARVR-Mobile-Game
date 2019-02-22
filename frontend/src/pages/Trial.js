import React from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import '../App.css';
import L from 'leaflet';
import PlayerLayer from './PlayerLayer'
import Cookies from 'universal-cookie';
import PopPop from 'react-poppop'

const cookies = new Cookies();

class Trial extends React.Component {

  constructor(props){
    super(props);
    this.setCenter = this.setCenter.bind(this);
    this.showAlertBox = this.showAlertBox.bind(this);
  }

  //dit is gwn een standaard setting, van af blijven
  state = {
    location: {
      lat: 50.8632811,
      lng: 4.6762872,
    },
    zoom: 16,
    id: cookies.get('name'),
    accuracy: 0,
    centerMap: [50.8632811,4.6762872],
    showAlertBox: false
  }

  componentDidMount() {
      navigator.geolocation.getCurrentPosition((position) => {
          this.setState({
              location: {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
              },
              haveUsersLocation: true,
              zoom: 18,
          })
      });
  }

  setCenter(pos){
    if(pos===null){
    this.setState({centerMap: pos});
    }
  }

  showAlertBox(content){
    this.setState({
      content: content,
      showAlertBox: true
    })
  }

  alertBoxIsClosed(){
    this.setState({ showAlertBox: false});
  }



  render() {

      return (
        <Map className="mapss" center={this.state.centerMap} zoom={this.state.zoom}>
          <TileLayer
            //attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            //url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url='https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png'
          />
          <PlayerLayer showAlertBox={this.showAlertBox} centerPlayerLayer={this.setCenter} id={this.state.id}/>
          <PopPop open={this.state.showAlertBox} closeBtn={true} closeOnEsc={true} onClose={()=>this.alertBoxIsClosed()} closeOnOverlay={true}>
            <div>{this.state.content}</div>
          </PopPop>
        </Map>
      )
    }

}

export default Trial;
