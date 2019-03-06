import React from 'react';
import PopPop from 'react-poppop';
import { Map, TileLayer} from 'react-leaflet';
import Camera from 'react-html5-camera-photo';
import Cookies from 'universal-cookie';
import L from 'leaflet';
import { Marker,Popup } from 'react-leaflet';
import SocketContext from "../socketContext";



const cookies = new Cookies();

var myIcon = L.icon({
    iconUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIKdmlld0JveD0iMCAwIDIyNCAyMjQiCnN0eWxlPSIgZmlsbDojMDAwMDAwOyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJub256ZXJvIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLWRhc2hhcnJheT0iIiBzdHJva2UtZGFzaG9mZnNldD0iMCIgZm9udC1mYW1pbHk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub25lIiBmb250LXNpemU9Im5vbmUiIHRleHQtYW5jaG9yPSJub25lIiBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6IG5vcm1hbCI+PHBhdGggZD0iTTAsMjI0di0yMjRoMjI0djIyNHoiIGZpbGw9Im5vbmUiPjwvcGF0aD48ZyBmaWxsPSIjYmIxZDBjIj48cGF0aCBkPSJNMTg4LjEzMzc1LDQuNDcxMjVjLTAuODA2NCwwLjAwNTYgLTEuNjA2ODUsMC4yMzQ1IC0yLjMwMTI1LDAuNjgyNWMtMC40NDgsMC4yNjg4IC0yLjU1NjA1LDEuNTY2MjUgLTUuODcxMjUsMy44MDYyNWMwLDAgLTAuMjI1NzUsMC4xNzc0NSAtMC42NzM3NSwwLjQ0NjI1Yy02LjAwMzIsNC40OCAtNTAuMjYzNSwzOC4xMjY1NSAtNjIuODA3NSw3NS43MTM3NWwyMi40LC00LjQ4YzAsMCAtNDEuODg2NiwzNy42NzM2NSAtNTYuODA1LDEwMC45MzEyNWMwLC0wLjA0NDggLTEuOTk1LDguODMwMTUgLTIuNTU1LDE0Ljc0Mzc1YzAuNzYxNiwxLjc0NzIgMS41MjMyLDMuNTM0NjUgMi4yNCw1LjQxNjI1YzAuMDQ0OCwwLjEzNDQgMi41MDQ2LDYuNzE4OTUgMy41MzUsMTAuMTIzNzVjMC41ODI0LDEuODgxNiAyLjMzMzgsMy4xODUgNC4zMDUsMy4xODVoNDQuOGMxLjk3MTIsMCAzLjcyMjYsLTEuMzAzNCA0LjMwNSwtMy4xODVjMTYuODQ0OCwtNTQuNzkwNCA1My40MDA1NSwtNjMuNzg4OSA1NC45MjM3NSwtNjQuMTAyNWMxLjM4ODgsLTAuMzEzNiAyLjU1MDEsLTEuMjk4NSAzLjEzMjUsLTIuNjQyNWwxMy40NCwtMzEuMzZjMC42MjcyLC0xLjQzMzYgMC40NTA4LC0zLjA5NDM1IC0wLjQ5LC00LjM0ODc1bC0yMS40NjM3NSwtMzAuMDU2MjVsNC4zOTI1LC03MC4xMTM3NWMwLjA4OTYsLTEuNjU3NiAtMC43NjI2NSwtMy4yNzAwNSAtMi4xOTYyNSwtNC4xMjEyNWMtMC42OTQ0LC0wLjQyNTYgLTEuNTAzNiwtMC42NDQzNSAtMi4zMSwtMC42Mzg3NXpNMzUuMTc1LDQuNTMyNWMtMC40MzI2LDAuMDY1MSAtMC44NTY4LDAuMTkyMTUgLTEuMjYsMC4zOTM3NWMtMS42NTc2LDAuNzYxNiAtMi42NDQ2LDIuNTEzIC0yLjU1NSw0LjMwNWw0LjM5MjUsNzAuMTEzNzVsLTIxLjQ2Mzc1LDMwLjA1NjI1Yy0wLjk0MDgsMS4yNTQ0IC0xLjExNzIsMi45MTUxNSAtMC40OSw0LjM0ODc1bDEzLjQ0LDMxLjM2YzAuNTgyNCwxLjM0NCAxLjc0MzcsMi4zMjg5IDMuMTMyNSwyLjY0MjVjMC4xMzQ0LDAuMDQ0OCA1LjIwMzQ1LDEuMjA1MDUgMTIuNDE2MjUsNS40MTYyNWMwLjI2ODgsMC4xMzQ0IDYuOTM2NjUsNC4zOTYzNSAxMC4zODYyNSw3LjIxODc1bDEuNjYyNSwtMTAuMDM2MjVsMy40MDM3NSwtMjAuNDMxMjVoLTEzLjQ0YzcuNDgxNiwtMzguMzkzNiAzMy4yMzg0NSwtNjkuNjE2NCA0Mi42OTEyNSwtODAuMDFsLTQ4LjY1LC00NC4yNjYyNWMtMS4wMDgsLTAuOTA3MiAtMi4zNjg0NSwtMS4zMDY1NSAtMy42NjYyNSwtMS4xMTEyNXpNNjIuNzIsMTAzLjA0YzAsMCAzLjk4NTU5LDIyLjQgMTUuOTMzNzUsMjIuNGgxOS45MDYyNXpNMTYxLjI4LDEwMy4wNGMwLDAgLTMuOTg5NjUsMjIuNCAtMTUuOTUxMjUsMjIuNGgtMTkuODg4NzV6TTk0LjA4LDE2NS43NmgzNS44NGwtMTcuOTIsMjYuODh6Ij48L3BhdGg+PC9nPjwvZz48L3N2Zz4=",
    //shadowUrl: 'leaf-shadow.png',

    iconSize:     [70, 70], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [35, 35], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [0, -30] // point from which the popup should open relative to the iconAnchor
});


var targetIcon = L.icon({
    iconUrl: "https://img.icons8.com/material/24/000000/point-of-interest.png",
    //shadowUrl: 'leaf-shadow.png',

    iconSize:     [70, 70], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [35, 35], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [0, -30] // point from which the popup should open relative to the iconAnchor
});



class Minigame extends React.Component {


  constructor(props){
      super(props);
      this.setCenter = this.setCenter.bind(this);
      this.showAlertBox = this.showAlertBox.bind(this);
      this.sendPhoto = this.sendPhoto.bind(this);
      this.votePhoto = this.votePhoto.bind(this);
      this.sendLocation = this.sendLocation.bind(this);
      this.alertBoxIsClosed = this.alertBoxIsClosed.bind(this);
  }

  state = {
      location: {
          lat: 50.8632811,
          lng: 4.6762872,
      },
      zoom: 14,
      centerMap: [50.8632811, 4.6762872],
      showAlertBox: false,
      content: "Please allow access to your location.",
      targetLocation: [30.8632811, 4.6762872],
      encodedPic: require("../assets/icons/user.png")
  }

  componentDidMount(){

    this.context.on("mission", (data) => {

        this.setState({targetLocation: data.location})

    });
    this.context.on("missionPhoto", (data) => {
      // see profile page
      this.setState({
          encodedPic: data.image
      });
      var content = [];
      content.push(<img src={this.state.encodedPic}/>);
      content.push(<button onClick={this.votePhoto.bind(this,true)}>Yes</button>);
      content.push(<button onClick={this.votePhoto.bind(this,false)}>False</button>);
      this.showAlertBox(content);
    })
  }

  componentWillMount() {
      this.context.emit("mission",{token:cookies.get('token')});

      this.interval = setInterval(() => {
            this.sendLocation();
            this.setCenter([this.state.location.lat, this.state.location.lng]);
      }, 500);
  }

  sendLocation() {
      navigator.geolocation.getCurrentPosition((position) => {
          this.setState({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: Math.round(position.coords.accuracy),
          });

          this.context.emit("location", {
              token: cookies.get('token'),
              longitude: this.state.longitude,
              latitude: this.state.latitude,
              accuracy: this.state.accuracy,
          })
      });
  }

  votePhoto(vote){
    this.context.emit("votePhoto",{token: cookies.get('token'), vote: vote});
  }

  setCenter(pos){
      if(pos===null){
          this.setState({centerMap: pos});
      }
  }

  mapChanged(feature, layer){
    if(this.state.showAlertBox === false) {
      var rows = [];
      rows.push(
        <Camera
            onTakePhoto = { (dataUri) => { this.sendPhoto(dataUri); } }
            isImageMirror = {true}
            imageType = {'IMAGE_TYPES.PNG'}
            imageCompression = {0.97}
        />
      );
      this.showAlertBox(rows);
  }
  }

  sendPhoto(dataUri){
    this.context.emit("missionPhoto", {token: cookies.get('token'), photo: dataUri} );
    this.setState({showAlertBox: false});
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

    return(
      <Map onClick={()=> this.mapChanged()} className="mapss" center={this.state.centerMap} zoom={this.state.zoom}>
          <TileLayer
              //attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              //url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url='https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png'
          />
          <Marker position={this.state.centerMap} icon={myIcon}/>
          <Marker position={this.state.targetLocation} icon={targetIcon}/>
          <PopPop open={this.state.showAlertBox} closeBtn={true} closeOnEsc={true} onClose={()=>this.alertBoxIsClosed()} closeOnOverlay={true} position={"topCenter"} contentStyle={this.state.alertBoxStyle}>
              <div>{this.state.content}</div>
          </PopPop>
      </Map>);
  }
}
Minigame.contextType = SocketContext;
export default Minigame;
