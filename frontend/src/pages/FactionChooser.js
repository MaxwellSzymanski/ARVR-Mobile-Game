import React from 'react';
import { Link } from 'react-router-dom';
import "./factionChooser.css"
import "react-responsive-carousel/lib/styles/carousel.min.css";
import ReactDOM from 'react-dom';
import swal from '@sweetalert/with-react';
import SocketContext from "../socketContext";
import Cookies from 'universal-cookie';
const cookies = new Cookies();

class FactionChooser extends React.Component {
    constructor() {
        super();

        this.state = {
            faction: "none",
            render: false,
            loneWolfFraction: 0,
            adventurerFraction: 0,
            scavengerFraction: 0
        };

        this.confirm = this.confirm.bind(this);
    }

    alert() {
        swal("Faction chooser", "Select a faction. The icons indicate how crowded a faction is. The more people" +
            "join it, the weaker the players, so choose wisely!");
    }

    componentDidMount() {
        this.context.emit("requestFractions");

        this.context.on("factionFractions", (data) => {
            this.alert();
            this.setState({
                loneWolfFraction: data.loneWolfFraction,
                adventurerFraction: data.adventurerFraction,
                scavengerFraction: data.scavengerFraction
            })
        });

        this.context.on("faction", (data) => {
            if (data.success) {
                window.location.reload();
            } else {
                swal("Something went wrong. Please try again.", {icon: "error"} )
            }
        })
    }

    selectFaction(number) {
        switch (number) {
            case 1:
                this.setState({
                    faction: "scavenger"
                });
                break;
            case 2:
                this.setState({
                    faction: "loneWolf"
                });
                break;
            case 3:
                this.setState({
                    faction: "adventurer"
                });
                break;
        }
    }

    renderText() {
        if (this.state.faction === "none") {return "Select first"}
        else if (this.state.faction === "loneWolf") {return "Confirm lone wolf"}
        else {return "Confirm " + this.state.faction}
    }

    confirm() {
        this.context.emit("faction", {token: cookies.get('token'), faction: this.state.faction})
    }

    render() {
        return (
            <div>
                <h1 className="subTitle fadeIn0 unselectable">Choose your faction</h1>
               <div className="cell fadeIn1" onClick={() => this.selectFaction(1)}>
                    <div className="header scavenger">Scavenger</div>
                    <div className="cardImage scavenger">
                        <h1 className="white unselectable"> Stamina reduces slower. </h1>
                    </div>
                </div>
                <div className="cell fadeIn2" onClick={() => this.selectFaction(2)}>
                    <div className="header loneWolf unselectable">Lone Wolf</div>
                    <div className="cardImage loneWolf">
                        <h1 className="white unselectable"> Increases chances of successful attacks. </h1>
                    </div>
                </div>
                <div className="cell fadeIn3" onClick={() => this.selectFaction(3)}>
                    <div className="header adventurer unselectable">Adventurer</div>
                    <div className="cardImage adventurer">
                        <h1 className="white unselectable"> Gain attack and defence after battles.</h1>
                    </div>
                </div>
                <button className="selectButton fadeIn1" onClick={this.confirm}>{this.renderText()}</button>
            </div>
        )
    }

}
FactionChooser.contextType = SocketContext;

export default FactionChooser;
