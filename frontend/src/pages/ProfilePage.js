import React from 'react';
import { Link } from 'react-router-dom';
import "./profilePage.css"
import Cookies from 'universal-cookie';
import SocketContext from "../socketContext";

const cookies = new Cookies();

class ProfilePage extends React.Component {
    constructor() {
        super();
        this.state = {
            name: cookies.get('name'),
            health: 300,
            attack: 100,
            defence: 200,
            level: 1,
            visibility: 50,
            experience: 150,
            kills: 8,
            deaths: 3,
            items: 13,
            encodedPic: require("../assets/temporary/profileImage.png")
        };
    }

    componentWillMount() {
        this.context.emit("stats", {token: cookies.get('token')});
    }

    componentDidMount() {
        this.context.on("stats", (data) => {
            this.setState({
                attack: data.attack,
                health: data.health,
                defence: data.defence,
                level: data.level,
                visibility: 50,
                experience: data.experience,
                kills: 8,
                deaths: 3,
                items: 13,
            });
        });
        this.context.on("photo", (data) => {
            this.setState({
                encodedPic: data.image
            })
        });

        // Update XP bar
        const xp = (((10 + this.state.experience)/365)*100).toString() + '%';
        document.getElementById('xpBar').style.width = xp;
    }

    // Generate attribute boxes
    generateAttributes(number) {
        const active = Math.round(number / 100);
        let html = []
        for (let i = 1; i <= active; i++) {
            html.push(<div key={i} className="attributeValueActive"> </div>)
        }
        if (active !== 4) {
            for (let j = 1; j <= 4-active; j++) {
                html.push(<div key={5+j} className="attributeValue"> </div>)
            }
        }
        return html
    }

    render() {
        return (
            <div>

                {/* Buttons and profile */}

                <button className="smallButton back topLeft"/>;
                <div className="profileCard">
                    <div className="profilePhoto"><img src={this.state.encodedPic}/></div>
                    <h1 className="name">{this.state.name}</h1>
                    <h3 className="smallText">Level {this.state.level}</h3>
                    <div className="xpBar">
                        <div className="xpGained" id="xpBar"> </div>
                    </div>
                    <h3 className="smallText">{this.state.experience}<b>/350 xp</b></h3>
                </div>

                <button className="smallButton settings topRight"/>

                {/* Stat card */}

                <div className="statCard">
                    <div className="statContainer">
                        <h3 className="statTitle">Kills</h3>
                        <h3 className="statNumber">{this.state.kills}</h3>
                        <div className="divider"> </div>
                    </div>
                    <div className="statContainer">
                        <h3 className="statTitle">Deaths</h3>
                        <h3 className="statNumber">{this.state.deaths}</h3>
                        <div className="divider"> </div>
                    </div>
                    <div className="statContainer">
                        <h3 className="statTitle">Items</h3>
                        <h3 className="statNumber">{this.state.items}</h3>
                    </div>
                </div>

                {/* Info card */}

                <div className="contentCard">
                    <div className="attributeContainer">
                        <h3 className="attributeTitle">Health</h3>

                        <div className="attributeValueContainer">
                            <p className="attributeNumber">{this.state.health}</p>
                            {this.generateAttributes(this.state.health)}
                        </div>
                    </div><hr className="shorterLine"/>
                    <div className="attributeContainer">
                        <h3 className="attributeTitle">Attack</h3>
                        <div className="attributeValueContainer">
                            <p className="attributeNumber">{this.state.attack}</p>
                            {this.generateAttributes(this.state.attack)}
                        </div>
                    </div><hr className="shorterLine"/>
                    <div className="attributeContainer">
                        <h3 className="attributeTitle">Defence</h3>
                        <div className="attributeValueContainer">
                            <p className="attributeNumber">{this.state.defence}</p>
                            {this.generateAttributes(this.state.defence)}
                        </div>
                    </div><hr className="shorterLine"/>
                    <div className="attributeContainer">
                        <h3 className="attributeTitle">Visibility</h3>
                        <div className="attributeValueContainer">
                            <p className="attributeNumber">{this.state.visibility}</p>
                            {this.generateAttributes(this.state.visibility)}
                        </div>
                    </div>
                </div>
                <button className="logOut"> Log out </button>
            </div>
        );
    }
}
ProfilePage.contextType = SocketContext;

export default ProfilePage;
