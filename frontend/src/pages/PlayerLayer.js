import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import '../App.css';
import L from 'leaflet';
import Cookies from 'universal-cookie';
import SocketContext from "../socketContext";

const cookies = new Cookies();

var target = L.icon({
    iconUrl:"https://image.flaticon.com/icons/png/512/41/41947.png"
    ,

    //shadowUrl: 'leaf-shadow.png',

    iconSize:     [180, 180], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [90, 90], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [0, -30] // point from which the popup should open relative to the iconAnchor
});

var myIcon = L.icon({
    iconUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIKdmlld0JveD0iMCAwIDIyNCAyMjQiCnN0eWxlPSIgZmlsbDojMDAwMDAwOyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJub256ZXJvIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLWRhc2hhcnJheT0iIiBzdHJva2UtZGFzaG9mZnNldD0iMCIgZm9udC1mYW1pbHk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub25lIiBmb250LXNpemU9Im5vbmUiIHRleHQtYW5jaG9yPSJub25lIiBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6IG5vcm1hbCI+PHBhdGggZD0iTTAsMjI0di0yMjRoMjI0djIyNHoiIGZpbGw9Im5vbmUiPjwvcGF0aD48ZyBmaWxsPSIjYmIxZDBjIj48cGF0aCBkPSJNMTg4LjEzMzc1LDQuNDcxMjVjLTAuODA2NCwwLjAwNTYgLTEuNjA2ODUsMC4yMzQ1IC0yLjMwMTI1LDAuNjgyNWMtMC40NDgsMC4yNjg4IC0yLjU1NjA1LDEuNTY2MjUgLTUuODcxMjUsMy44MDYyNWMwLDAgLTAuMjI1NzUsMC4xNzc0NSAtMC42NzM3NSwwLjQ0NjI1Yy02LjAwMzIsNC40OCAtNTAuMjYzNSwzOC4xMjY1NSAtNjIuODA3NSw3NS43MTM3NWwyMi40LC00LjQ4YzAsMCAtNDEuODg2NiwzNy42NzM2NSAtNTYuODA1LDEwMC45MzEyNWMwLC0wLjA0NDggLTEuOTk1LDguODMwMTUgLTIuNTU1LDE0Ljc0Mzc1YzAuNzYxNiwxLjc0NzIgMS41MjMyLDMuNTM0NjUgMi4yNCw1LjQxNjI1YzAuMDQ0OCwwLjEzNDQgMi41MDQ2LDYuNzE4OTUgMy41MzUsMTAuMTIzNzVjMC41ODI0LDEuODgxNiAyLjMzMzgsMy4xODUgNC4zMDUsMy4xODVoNDQuOGMxLjk3MTIsMCAzLjcyMjYsLTEuMzAzNCA0LjMwNSwtMy4xODVjMTYuODQ0OCwtNTQuNzkwNCA1My40MDA1NSwtNjMuNzg4OSA1NC45MjM3NSwtNjQuMTAyNWMxLjM4ODgsLTAuMzEzNiAyLjU1MDEsLTEuMjk4NSAzLjEzMjUsLTIuNjQyNWwxMy40NCwtMzEuMzZjMC42MjcyLC0xLjQzMzYgMC40NTA4LC0zLjA5NDM1IC0wLjQ5LC00LjM0ODc1bC0yMS40NjM3NSwtMzAuMDU2MjVsNC4zOTI1LC03MC4xMTM3NWMwLjA4OTYsLTEuNjU3NiAtMC43NjI2NSwtMy4yNzAwNSAtMi4xOTYyNSwtNC4xMjEyNWMtMC42OTQ0LC0wLjQyNTYgLTEuNTAzNiwtMC42NDQzNSAtMi4zMSwtMC42Mzg3NXpNMzUuMTc1LDQuNTMyNWMtMC40MzI2LDAuMDY1MSAtMC44NTY4LDAuMTkyMTUgLTEuMjYsMC4zOTM3NWMtMS42NTc2LDAuNzYxNiAtMi42NDQ2LDIuNTEzIC0yLjU1NSw0LjMwNWw0LjM5MjUsNzAuMTEzNzVsLTIxLjQ2Mzc1LDMwLjA1NjI1Yy0wLjk0MDgsMS4yNTQ0IC0xLjExNzIsMi45MTUxNSAtMC40OSw0LjM0ODc1bDEzLjQ0LDMxLjM2YzAuNTgyNCwxLjM0NCAxLjc0MzcsMi4zMjg5IDMuMTMyNSwyLjY0MjVjMC4xMzQ0LDAuMDQ0OCA1LjIwMzQ1LDEuMjA1MDUgMTIuNDE2MjUsNS40MTYyNWMwLjI2ODgsMC4xMzQ0IDYuOTM2NjUsNC4zOTYzNSAxMC4zODYyNSw3LjIxODc1bDEuNjYyNSwtMTAuMDM2MjVsMy40MDM3NSwtMjAuNDMxMjVoLTEzLjQ0YzcuNDgxNiwtMzguMzkzNiAzMy4yMzg0NSwtNjkuNjE2NCA0Mi42OTEyNSwtODAuMDFsLTQ4LjY1LC00NC4yNjYyNWMtMS4wMDgsLTAuOTA3MiAtMi4zNjg0NSwtMS4zMDY1NSAtMy42NjYyNSwtMS4xMTEyNXpNNjIuNzIsMTAzLjA0YzAsMCAzLjk4NTU5LDIyLjQgMTUuOTMzNzUsMjIuNGgxOS45MDYyNXpNMTYxLjI4LDEwMy4wNGMwLDAgLTMuOTg5NjUsMjIuNCAtMTUuOTUxMjUsMjIuNGgtMTkuODg4NzV6TTk0LjA4LDE2NS43NmgzNS44NGwtMTcuOTIsMjYuODh6Ij48L3BhdGg+PC9nPjwvZz48L3N2Zz4=",
    //shadowUrl: 'leaf-shadow.png',

    iconSize:     [70, 70], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [35, 35], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [0, -30] // point from which the popup should open relative to the iconAnchor
});

//zwarte wolf voor de enemies die online zijn
var enemyOnline = L.icon({
    iconUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIKdmlld0JveD0iMCAwIDUwIDUwIgpzdHlsZT0iIGZpbGw6IzAwMDAwMDsiPiAgICA8cGF0aCBkPSJNIDQxLjk5NDE0MSAwLjk5ODA0Njg4IEMgNDEuODE0MTQxIDAuOTk5Mjk2ODcgNDEuNjM1NDY5IDEuMDUwMzkwNiA0MS40ODA0NjkgMS4xNTAzOTA2IEMgNDEuMzgwNDY5IDEuMjEwMzkwNiA0MC45MDk5MjIgMS41IDQwLjE2OTkyMiAyIEMgNDAuMTY5OTIyIDIgNDAuMTE5NTMxIDIuMDM5NjA5NCA0MC4wMTk1MzEgMi4wOTk2MDk0IEMgMzguNjc5NTMxIDMuMDk5NjA5NCAyOC44IDEwLjYxIDI2IDE5IEwgMzEgMTggQyAzMSAxOCAyMS42NTAzMTMgMjYuNDA5Mjk3IDE4LjMyMDMxMiA0MC41MjkyOTcgQyAxOC4zMjAzMTIgNDAuNTE5Mjk3IDE3Ljg3NSA0Mi41MDAzMTMgMTcuNzUgNDMuODIwMzEyIEMgMTcuOTIgNDQuMjEwMzEzIDE4LjA5IDQ0LjYwOTI5NyAxOC4yNSA0NS4wMjkyOTcgQyAxOC4yNiA0NS4wNTkyOTcgMTguODA5MDYzIDQ2LjUyOTA2MyAxOS4wMzkwNjIgNDcuMjg5MDYyIEMgMTkuMTY5MDYzIDQ3LjcwOTA2MyAxOS41NiA0OCAyMCA0OCBMIDMwIDQ4IEMgMzAuNDQgNDggMzAuODMwOTM4IDQ3LjcwOTA2MyAzMC45NjA5MzggNDcuMjg5MDYyIEMgMzQuNzIwOTM3IDM1LjA1OTA2MyA0Mi44ODA3MDMgMzMuMDUwNDY5IDQzLjIyMDcwMyAzMi45ODA0NjkgQyA0My41MzA3MDMgMzIuOTEwNDY5IDQzLjc4OTkyMiAzMi42OTA2MjUgNDMuOTE5OTIyIDMyLjM5MDYyNSBMIDQ2LjkxOTkyMiAyNS4zOTA2MjUgQyA0Ny4wNTk5MjIgMjUuMDcwNjI1IDQ3LjAyMDU0NyAyNC42OTk5MjIgNDYuODEwNTQ3IDI0LjQxOTkyMiBMIDQyLjAxOTUzMSAxNy43MTA5MzggTCA0MyAyLjA2MDU0NjkgQyA0My4wMiAxLjY5MDU0NjkgNDIuODI5NzY2IDEuMzMwNjI1IDQyLjUwOTc2NiAxLjE0MDYyNSBDIDQyLjM1NDc2NiAxLjA0NTYyNSA0Mi4xNzQxNDEgMC45OTY3OTY4OCA0MS45OTQxNDEgMC45OTgwNDY4OCB6IE0gNy44NTE1NjI1IDEuMDExNzE4OCBDIDcuNzU1IDEuMDI2MjUgNy42NjAzMTI1IDEuMDU0NjA5NCA3LjU3MDMxMjUgMS4wOTk2MDk0IEMgNy4yMDAzMTI1IDEuMjY5NjA5NCA2Ljk4IDEuNjYwNTQ2OSA3IDIuMDYwNTQ2OSBMIDcuOTgwNDY4OCAxNy43MTA5MzggTCAzLjE4OTQ1MzEgMjQuNDE5OTIyIEMgMi45Nzk0NTMxIDI0LjY5OTkyMiAyLjk0MDA3ODEgMjUuMDcwNjI1IDMuMDgwMDc4MSAyNS4zOTA2MjUgTCA2LjA4MDA3ODEgMzIuMzkwNjI1IEMgNi4yMTAwNzgxIDMyLjY5MDYyNSA2LjQ2OTI5NjkgMzIuOTEwNDY5IDYuNzc5Mjk2OSAzMi45ODA0NjkgQyA2LjgwOTI5NjkgMzIuOTkwNDY5IDcuOTQwNzgxMiAzMy4yNDk0NTMgOS41NTA3ODEyIDM0LjE4OTQ1MyBDIDkuNjEwNzgxMyAzNC4yMTk0NTMgMTEuMDk5MTQxIDM1LjE3MDc4MSAxMS44NjkxNDEgMzUuODAwNzgxIEwgMTIuMjQwMjM0IDMzLjU2MDU0NyBMIDEzIDI5IEwgMTAgMjkgQyAxMS42NyAyMC40MyAxNy40MTkyOTcgMTMuNDYwNjI1IDE5LjUyOTI5NyAxMS4xNDA2MjUgTCA4LjY2OTkyMTkgMS4yNTk3NjU2IEMgOC40NDQ5MjE5IDEuMDU3MjY1NiA4LjE0MTI1IDAuOTY4MTI1IDcuODUxNTYyNSAxLjAxMTcxODggeiBNIDE0IDIzIEMgMTQgMjMgMTQuODg5NjQxIDI4IDE3LjU1NjY0MSAyOCBMIDIyIDI4IEwgMTQgMjMgeiBNIDM2IDIzIEMgMzYgMjMgMzUuMTA5NDUzIDI4IDMyLjQzOTQ1MyAyOCBMIDI4IDI4IEwgMzYgMjMgeiBNIDIxIDM3IEwgMjkgMzcgTCAyNSA0MyBMIDIxIDM3IHoiPjwvcGF0aD48L3N2Zz4=",
    //shadowUrl: 'leaf-shadow.png',

    iconSize:     [70, 70], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [35, 35], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [0, -30] // point from which the popup should open relative to the iconAnchor
});

//grijze wolf voor de enemies die offline zijn
var enemyOffline = L.icon({
    iconUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iNTAiIGhlaWdodD0iNTAiCnZpZXdCb3g9IjAgMCAyMjQgMjI0IgpzdHlsZT0iIGZpbGw6IzAwMDAwMDsiPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIGZvbnQtZmFtaWx5PSJub25lIiBmb250LXdlaWdodD0ibm9uZSIgZm9udC1zaXplPSJub25lIiB0ZXh0LWFuY2hvcj0ibm9uZSIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxwYXRoIGQ9Ik0wLDIyNHYtMjI0aDIyNHYyMjR6IiBmaWxsPSJub25lIj48L3BhdGg+PGcgaWQ9Im9yaWdpbmFsLWljb24iIGZpbGw9IiM2NzY0NjQiPjxwYXRoIGQ9Ik0xODguMTMzNzUsNC40NzEyNWMtMC44MDY0LDAuMDA1NiAtMS42MDY4NSwwLjIzNDUgLTIuMzAxMjUsMC42ODI1Yy0wLjQ0OCwwLjI2ODggLTIuNTU2MDUsMS41NjYyNSAtNS44NzEyNSwzLjgwNjI1YzAsMCAtMC4yMjU3NSwwLjE3NzQ1IC0wLjY3Mzc1LDAuNDQ2MjVjLTYuMDAzMiw0LjQ4IC01MC4yNjM1LDM4LjEyNjU1IC02Mi44MDc1LDc1LjcxMzc1bDIyLjQsLTQuNDhjMCwwIC00MS44ODY2LDM3LjY3MzY1IC01Ni44MDUsMTAwLjkzMTI1YzAsLTAuMDQ0OCAtMS45OTUsOC44MzAxNSAtMi41NTUsMTQuNzQzNzVjMC43NjE2LDEuNzQ3MiAxLjUyMzIsMy41MzQ2NSAyLjI0LDUuNDE2MjVjMC4wNDQ4LDAuMTM0NCAyLjUwNDYsNi43MTg5NSAzLjUzNSwxMC4xMjM3NWMwLjU4MjQsMS44ODE2IDIuMzMzOCwzLjE4NSA0LjMwNSwzLjE4NWg0NC44YzEuOTcxMiwwIDMuNzIyNiwtMS4zMDM0IDQuMzA1LC0zLjE4NWMxNi44NDQ4LC01NC43OTA0IDUzLjQwMDU1LC02My43ODg5IDU0LjkyMzc1LC02NC4xMDI1YzEuMzg4OCwtMC4zMTM2IDIuNTUwMSwtMS4yOTg1IDMuMTMyNSwtMi42NDI1bDEzLjQ0LC0zMS4zNmMwLjYyNzIsLTEuNDMzNiAwLjQ1MDgsLTMuMDk0MzUgLTAuNDksLTQuMzQ4NzVsLTIxLjQ2Mzc1LC0zMC4wNTYyNWw0LjM5MjUsLTcwLjExMzc1YzAuMDg5NiwtMS42NTc2IC0wLjc2MjY1LC0zLjI3MDA1IC0yLjE5NjI1LC00LjEyMTI1Yy0wLjY5NDQsLTAuNDI1NiAtMS41MDM2LC0wLjY0NDM1IC0yLjMxLC0wLjYzODc1ek0zNS4xNzUsNC41MzI1Yy0wLjQzMjYsMC4wNjUxIC0wLjg1NjgsMC4xOTIxNSAtMS4yNiwwLjM5Mzc1Yy0xLjY1NzYsMC43NjE2IC0yLjY0NDYsMi41MTMgLTIuNTU1LDQuMzA1bDQuMzkyNSw3MC4xMTM3NWwtMjEuNDYzNzUsMzAuMDU2MjVjLTAuOTQwOCwxLjI1NDQgLTEuMTE3MiwyLjkxNTE1IC0wLjQ5LDQuMzQ4NzVsMTMuNDQsMzEuMzZjMC41ODI0LDEuMzQ0IDEuNzQzNywyLjMyODkgMy4xMzI1LDIuNjQyNWMwLjEzNDQsMC4wNDQ4IDUuMjAzNDUsMS4yMDUwNSAxMi40MTYyNSw1LjQxNjI1YzAuMjY4OCwwLjEzNDQgNi45MzY2NSw0LjM5NjM1IDEwLjM4NjI1LDcuMjE4NzVsMS42NjI1LC0xMC4wMzYyNWwzLjQwMzc1LC0yMC40MzEyNWgtMTMuNDRjNy40ODE2LC0zOC4zOTM2IDMzLjIzODQ1LC02OS42MTY0IDQyLjY5MTI1LC04MC4wMWwtNDguNjUsLTQ0LjI2NjI1Yy0xLjAwOCwtMC45MDcyIC0yLjM2ODQ1LC0xLjMwNjU1IC0zLjY2NjI1LC0xLjExMTI1ek02Mi43MiwxMDMuMDRjMCwwIDMuOTg1NTksMjIuNCAxNS45MzM3NSwyMi40aDE5LjkwNjI1ek0xNjEuMjgsMTAzLjA0YzAsMCAtMy45ODk2NSwyMi40IC0xNS45NTEyNSwyMi40aC0xOS44ODg3NXpNOTQuMDgsMTY1Ljc2aDM1Ljg0bC0xNy45MiwyNi44OHoiPjwvcGF0aD48L2c+PC9nPjwvc3ZnPg==",
    //shadowUrl: 'leaf-shadow.png',

    iconSize:     [70, 70], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [35, 35], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [0, -30] // point from which the popup should open relative to the iconAnchor
});

var pathMark = L.icon({
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Paw-print.svg/838px-Paw-print.svg.png",
    //shadowUrl: 'leaf-shadow.png',

    iconSize:     [20, 20], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [10, 10], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
});

class PlayerLayer extends React.Component {

    constructor(props) {
        super(props);
        this.state.id = props.id;
        this.state.locationEnabled = props.locationEnabled;
        this.popup = React.createRef();
    }

    state = {
        latitude: 50.8632811,
        longitude: 4.6762872,
        players: null,
        dataPlayers: null,
        playerMarkers: null,
        historyDataPlayers:JSON.stringify({}),
        targetPos:null
    };

    componentDidMount() {
        this.interval = setInterval(() => {
            this.sendLocation();
            this.addPlayerLayer();
        }, 500);

        this.context.on("playerdata", (data) => {this.receivePlayer(data)});
        this.context.on("specialsignal", (data) => {this.receiveSpecialSignal(data)});
        this.context.on("handshake", (data) => {this.acknowledgeHandshake(data)});
        this.context.on("ACKhandshake", (data) => {this.handshakeAcknowledged(data)});
        // TODO
        this.context.on("message", (data) => {this.handshakeAcknowledged(data)});
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    sendLocation() {
        navigator.geolocation.getCurrentPosition((position) => {
            this.setState({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: Math.round(position.coords.accuracy)
            });

            this.context.emit("location", {
                token: cookies.get('token'),
                longitude: this.state.longitude,
                latitude: this.state.latitude,
                accuracy: this.state.accuracy,
            })
        });
    }

    receivePlayer(data) {
        let list = this.state.dataPlayers;
        if (list === null)
            list = {};
        list[data.id] = data;
        this.setState({dataPlayers: list});

        let history = JSON.parse(this.state.historyDataPlayers);
        if (history[data.id] === undefined) {
            let arr = [];
            arr.push(data);
            history[data.id] = arr;
        } else {
            history[data.id].push(data);
        }
        if (history[data.id].length >= 15) {
            history[data.id].shift();
        }
        this.setState({historyDataPlayers: JSON.stringify(history)});

    }

    addPlayerLayer() {
        let rows = [];
        rows = this.addPathLayer(rows);

        const playerLayer = this;
        const id = this.state.id;
        const playerData = this.state.dataPlayers;

        rows.push(
            <Marker ref={playerLayer.popup} title={id} position={[this.state.latitude, this.state.longitude]} icon={myIcon}>
                <Popup>
                    <div>Accuracy: {playerLayer.state.accuracy} m</div>
                    <button onClick={playerLayer.showFindEnemyAlertBox.bind(playerLayer)}> Find other players </button>
                </Popup>
            </Marker>
        );

        if (playerData !== null) {
            Object.keys(playerData).forEach(function (key) {
                const player = playerData[key];
                const idEnemy = player.id;
                const pos = [player.latitude, player.longitude];
                const timeDiff = Math.abs(new Date() - new Date(player.updatedAt)) / 1000;

                if( playerLayer.props.idTarget !== null && playerLayer.props.idTarget === idEnemy ){
                    playerLayer.props.setTarget(idEnemy, pos);
                    if( idEnemy !== id ){
                        rows.push(<Marker position={pos} icon={target}/>);
                    }
                }
                if (idEnemy !== id) {
                    if (timeDiff <= 5) {
                        rows.push(
                            <Marker title={key} position={pos} icon={enemyOnline}>
                                <Popup>
                                    <p> {key}, accuracy: {player.accuracy} m</p>
                                    <p>
                                        <button onClick={() => playerLayer.sendSpecialSignal(idEnemy)}> Send signal
                                        </button>
                                    </p>
                                    <p>
                                        <button onClick={() => playerLayer.sendHandShakeSignal(id, idEnemy)}> Send
                                            handshake signal
                                        </button>
                                    </p>
                                </Popup>
                            </Marker>
                        );
                    } else if (timeDiff <= 30) {
                        rows.push(
                            <Marker title={key} position={pos} icon={enemyOffline}>
                                <Popup>
                                    <p> {key} </p>
                                    {/*<button onClick={() => playerLayer.sendSpecialSignal(idEnemy)}>Send signal</button>*/}
                                    {/*<button onClick={() => playerLayer.sendHandShakeSignal(id, idEnemy)}>Send handshake*/}
                                    {/*signal*/}
                                    {/*</button>*/}
                                </Popup>
                            </Marker>
                        );
                    } else {
                        playerLayer.showAlertBox(key + " went offline.");
                        delete playerLayer.state.dataPlayers[key];
                    }
                }
            });
        }
        this.setState({playerMarkers: rows});
    }

    addPathLayer(rows) {
        if (rows === null) rows = [];
        let oldData = JSON.parse(this.state.historyDataPlayers);

        Object.keys(oldData).forEach( (user) => {
            let oldUser = oldData[user];
            oldUser.pop();
            for(let i = oldUser.length; i > 0; i-- ){
                const playerData = oldUser[i-1];
                if(user !== this.state.id){
                    const pos = [playerData.latitude,playerData.longitude];
                    const opacity = (i+2)/(oldUser.length+4);
                    const timeDiff =  Math.round(Math.abs(new Date() - new Date(playerData.updatedAt))/1000);
                    if (timeDiff <= 15)
                        rows.push(
                            <Marker position={pos} icon={pathMark} opacity={opacity}>
                                <Popup>
                                    {playerData.id}, {timeDiff} s ago.
                                </Popup>
                            </Marker>
                        );
                }
            }
        });
        return rows;
    }

    // Send signal to server
    sendSpecialSignal(idEnemy){
        console.log(this.state.id + "send special signal to "+ idEnemy);

        this.context.emit("signal", {token: cookies.get('token'), receiver: idEnemy, type: "special"})
    }

    receiveSpecialSignal(data) {
        this.showAlertBox("Special signal received from " + data.sender);
    }

    // Send special signal to server
    sendHandShakeSignal(id,idEnemy){
        console.log(id+" send handshake signal to: "+ idEnemy);

        this.context.emit("signal", {token: cookies.get('token'), receiver: idEnemy, type: "handshake"})
    }

    // Send acknowledgement to server
    acknowledgeHandshake(data){
        this.showAlertBox(data.sender +" sent you a handshake signal.");

        this.context.emit("signal", {token: cookies.get('token'), receiver: data.sender, type: "ACKhandshake"})
    }

    handshakeAcknowledged(data) {
        this.showAlertBox(data.sender +" is online and acknowledged your handshake! Go find him and challenge him to battle!");
    }

    // Send fight signal to server (fight: id vs idEnemy)
    fight(id,idEnemy){

        console.log(id+"send fight signal to: "+ idEnemy);

        const obj = JSON.stringify({
            request: "fight",
            token: cookies.get('token'),
            playerId: id,
            enemyPlayerId: idEnemy
        });
    }

    showAlertBox(content){
        this.props.showAlertBox(content);
    }

    showFindEnemyAlertBox(){
        this.popup.current.leafletElement.options.leaflet.map.closePopup();

        var rows = [];

        var playerLayer = this;

        rows.push(<button onClick={playerLayer.props.setTarget.bind(playerLayer,this.state.id,[this.state.latitude,this.state.longitude])}>Follow yourself</button> );

        var jsonObject = this.state.dataPlayers;
        if(jsonObject !== null){

            var content = "";

            Object.keys(jsonObject).forEach(function(key) {

                var playerData = jsonObject[key];

                var idEnemy = playerData.id;

                // check for enemy!
                if(idEnemy !== playerLayer.state.id){
                    rows.push(<button onClick={playerLayer.props.setTarget.bind(playerLayer,idEnemy,[playerData.latitude,playerData.longitude])}>Follow {idEnemy}</button>);
                }
            });
        }
        this.showAlertBox(rows);

    }


    render() {
        var markers = this.state.playerMarkers;

        if(markers !== null){
            return (markers)
        } else {
            return (null)
        }
    }

}
PlayerLayer.contextType = SocketContext;

export default PlayerLayer;
