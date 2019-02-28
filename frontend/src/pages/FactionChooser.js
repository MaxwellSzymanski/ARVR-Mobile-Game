import React from 'react';
import { Link } from 'react-router-dom';
import "./factionChooser.css"
import "react-responsive-carousel/lib/styles/carousel.min.css";
import ReactDOM from 'react-dom';
import swal from '@sweetalert/with-react';

class FactionChooser extends React.Component {
    constructor() {
        super();

        this.state = {
            faction: "none",
            render: false
        };
    }

    componentDidMount() {
        setTimeout(() => this.showInfo(), 1000);
    }

    showInfo(){
        swal( {icon: 'info', title: "Factions", text: "Tap and hold on a faction to join it."});
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
        if (this.state.faction == "none") {return "Select first"}
        else if (this.state.faction == "loneWolf") {return "Confirm lone wolf"}
        else {return "Confirm " + this.state.faction}
    }

    confirm() {
        // TODO: redirect
    }

    render() {
        return (
            <div>
                <h1 className="subTitle fadeIn0">Choose your faction</h1>
               <div className="cell fadeIn1" onClick={() => this.selectFaction(1)}>
                    <div className="header scavenger">Scavenger</div>
                    <div className="cardImage scavenger">
                        <h1 className="white"> Stamina reduces slower. </h1>
                    </div>
                </div>
                <div className="cell fadeIn2" onClick={() => this.selectFaction(2)}>
                    <div className="header loneWolf">Lone Wolf</div>
                    <div className="cardImage loneWolf">
                        <h1 className="white"> Increases chances of successful attacks. </h1>
                    </div>
                </div>
                <div className="cell fadeIn3" onClick={() => this.selectFaction(3)}>
                    <div className="header adventurer">Adventurer</div>
                    <div className="cardImage adventurer">
                        <h1 className="white"> Gain attack and defence after battles. </h1>
                    </div>
                </div>
                <button className="selectButton fadeIn4" onClick={this.confirm}>{this.renderText()}</button>
            </div>
    )
    }


}

export default FactionChooser;
