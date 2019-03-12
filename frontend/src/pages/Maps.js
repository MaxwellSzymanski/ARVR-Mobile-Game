import React from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import '../App.css';
import L from 'leaflet';


//Gebruik dit voor je eigen icon
var myIcon = L.icon({
    iconUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIKdmlld0JveD0iMCAwIDIyNCAyMjQiCnN0eWxlPSIgZmlsbDojMDAwMDAwOyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJub256ZXJvIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLWRhc2hhcnJheT0iIiBzdHJva2UtZGFzaG9mZnNldD0iMCIgZm9udC1mYW1pbHk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub25lIiBmb250LXNpemU9Im5vbmUiIHRleHQtYW5jaG9yPSJub25lIiBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6IG5vcm1hbCI+PHBhdGggZD0iTTAsMjI0di0yMjRoMjI0djIyNHoiIGZpbGw9Im5vbmUiPjwvcGF0aD48ZyBmaWxsPSIjYmIxZDBjIj48cGF0aCBkPSJNMTg4LjEzMzc1LDQuNDcxMjVjLTAuODA2NCwwLjAwNTYgLTEuNjA2ODUsMC4yMzQ1IC0yLjMwMTI1LDAuNjgyNWMtMC40NDgsMC4yNjg4IC0yLjU1NjA1LDEuNTY2MjUgLTUuODcxMjUsMy44MDYyNWMwLDAgLTAuMjI1NzUsMC4xNzc0NSAtMC42NzM3NSwwLjQ0NjI1Yy02LjAwMzIsNC40OCAtNTAuMjYzNSwzOC4xMjY1NSAtNjIuODA3NSw3NS43MTM3NWwyMi40LC00LjQ4YzAsMCAtNDEuODg2NiwzNy42NzM2NSAtNTYuODA1LDEwMC45MzEyNWMwLC0wLjA0NDggLTEuOTk1LDguODMwMTUgLTIuNTU1LDE0Ljc0Mzc1YzAuNzYxNiwxLjc0NzIgMS41MjMyLDMuNTM0NjUgMi4yNCw1LjQxNjI1YzAuMDQ0OCwwLjEzNDQgMi41MDQ2LDYuNzE4OTUgMy41MzUsMTAuMTIzNzVjMC41ODI0LDEuODgxNiAyLjMzMzgsMy4xODUgNC4zMDUsMy4xODVoNDQuOGMxLjk3MTIsMCAzLjcyMjYsLTEuMzAzNCA0LjMwNSwtMy4xODVjMTYuODQ0OCwtNTQuNzkwNCA1My40MDA1NSwtNjMuNzg4OSA1NC45MjM3NSwtNjQuMTAyNWMxLjM4ODgsLTAuMzEzNiAyLjU1MDEsLTEuMjk4NSAzLjEzMjUsLTIuNjQyNWwxMy40NCwtMzEuMzZjMC42MjcyLC0xLjQzMzYgMC40NTA4LC0zLjA5NDM1IC0wLjQ5LC00LjM0ODc1bC0yMS40NjM3NSwtMzAuMDU2MjVsNC4zOTI1LC03MC4xMTM3NWMwLjA4OTYsLTEuNjU3NiAtMC43NjI2NSwtMy4yNzAwNSAtMi4xOTYyNSwtNC4xMjEyNWMtMC42OTQ0LC0wLjQyNTYgLTEuNTAzNiwtMC42NDQzNSAtMi4zMSwtMC42Mzg3NXpNMzUuMTc1LDQuNTMyNWMtMC40MzI2LDAuMDY1MSAtMC44NTY4LDAuMTkyMTUgLTEuMjYsMC4zOTM3NWMtMS42NTc2LDAuNzYxNiAtMi42NDQ2LDIuNTEzIC0yLjU1NSw0LjMwNWw0LjM5MjUsNzAuMTEzNzVsLTIxLjQ2Mzc1LDMwLjA1NjI1Yy0wLjk0MDgsMS4yNTQ0IC0xLjExNzIsMi45MTUxNSAtMC40OSw0LjM0ODc1bDEzLjQ0LDMxLjM2YzAuNTgyNCwxLjM0NCAxLjc0MzcsMi4zMjg5IDMuMTMyNSwyLjY0MjVjMC4xMzQ0LDAuMDQ0OCA1LjIwMzQ1LDEuMjA1MDUgMTIuNDE2MjUsNS40MTYyNWMwLjI2ODgsMC4xMzQ0IDYuOTM2NjUsNC4zOTYzNSAxMC4zODYyNSw3LjIxODc1bDEuNjYyNSwtMTAuMDM2MjVsMy40MDM3NSwtMjAuNDMxMjVoLTEzLjQ0YzcuNDgxNiwtMzguMzkzNiAzMy4yMzg0NSwtNjkuNjE2NCA0Mi42OTEyNSwtODAuMDFsLTQ4LjY1LC00NC4yNjYyNWMtMS4wMDgsLTAuOTA3MiAtMi4zNjg0NSwtMS4zMDY1NSAtMy42NjYyNSwtMS4xMTEyNXpNNjIuNzIsMTAzLjA0YzAsMCAzLjk4NTU5LDIyLjQgMTUuOTMzNzUsMjIuNGgxOS45MDYyNXpNMTYxLjI4LDEwMy4wNGMwLDAgLTMuOTg5NjUsMjIuNCAtMTUuOTUxMjUsMjIuNGgtMTkuODg4NzV6TTk0LjA4LDE2NS43NmgzNS44NGwtMTcuOTIsMjYuODh6Ij48L3BhdGg+PC9nPjwvZz48L3N2Zz4=",
    //shadowUrl: 'leaf-shadow.png',

    iconSize:     [90, 90], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

//zwarte wolf voor de enemies die online zijn
var enemyOnline = L.icon({
    iconUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIKdmlld0JveD0iMCAwIDUwIDUwIgpzdHlsZT0iIGZpbGw6IzAwMDAwMDsiPiAgICA8cGF0aCBkPSJNIDQxLjk5NDE0MSAwLjk5ODA0Njg4IEMgNDEuODE0MTQxIDAuOTk5Mjk2ODcgNDEuNjM1NDY5IDEuMDUwMzkwNiA0MS40ODA0NjkgMS4xNTAzOTA2IEMgNDEuMzgwNDY5IDEuMjEwMzkwNiA0MC45MDk5MjIgMS41IDQwLjE2OTkyMiAyIEMgNDAuMTY5OTIyIDIgNDAuMTE5NTMxIDIuMDM5NjA5NCA0MC4wMTk1MzEgMi4wOTk2MDk0IEMgMzguNjc5NTMxIDMuMDk5NjA5NCAyOC44IDEwLjYxIDI2IDE5IEwgMzEgMTggQyAzMSAxOCAyMS42NTAzMTMgMjYuNDA5Mjk3IDE4LjMyMDMxMiA0MC41MjkyOTcgQyAxOC4zMjAzMTIgNDAuNTE5Mjk3IDE3Ljg3NSA0Mi41MDAzMTMgMTcuNzUgNDMuODIwMzEyIEMgMTcuOTIgNDQuMjEwMzEzIDE4LjA5IDQ0LjYwOTI5NyAxOC4yNSA0NS4wMjkyOTcgQyAxOC4yNiA0NS4wNTkyOTcgMTguODA5MDYzIDQ2LjUyOTA2MyAxOS4wMzkwNjIgNDcuMjg5MDYyIEMgMTkuMTY5MDYzIDQ3LjcwOTA2MyAxOS41NiA0OCAyMCA0OCBMIDMwIDQ4IEMgMzAuNDQgNDggMzAuODMwOTM4IDQ3LjcwOTA2MyAzMC45NjA5MzggNDcuMjg5MDYyIEMgMzQuNzIwOTM3IDM1LjA1OTA2MyA0Mi44ODA3MDMgMzMuMDUwNDY5IDQzLjIyMDcwMyAzMi45ODA0NjkgQyA0My41MzA3MDMgMzIuOTEwNDY5IDQzLjc4OTkyMiAzMi42OTA2MjUgNDMuOTE5OTIyIDMyLjM5MDYyNSBMIDQ2LjkxOTkyMiAyNS4zOTA2MjUgQyA0Ny4wNTk5MjIgMjUuMDcwNjI1IDQ3LjAyMDU0NyAyNC42OTk5MjIgNDYuODEwNTQ3IDI0LjQxOTkyMiBMIDQyLjAxOTUzMSAxNy43MTA5MzggTCA0MyAyLjA2MDU0NjkgQyA0My4wMiAxLjY5MDU0NjkgNDIuODI5NzY2IDEuMzMwNjI1IDQyLjUwOTc2NiAxLjE0MDYyNSBDIDQyLjM1NDc2NiAxLjA0NTYyNSA0Mi4xNzQxNDEgMC45OTY3OTY4OCA0MS45OTQxNDEgMC45OTgwNDY4OCB6IE0gNy44NTE1NjI1IDEuMDExNzE4OCBDIDcuNzU1IDEuMDI2MjUgNy42NjAzMTI1IDEuMDU0NjA5NCA3LjU3MDMxMjUgMS4wOTk2MDk0IEMgNy4yMDAzMTI1IDEuMjY5NjA5NCA2Ljk4IDEuNjYwNTQ2OSA3IDIuMDYwNTQ2OSBMIDcuOTgwNDY4OCAxNy43MTA5MzggTCAzLjE4OTQ1MzEgMjQuNDE5OTIyIEMgMi45Nzk0NTMxIDI0LjY5OTkyMiAyLjk0MDA3ODEgMjUuMDcwNjI1IDMuMDgwMDc4MSAyNS4zOTA2MjUgTCA2LjA4MDA3ODEgMzIuMzkwNjI1IEMgNi4yMTAwNzgxIDMyLjY5MDYyNSA2LjQ2OTI5NjkgMzIuOTEwNDY5IDYuNzc5Mjk2OSAzMi45ODA0NjkgQyA2LjgwOTI5NjkgMzIuOTkwNDY5IDcuOTQwNzgxMiAzMy4yNDk0NTMgOS41NTA3ODEyIDM0LjE4OTQ1MyBDIDkuNjEwNzgxMyAzNC4yMTk0NTMgMTEuMDk5MTQxIDM1LjE3MDc4MSAxMS44NjkxNDEgMzUuODAwNzgxIEwgMTIuMjQwMjM0IDMzLjU2MDU0NyBMIDEzIDI5IEwgMTAgMjkgQyAxMS42NyAyMC40MyAxNy40MTkyOTcgMTMuNDYwNjI1IDE5LjUyOTI5NyAxMS4xNDA2MjUgTCA4LjY2OTkyMTkgMS4yNTk3NjU2IEMgOC40NDQ5MjE5IDEuMDU3MjY1NiA4LjE0MTI1IDAuOTY4MTI1IDcuODUxNTYyNSAxLjAxMTcxODggeiBNIDE0IDIzIEMgMTQgMjMgMTQuODg5NjQxIDI4IDE3LjU1NjY0MSAyOCBMIDIyIDI4IEwgMTQgMjMgeiBNIDM2IDIzIEMgMzYgMjMgMzUuMTA5NDUzIDI4IDMyLjQzOTQ1MyAyOCBMIDI4IDI4IEwgMzYgMjMgeiBNIDIxIDM3IEwgMjkgMzcgTCAyNSA0MyBMIDIxIDM3IHoiPjwvcGF0aD48L3N2Zz4=",
    //shadowUrl: 'leaf-shadow.png',

    iconSize:     [90, 90], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

//grijze wolf voor de enemies die offline zijn
var enemyOffline = L.icon({
    iconUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iNTAiIGhlaWdodD0iNTAiCnZpZXdCb3g9IjAgMCAyMjQgMjI0IgpzdHlsZT0iIGZpbGw6IzAwMDAwMDsiPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIGZvbnQtZmFtaWx5PSJub25lIiBmb250LXdlaWdodD0ibm9uZSIgZm9udC1zaXplPSJub25lIiB0ZXh0LWFuY2hvcj0ibm9uZSIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxwYXRoIGQ9Ik0wLDIyNHYtMjI0aDIyNHYyMjR6IiBmaWxsPSJub25lIj48L3BhdGg+PGcgZmlsbD0iI2NjY2NjYyI+PHBhdGggZD0iTTE4OC4xMzM3NSw0LjQ3MTI1Yy0wLjgwNjQsMC4wMDU2IC0xLjYwNjg1LDAuMjM0NSAtMi4zMDEyNSwwLjY4MjVjLTAuNDQ4LDAuMjY4OCAtMi41NTYwNSwxLjU2NjI1IC01Ljg3MTI1LDMuODA2MjVjMCwwIC0wLjIyNTc1LDAuMTc3NDUgLTAuNjczNzUsMC40NDYyNWMtNi4wMDMyLDQuNDggLTUwLjI2MzUsMzguMTI2NTUgLTYyLjgwNzUsNzUuNzEzNzVsMjIuNCwtNC40OGMwLDAgLTQxLjg4NjYsMzcuNjczNjUgLTU2LjgwNSwxMDAuOTMxMjVjMCwtMC4wNDQ4IC0xLjk5NSw4LjgzMDE1IC0yLjU1NSwxNC43NDM3NWMwLjc2MTYsMS43NDcyIDEuNTIzMiwzLjUzNDY1IDIuMjQsNS40MTYyNWMwLjA0NDgsMC4xMzQ0IDIuNTA0Niw2LjcxODk1IDMuNTM1LDEwLjEyMzc1YzAuNTgyNCwxLjg4MTYgMi4zMzM4LDMuMTg1IDQuMzA1LDMuMTg1aDQ0LjhjMS45NzEyLDAgMy43MjI2LC0xLjMwMzQgNC4zMDUsLTMuMTg1YzE2Ljg0NDgsLTU0Ljc5MDQgNTMuNDAwNTUsLTYzLjc4ODkgNTQuOTIzNzUsLTY0LjEwMjVjMS4zODg4LC0wLjMxMzYgMi41NTAxLC0xLjI5ODUgMy4xMzI1LC0yLjY0MjVsMTMuNDQsLTMxLjM2YzAuNjI3MiwtMS40MzM2IDAuNDUwOCwtMy4wOTQzNSAtMC40OSwtNC4zNDg3NWwtMjEuNDYzNzUsLTMwLjA1NjI1bDQuMzkyNSwtNzAuMTEzNzVjMC4wODk2LC0xLjY1NzYgLTAuNzYyNjUsLTMuMjcwMDUgLTIuMTk2MjUsLTQuMTIxMjVjLTAuNjk0NCwtMC40MjU2IC0xLjUwMzYsLTAuNjQ0MzUgLTIuMzEsLTAuNjM4NzV6TTM1LjE3NSw0LjUzMjVjLTAuNDMyNiwwLjA2NTEgLTAuODU2OCwwLjE5MjE1IC0xLjI2LDAuMzkzNzVjLTEuNjU3NiwwLjc2MTYgLTIuNjQ0NiwyLjUxMyAtMi41NTUsNC4zMDVsNC4zOTI1LDcwLjExMzc1bC0yMS40NjM3NSwzMC4wNTYyNWMtMC45NDA4LDEuMjU0NCAtMS4xMTcyLDIuOTE1MTUgLTAuNDksNC4zNDg3NWwxMy40NCwzMS4zNmMwLjU4MjQsMS4zNDQgMS43NDM3LDIuMzI4OSAzLjEzMjUsMi42NDI1YzAuMTM0NCwwLjA0NDggNS4yMDM0NSwxLjIwNTA1IDEyLjQxNjI1LDUuNDE2MjVjMC4yNjg4LDAuMTM0NCA2LjkzNjY1LDQuMzk2MzUgMTAuMzg2MjUsNy4yMTg3NWwxLjY2MjUsLTEwLjAzNjI1bDMuNDAzNzUsLTIwLjQzMTI1aC0xMy40NGM3LjQ4MTYsLTM4LjM5MzYgMzMuMjM4NDUsLTY5LjYxNjQgNDIuNjkxMjUsLTgwLjAxbC00OC42NSwtNDQuMjY2MjVjLTEuMDA4LC0wLjkwNzIgLTIuMzY4NDUsLTEuMzA2NTUgLTMuNjY2MjUsLTEuMTExMjV6TTYyLjcyLDEwMy4wNGMwLDAgMy45ODU1OSwyMi40IDE1LjkzMzc1LDIyLjRoMTkuOTA2MjV6TTE2MS4yOCwxMDMuMDRjMCwwIC0zLjk4OTY1LDIyLjQgLTE1Ljk1MTI1LDIyLjRoLTE5Ljg4ODc1ek05NC4wOCwxNjUuNzZoMzUuODRsLTE3LjkyLDI2Ljg4eiI+PC9wYXRoPjwvZz48L2c+PC9zdmc+",
    //shadowUrl: 'leaf-shadow.png',

    iconSize:     [90, 90], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});





class Maps extends React.Component {

  //dit is gwn een standaard setting, van af blijven
  state = {
    location: {
      lat: 50.8632811,
      lng: 4.6762872,
    },
    zoom: 3,
  }

  //hier krijgen we de locatie van de mainuser door, en wordt de 'myIcon' op die locatie gezet
  componentDidMount() {
    navigator.geolocation.getCurrentPosition((position) =>
    { this.setState({
      location: {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      },
      haveUsersLocation: true,
      zoom: 18,
    })
  });
  }

  render() {
      const position = [this.state.location.lat, this.state.location.lng]
      return (
        <div>
        <div id="block2">
          <p>Hallo</p>
        </div>
        <div>
        <Map id='map' className="trial" center={position} zoom={this.state.zoom}>
          <TileLayer
            //attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            //url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url='https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png'
          />

          {this.state.haveUsersLocation ?
            <Marker position={position} icon={myIcon}>
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker> : ''
          }
        </Map></div>


        </div>
      )
    }

}

export default Maps;
