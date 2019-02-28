import React from 'react';
import { Link } from 'react-router-dom';
import "./BattlePage.css"
import swal from '@sweetalert/with-react';
import Cookies from 'universal-cookie';
import SocketContext from "../socketContext";

const cookies = new Cookies();

class BattlePage extends React.Component {
    constructor() {
        super();

        this.state = {
            oppName: 'Test name',
            //oppName: cookies.get('name'),
            oppHealth: 40,
            oppDefence: 200,
            oppLevel: 1,
            opponentPic: require("../assets/temporary/profileImage.png"),
            selfKills: 3,
            selfDeaths: 4,
            selfHealth: 30,
            loggedOut: true
            //TODO
        };
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

    generateValue(type) {
        switch (type) {
            case "stamina":
                return (this.state.health / 100);
            case "motivation":
                return (this.state.selfKills / (this.state.selfKills + this.state.selfDeaths));
            case "fatigue":
                return ((this.state.deaths / (this.state.selfKills + this.state.selfDeaths) + (1 - (this.state.health / 100)))/2);
            default:
                return -1;
        }
    }

    generateText(type) {
        const value = this.generateValue(type);
        if (value == 0) {return "Very Low";}
        else if (value < 0.25) {return "Low"}
        else if (value < 0.50) {return "Moderate"}
        else if (value < 0.75) {return "High"}
        else {return "Very High"}
    }

    attack() {
        const prob = this.calculateProbability(3);
        // TODO: Fix error
        if (Math.random() < prob) {
            swal({title: 'You attacked successfully!', icon: 'success'})
            // TODO: implement attack
        }
        else {
            swal({title: 'You missed the opponent', text: 'You took some damage.',icon: 'error'})
            // TODO: take damage
        }
    }

    flee() {
        swal({title: 'You fled successfully', icon: 'success'})
    }

    calculateProbability(num) {
        const prob = this.state.selfHealth + this.state.selfKills - this.state.selfKills;
        if (prob <= 30) return 30;
        if (prob >= 95) return 95;
        return prob;
    }



    render() {
        return (
            <div>
                <h1 className="subTitle fadeIn0">Attack opponent</h1>
                <div className="bProfileCard fadeIn1">
                    <div className="headerTop">
                        <div className="bProfilePhoto"><img src={this.state.opponentPic} alt={"Profile image"}/></div>
                        <h1 className="bName">{this.state.oppName}</h1>
                        <h3 className="bSmallText">Level {this.state.oppLevel}</h3>
                    </div>

                    <div className="middleContent">
                        <div className="healthBar">
                            <div className="healthCurrent"> </div>
                            <h3 className="bHealth">{this.state.oppHealth}/100 HP</h3>
                        </div>
                    </div>


                    <div className="attackContent">
                        <h3 className="bSuccess">Attack success</h3>
                        <h3 className="bPercent">{this.calculateProbability()}%</h3>
                    </div>

                    <div className="attributes">
                        <div className="bAttributeContainer">
                            <h3 className="bAttributeTitle">Fatigue</h3>
                            <div className="bAttributeValueContainer">
                                <p className="bAttributeNumber">{this.generateText("fatigue")}</p>
                                {this.generateAttributes(this.generateValue("fatigue"))}
                            </div>
                        </div><hr className="shorterLine"/>
                        <div className="bAttributeContainer">
                            <h3 className="bAttributeTitle">Stamina</h3>
                            <div className="bAttributeValueContainer">
                                <p className="bAttributeNumber">{this.generateText("stamina")}</p>
                                {this.generateAttributes(this.generateValue("stamina"))}
                            </div>
                        </div><hr className="shorterLine"/>
                        <div className="bAttributeContainer">
                            <h3 className="bAttributeTitle">Motivation</h3>
                            <div className="bAttributeValueContainer">
                                <p className="bAttributeNumber">{this.generateText("motivation")}</p>
                                {this.generateAttributes(this.generateValue("motivation"))}
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <Link to="/maps">
                    <button className="buttonAttack fadeIn2" onClick={this.attack}>Attack</button>
                    </Link>
                </div>

                <div>
                    <Link to="/maps">
                    <button className="buttonFlee fadeIn3" onClick={this.flee}>Flee</button>
                    </Link>
                </div>


            </div>
        )
    }
}
export default BattlePage;
