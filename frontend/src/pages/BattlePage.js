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
        const active = Math.round(number / 100);
        let html = [];
        for (let i = 1; i <= active; i++) {
            html.push(<div key={i} className="bAttributeValueActive"> </div>)
        }
        if (active !== 4) {
            for (let j = 1; j <= 4-active; j++) {
                html.push(<div key={5+j} className="bAttributeValue"> </div>)
            }
        }
        return html
    }

    generateText(number) {
        switch (Math.round(number / 100)) {
            case 0:
                return "Very Low";
            case 1:
                return "Low";
            case 2:
                return "Moderate";
            case 3:
                return "High";
            case 4:
                return "Very high";
            default:
                return "None";
        }
    }

    attack() {
        const that = this;
        const prob = that.calculateProbability()/100;
        if (Math.random() <= prob) {
            swal("You attacked the opponent!");
        }
        else {
            swal("Missed the opponent!");
        }
    }

    flee() {
        swal({title: 'You fled successfully', icon: 'success'})
    }

    calculateProbability() {
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
                                <p className="bAttributeNumber">{this.generateText(200)}</p>
                                {this.generateAttributes(200)}
                            </div>
                        </div><hr className="shorterLine"/>
                        <div className="bAttributeContainer">
                            <h3 className="bAttributeTitle">Stamina</h3>
                            <div className="bAttributeValueContainer">
                                <p className="bAttributeNumber">{this.generateText(400)}</p>
                                {this.generateAttributes(200)}
                            </div>
                        </div><hr className="shorterLine"/>
                        <div className="bAttributeContainer">
                            <h3 className="bAttributeTitle">Motivation</h3>
                            <div className="bAttributeValueContainer">
                                <p className="bAttributeNumber">{this.generateText(200)}</p>
                                {this.generateAttributes(200)}
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <button className="buttonAttack fadeIn2" onClick={this.attack}>Attack</button>
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
