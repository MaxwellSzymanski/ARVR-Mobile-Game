import React from 'react';
import { Link } from 'react-router-dom';
import "./factionChooser.css"
import Flickity from 'react-flickity-component'

class FactionChooser extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <h1 className="title">Choose your faction </h1>
                <div className="carousel" data-flickity='{ "freeScroll": false, "wrapAround": true, "prevNextButtons": false, "pageDots": false }'>
                    <div className="carousel-cell">
                        <div className="header scavenger">Scavenger</div>
                        <div className="cardImage scavenger">
                            <h1 className="white"> Come across more items, and have longer duration. </h1>
                        </div>
                    </div>
                    <div className="carousel-cell">
                        <div className="header loneWolf">Lone Wolf</div>
                        <div className="cardImage loneWolf">
                            <h1 className="white"> Reduces visibility and increases chances of attack. </h1>
                        </div>
                    </div>
                    <div className="carousel-cell">
                        <div className="header adventurer">Adventurer</div>
                        <div className="cardImage adventurer">
                            <h1 className="white"> Gain attack and defence after battles. </h1>
                        </div>
                    </div>
                </div>
                <button className="selectButton">Select</button>
            </div>
    )
    }
}
export default FactionChooser;
