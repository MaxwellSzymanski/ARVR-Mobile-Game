import React from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import '../App.css';
import L from 'leaflet';
import PlayerLayer from './PlayerLayer'
import Cookies from 'universal-cookie';

const cookies = new Cookies();


class Trial extends React.Component {

  //dit is gwn een standaard setting, van af blijven
  state = {
    location: {
      lat: 50.8632811,
      lng: 4.6762872,
    },
    zoom: 10,
    message: 1,
    message2: 222,
    id: cookies.get('name'),
    accuracy: 0,
    dataPlayers: null,
    counter: 1
  }

  //hier krijgen we de locatie van de mainuser door, en wordt de 'myIcon' op die locatie gezet
  componentDidMount() {
    // navigator.geolocation.getCurrentPosition((position) =>
    // { this.setState({
    //   location: {
    //     lat: position.coords.latitude,
    //     lng: position.coords.longitude
    //   },
    //   haveUsersLocation: true,
    //   zoom: 18,
    //   id: this.state.id,
    //   accuracy: position.coords.accuracy
    //   })
    // });

    // this.interval = setInterval(() => {
    //     this.receivePlayers();
    // }, 1000);

  }


  render() {
      const position = [this.state.location.lat, this.state.location.lng]


      return (
        <Map className="mapss" center={position} zoom={this.state.zoom}>
          <TileLayer
            //attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            //url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url='https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png'
          />
          <PlayerLayer id={this.state.id}/>
        </Map>
      )
    }

}

export default Trial;
