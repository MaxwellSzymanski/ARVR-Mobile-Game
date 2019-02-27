import React from 'react';
import { Map, TileLayer} from 'react-leaflet';
import '../App.css';
import PlayerLayer from './PlayerLayer'
import Cookies from 'universal-cookie';
import PopPop from 'react-poppop';
import { Link } from 'react-router-dom';



const cookies = new Cookies();

class Trial extends React.Component {

    constructor(props){
        super(props);
        this.setCenter = this.setCenter.bind(this);
        this.showAlertBox = this.showAlertBox.bind(this);
        this.setTarget = this.setTarget.bind(this);
    }

    //dit is gwn een standaard setting, van af blijven
    state = {
        location: {
            lat: 50.8632811,
            lng: 4.6762872,
        },
        zoom: 14,
        id: cookies.get('name'),
        idTarget: cookies.get('name'),
        accuracy: 0,
        centerMap: [50.8632811,4.6762872],
        centerMap: [50.8632811, 4.6762872],
        showAlertBox: true,
        content: "Please allow access to your location.",
        alertBoxStyle: {
            transition: 'all 0.2s',
            backgroundColor: '#910F0F',
            borderRadius: '5px',
            boxShadow: '0 0 12px rgba(0,0,0,.14),0 12px 24px rgba(0,0,0,.28)',
            overflow: 'scroll',
            maxWidth: '70vw',
            padding: '10px 20px'
        }
    }

    componentWillMount() {
        navigator.geolocation.getCurrentPosition((position) => {
            this.setState({
                location: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                },
                haveUsersLocation: true,
                zoom: 18,
                showAlertBox: false,
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

    setTarget(id,pos){
      this.setState({showAlertBox: false})
      this.setState({centerMap: [pos[0],pos[1]]});
      this.setState({idTarget: id});
    }

    mapChanged(feature, layer){

      if(this.state.idTarget === null){
        var rows = [];
        rows.push(<Link to="/profilePage">Profile Page</Link>);
        rows.push(<Link to="/CaputurePlayer">Capture Player</Link>);
        this.showAlertBox(rows);
      }

      this.setState({idTarget:null});

    }


    render() {
        return (
            <Map onClick={()=> this.mapChanged()} className="mapss" center={this.state.centerMap} zoom={this.state.zoom}>
                <TileLayer
                    //attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    //url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url='https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png'
                />
                <PopPop open={this.state.showAlertBox} closeBtn={true} closeOnEsc={true} onClose={()=>this.alertBoxIsClosed()} closeOnOverlay={true} position={"centerCenter"} contentStyle={this.state.alertBoxStyle}>
                    <div>{this.state.content}</div>
                </PopPop>
                <PlayerLayer idTarget={this.state.idTarget} setTarget={this.setTarget} showAlertBox={this.showAlertBox} id={this.state.id} locationEnabled={this.state.haveUsersLocation}/>
            </Map>
        )
    }
}

export default Trial;
