import React from 'react';
import {Link, Redirect} from 'react-router-dom';
import "./profilePage.css"
import Cookies from 'universal-cookie';
import SocketContext from "../socketContext";
import swal from '@sweetalert/with-react';

const cookies = new Cookies();

class ProfilePage extends React.Component {
    constructor() {
        super();
        this.state = {
            //name: 'Test name',
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
            encodedPic: require("../assets/temporary/profileImage.png"),
            loggedOut: false,
        };
    }

    componentDidMount() {
        this.context.emit("stats", {token: cookies.get('token')});

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
        const that = this;
        this.context.on("signout", (data) => {
            if (data.success) {
                cookies.remove("token");
                cookies.remove("name");
                swal("Logged out!", {icon: "success"});
                that.setState({loggedOut:true});
            } else {
                swal("Something went wrong. Please try again.", {icon: "error"});
            }
        });

        // Update XP bar
        const xp = (((10 + this.state.experience)/365)*100).toString() + '%';
        document.getElementById('xpBar').style.width = xp;

        this.interval = setInterval(() => {
            this.sendLocation();
        }, 500);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    sendLocation() {
        navigator.geolocation.getCurrentPosition((position) => {
            this.context.emit("location", {
                token: cookies.get('token'),
                longitude: position.coords.longitude,
                latitude: position.coords.latitude,
            })
        });
    }

    // Generate attribute boxes
    generateAttributes(number) {
        const active = Math.round(number / 100);
        let html = [];
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

    logOut() {


        this.context.emit("signout", {token: cookies.get("token")});
    }

    renderRedirect = () => {
        if (this.state.loggedOut) {
            swal("Logged out successfully.", {icon: "success"});
            return <Redirect to="/signin" />}
    };

    render() {
        return (
            <div>
                {this.renderRedirect()}

                {/* Buttons and profile */}

                <Link to="/map"><button className="smallButton back topLeft"/></Link>;
                <div className="profileCard fadeIn0">
                    <div className="profilePhoto"><img src={this.state.encodedPic} alt={"Profile image"}/></div>
                    <h1 className="name">{this.state.name}</h1>
                    <h3 className="smallText">Level {this.state.level}</h3>
                    <div className="xpBar">
                        <div className="xpGained" id="xpBar"> </div>
                    </div>
                    <h3 className="smallText">{this.state.experience}<b>/350 xp</b></h3>
                </div>

                <Link to="/settings"><button className="smallButton settings topRight"/></Link>

                {/* Stat card */}

                <div className="statCard fadeIn1">
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

                <div className="contentCard fadeIn2">
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
                <button className="logOut fadeIn3" onClick={this.logOut}> Log out </button>
            </div>
        );
    }
}
ProfilePage.contextType = SocketContext;

export default ProfilePage;
