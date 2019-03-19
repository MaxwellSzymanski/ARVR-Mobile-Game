import React from 'react';
import { Map, TileLayer} from 'react-leaflet';
import '../App.css';
import PlayerLayer from './PlayerLayer';
import Cookies from 'universal-cookie';
import PopPop from 'react-poppop';
import { Link, Redirect } from 'react-router-dom';
import SocketContext from "../socketContext";
import Draggable from 'react-draggable';
import Modal from 'react-modal';
import Tutorial from './Tutorial';


const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    width                 : '40vh',
    height                : '70vh',
    backgroundColor       : '#910F0F',
  }

};

const cookies = new Cookies();

class Trial extends React.Component {

    constructor(props){
        super(props);
        this.setCenter = this.setCenter.bind(this);
        this.showAlertBox = this.showAlertBox.bind(this);
        this.setTarget = this.setTarget.bind(this);
        this.changeMenu = this.changeMenu.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
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
        showAlertBox: true,
        show:false,
        content: [<p className="colorWhite">Please allow access to your location.</p>,],
        alertBoxStyle: {
            transition: 'all 0.2s',
            backgroundColor: '#910F0F',
            borderRadius: '5px',
            boxShadow: '0 0 12px rgba(0,0,0,.14),0 12px 24px rgba(0,0,0,.28)',
            overflow: 'scroll',
            maxWidth: '70vw',
            padding: '10px 20px'
        }
    };

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
                content: [],

            });
            this.setTarget(this.state.id, [this.state.location.lat, this.state.location.lng]);
        });
    }

    componentDidMount() {
        this.context.on("message", (data) => {
            let rows = [];
            rows.push(<p className="colorWhite">{data.message}</p>);
            this.showAlertBox(rows);
        });
    }

    setCenter(pos){
        if(pos===null){
            this.setState({centerMap: pos});
        }
    }

    showAlertBox(content) {
        let newContent = this.state.content;
        newContent.push(content);
        this.setState({
            content: newContent,
            showAlertBox: true
        })
    }

    alertBoxIsClosed(){
        let newContent = this.state.content;
        newContent.shift();
        this.setState({
            content: newContent,
        });
        if (this.state.content.length === 0)
            this.setState({ showAlertBox: false});
    }

    setTarget(id,pos){
        this.setState({idTarget: null});

        this.setState({showAlertBox: false});
        this.setState({centerMap: [pos[0],pos[1]]});
        setTimeout(this.setState({idTarget: id}), 100);
    }

    mapChanged(feature, layer){

      // if(this.state.idTarget === null) {
      //   var rows = [];
      //   rows.push(<Link to="/profilepage"><button className="confirmButton wider"> Profile Page </button></Link>);
      //   rows.push(<Link to="/captureplayer"><button className="confirmButton wider"> Capture Player </button></Link>);
      //   this.showAlertBox(rows);
      // }

      this.setState({idTarget:null});

    }

    changeMenu(event) {
        this.setState({displayMenu: !this.state.displayMenu})
    }

    handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  setZoom(){
    var zoom = this.map.leafletElement.getZoom();
    if ( zoom > 18 ){
      this.setState({zoom: 18});

    } else {
      this.setState({zoom: this.map.leafletElement.getZoom()});
    }
  }



    render() {
        return (
            <div>
            <div>
            <Modal
              isOpen={this.state.show}
              onRequestClose={this.handleClose}
              style={customStyles}>
                <Tutorial/>
            </Modal>
            <Map ref={(ref) => { this.map = ref; }} onViewportChange={()=> this.setZoom()}  style={{zIndex:0}} onClick={()=> this.mapChanged()} className="mapss" center={this.state.centerMap} zoom={this.state.zoom}>
                <TileLayer
                    //attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    //url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url='https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png'
                />
                <PopPop open={this.state.showAlertBox} closeBtn={true} closeOnEsc={true} onClose={()=>this.alertBoxIsClosed()} closeOnOverlay={true} position={"centerCenter"} contentStyle={this.state.alertBoxStyle}>
                    <div>{this.state.content[0]}</div>
                </PopPop>
                <PlayerLayer idTarget={this.state.idTarget} setTarget={this.setTarget} showAlertBox={this.showAlertBox} id={this.state.id} locationEnabled={this.state.haveUsersLocation}/>
            </Map>
            </div>
            <div>

            <Draggable style={{zIndex:1}}><div id="block2">
            <div >
                <button id="missionB" onClick={() => this.changeMenu()}></button>
            </div>
            { this.state.displayMenu ? (
            <ul>
           <li><Link to="/capturePlayer"><div id="buttonsDiv"><button id="capturePButton"></button></div></Link></li>
           <li><Link to="/profilePage"><div id="buttonsDiv"><button id="profileButton"></button></div></Link></li>
           <li><div id="buttonsDiv"><button onClick={()=>this.handleShow()} id="questionButton"></button></div></li>
           <li><Link to="/settings"><div id="buttonsDiv"><button id="settingsButton"></button></div></Link></li>

            </ul>
          ):
          (
            null
          )
        }
          </div></Draggable>
            </div>



            </div>
        )
    }
}
Trial.contextType = SocketContext;

export default Trial;
