import React from 'react';
import { Link } from 'react-router-dom';
import "./profilePage.css"
import Cookies from 'universal-cookie';
import axios from "axios";
import SocketContext from "../socketContext";
import EmailVerif from "./EmailVerif";

const cookies = new Cookies();

const url = require('./serveradress.js');

class ProfilePage extends React.Component {
    constructor() {
        super();

        this.state = {
            name: cookies.get('name'),
            health: 100,
            attack: 100,
            defence: 100,
            level: 1,
            visibility: 0,
            experience: 0
        };
    }

    componentWillMount() {
        this.context.emit("stats", {token: cookies.get('token')});
    }

    componentDidMount() {
        this.context.on("stats", (data) => {
            this.setState({
                attack: data.attack
            });
            alert(JSON.stringify(this.state));

            let image = new Image();
            image.src = 'data:image/png;base64,' + data.image;
            document.body.appendChild(image);
        })
    }

    render() {
        return (
            <div>

                {/* Buttons and profile */}

                <button className="smallButton back topLeft"/>;
                <div className="profileCard">
                    <div className="profilePhoto"></div>
                    <h1 className="name">{this.state.name}</h1>
                    <h3 className="smallText">Level {this.state.level}</h3>
                    <div className="xpBar">
                        <div className="xpGained"></div>
                    </div>
                    <h3 className="smallText">{this.state.experience}<b>/350 xp</b></h3>
                </div>

                <button className="smallButton settings topRight"/>

                {/* Stat card */}

                <div className="statCard">
                    <div className="statContainer">
                        <h3 className="statTitle">Kills</h3>
                        <h3 className="statNumber">8</h3>
                        <div className="divider"></div>
                    </div>
                    <div className="statContainer">
                        <h3 className="statTitle">Deaths</h3>
                        <h3 className="statNumber">2</h3>
                        <div className="divider"></div>
                    </div>
                    <div className="statContainer">
                        <h3 className="statTitle">Items</h3>
                        <h3 className="statNumber">13</h3>
                    </div>
                </div>

                {/* Info card */}

                <div className="contentCard">
                    <div className="attributeContainer">
                        <h3 className="attributeTitle">Health</h3>

                        <div className="attributeValueContainer">
                            <p className="attributeNumber">{this.state.health}</p>
                            <div className="attributeValueActive"> </div>
                            <div className="attributeValueActive"> </div>
                            <div className="attributeValue"> </div>
                            <div className="attributeValue"> </div>
                        </div>
                    </div><hr className="shorterLine"/>
                    <div className="attributeContainer">
                        <h3 className="attributeTitle">Attack</h3>
                        <div className="attributeValueContainer">
                            <p className="attributeNumber">{this.state.attack}</p>
                            <div className="attributeValueActive"> </div>
                            <div className="attributeValue"> </div>
                            <div className="attributeValue"> </div>
                            <div className="attributeValue"> </div>
                        </div>
                    </div><hr className="shorterLine"/>
                    <div className="attributeContainer">
                        <h3 className="attributeTitle">Defence</h3>
                        <div className="attributeValueContainer">
                            <p className="attributeNumber">{this.state.defence}</p>
                            <div className="attributeValueActive"> </div>
                            <div className="attributeValueActive"> </div>
                            <div className="attributeValue"> </div>
                            <div className="attributeValue"> </div>
                        </div>
                    </div><hr className="shorterLine"/>
                    <div className="attributeContainer">
                        <h3 className="attributeTitle">Visibility</h3>
                        <div className="attributeValueContainer">
                            <p className="attributeNumber">{this.state.visibility}</p>
                            <div className="attributeValueActive"> </div>
                            <div className="attributeValueActive"> </div>
                            <div className="attributeValueActive"> </div>
                            <div className="attributeValue"> </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
ProfilePage.contextType = SocketContext;

export default ProfilePage;
