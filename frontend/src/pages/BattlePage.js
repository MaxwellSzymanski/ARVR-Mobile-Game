import React from 'react';
import {Link, Redirect} from 'react-router-dom';
import "./BattlePage.css"
import swal from '@sweetalert/with-react';
import Cookies from 'universal-cookie';
import SocketContext from "../socketContext";

const cookies = new Cookies();

class BattlePage extends React.Component {
    constructor() {
        super();

        this.state = {
            oppName: 'Target Player',
            oppHealth: 0,
            oppDefence: 200,
            oppLevel: 1,
            opponentPic: require("../assets/icons/userInverted.png"),
            selfKills: 3,
            selfDeaths: 4,
            selfHealth: 30,
            probability: 0,
            fatigue: 0,
            motivation: 0,
            stamina: 0,
            //TODO
            redirect:false
        };

        this.attack = this.attack.bind(this);
    }

    componentDidMount() {
        let attackToken = cookies.get("attackToken");
        let oppHealth = (((5 + this.state.oppHealth)/105)*100).toString() + '%';
        let css = document.getElementById('oppHealth');
        if (css !== null && css !== undefined)
            css.style.width = oppHealth;

        this.context.emit("stats", {token: cookies.get("token"), enemy: attackToken});

        // this.context.emit("getStatsById", attackToken);

        this.context.emit("getProb", {token: cookies.get('token')});

        this.context.on("probData", (data) => {
            this.setState({
                probability: data.probability,
                fatigue: data.fatigue,
                motivation: data.motivation,
                stamina: data.stamina,
            })
        });

        this.context.on("enemystats", (data) => {
            console.log("stats received: " + data);
            this.setState({
                oppName: data.name,
                oppHealth: data.health,
                oppDefence: data.defence,
                opplevel: data.level,
                visibility: 50,
            });
            oppHealth = (((5 + data.health)/105)*100).toString() + '%';
            css = document.getElementById('oppHealth');
            if (css !== null && css !== undefined)
                css.style.width = oppHealth;
        });
        this.context.on("enemyphoto", (image) => {
           this.setState({
               opponentPic: image,
           });
        });
        this.context.on("stats", (data) => {
            let items = 0;
            if (data.items !== null)
                items = data.items.length;
            this.setState({
                selfAttack: data.attack,
                selfHealth: data.health,
                selfDefence: data.defence,
                selfLevel: data.level,
                selfExperience: data.experience,
                selfKills: data.kills,
                selfDeaths: data.deaths,
                selfItems: items,
            });
        });
        this.interval = setInterval(() => {
            this.sendLocation();
        }, 750);
        this.context.on("attack", (data) => {
            swal({title: 'You attacked succesfully!', icon: 'success', text: data.message, confirm: true}).then( (value) => {
                this.setState({redirect: true})
            });
        });
        this.context.on("miss", (data) => {
            swal({title: 'You missed!', icon: 'error', text: data.message, confirm: true}).then( (value) => {
                this.setState({redirect: true})
            });
        })
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
                accuracy: Math.round(position.coords.accuracy)
            })
        });
    }

    // Generate attribute boxes
    generateAttributes(number) {
        let value = 0;
        if (number < 0.25) {value = 1}
        else if (number < 0.50) {value = 2}
        else if (number < 0.75) {value = 3}
        else {value = 4}

        let html = [];
        for (let i = 1; i <= value; i++) {
            html.push(<div key={i} className="bAttributeValueActive"> </div>)
        }
        if (value !== 4) {
            for (let j = 1; j <= 4-value; j++) {
                html.push(<div key={5+j} className="bAttributeValue"> </div>)
            }
        }
        return html
    }

    generateText(value) {
        if (value === 0) {return "Very Low";}
        else if (value < 0.25) {return "Low"}
        else if (value < 0.50) {return "Moderate"}
        else if (value < 0.75) {return "High"}
        else {return "Very High"}
    }

    attack() {
        if (this.state.probability < Math.random()) {
            this.context.emit("fight", {token: cookies.get('token'), enemy: localStorage.getItem("capturedPlayerId")});
        }
        else {
            this.context.emit("miss", {token:cookies.get('token')});
        }
    }


    renderRedirect = () => {
        if (this.state.redirect) {return <Redirect to="/map" />}
    };

    render() {
        return (
            <div>
                {this.renderRedirect()}
                <h1 className="subTitle fadeIn0">Player match!</h1>
                <div className="bProfileCard fadeIn1">
                    <div className="headerTop">
                        <div className="bProfilePhoto"><img src={this.state.opponentPic} alt={"Profile image"}/></div>

                        <h1 className="bName">{this.state.oppName}</h1><br/>
                        <h3 className="bSmallText">Level {this.state.oppLevel}</h3>
                    </div>

                    <div className="middleContent">
                        <div className="healthBar">
                            <div className="healthCurrent" id="oppHealth"> </div>
                            <h3 className="bHealth">{this.state.oppHealth}/100 HP</h3>
                        </div>
                    </div>


                    <div className="attackContent">
                        <h3 className="bSuccess">Attack success</h3>
                        <h3 className="bPercent">{this.state.probability}%</h3>
                    </div>

                    <div className="attributes">
                        <div className="bAttributeContainer">
                            <h3 className="bAttributeTitle">Fatigue</h3>
                            <div className="bAttributeValueContainer">
                                <p className="bAttributeNumber">{this.generateText(this.state.fatigue)}</p>
                                {this.generateAttributes(this.state.fatigue)}
                            </div>
                        </div><hr className="shorterLine"/>
                        <div className="bAttributeContainer">
                            <h3 className="bAttributeTitle">Stamina</h3>
                            <div className="bAttributeValueContainer">
                                <p className="bAttributeNumber">{this.generateText(this.state.stamina)}</p>
                                {this.generateAttributes(this.state.stamina)}
                            </div>
                        </div><hr className="shorterLine"/>
                        <div className="bAttributeContainer">
                            <h3 className="bAttributeTitle">Motivation</h3>
                            <div className="bAttributeValueContainer">
                                <p className="bAttributeNumber">{this.generateText(this.state.motivation)}</p>
                                {this.generateAttributes(this.state.motivation)}
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <Link to="/map">
                    <button className="buttonAttack fadeIn2" onClick={this.attack}>Attack</button>
                    </Link>
                </div>

                <div>
                    <button className="buttonFlee fadeIn3" onClick={this.flee}>Flee</button>
                </div>


            </div>
        )
    }
}

BattlePage.contextType = SocketContext;
export default BattlePage;
