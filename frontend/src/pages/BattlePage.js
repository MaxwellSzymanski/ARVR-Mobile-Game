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
            //name: 'Test name',
            oppName: cookies.get('name'),
            oppHealth: 300,
            oppDefence: 200,
            oppLevel: 1,
            opponentPic: require("../assets/temporary/profileImage.png"),
            loggedOut: true
            //TODO
        };
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

    render() {
        return (
            <div>
                <div className="bProfileCard fadeIn0">
                    <div className="bProfilePhoto"><img src={this.state.opponentPic} alt={"Profile image"}/></div>
                    <h1 className="bName">Test Name</h1>
                    <h3 className="bSmallText">Level {this.state.oppLevel}</h3>
                    <div className="healthBar">
                        <div className="healthCurrent"> </div>
                    </div>
                    <h3 className="bSmallText">{this.state.experience}<b>/350 xp</b></h3>

                    <div>
                        <h1 className="bName">Attack success</h1>
                        <h1>62%</h1>
                    </div>
                    <div className="shorterLine"> </div>
                    <div>
                        {this.generateAttributes(200)}
                    </div>
                </div>
            </div>
        )
    }
}
export default BattlePage;
