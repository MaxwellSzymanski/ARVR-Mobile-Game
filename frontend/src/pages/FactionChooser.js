import React from 'react';
import { Link } from 'react-router-dom';
import "./factionChooser.css"
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Flickity from 'react-flickity-component'
import ReactDOM from 'react-dom';

class FactionChooser extends React.Component {
    constructor() {
        super();
        this.carousel = React.createRef();
        this.state = {
            seconds: 0
        };
    }

    componentDidMount() {
    }

    tick() {
        this.setState(prevState => ({
            seconds: prevState.seconds + 1
        }));
        if (this.state.seconds > 0) {
            let car = this.refs.carousel;
            car.style.width = '60px';
        }
    }

    componentDidMount() {
        this.interval = setInterval(() => this.tick(), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return (
            <div ref={this.carousel}>
                <h1 className="title">Choose faction</h1>
                <div className="carousel" data-flickity='{ "freeScroll": false, "wrapAround": true, "prevNextButtons": false, "pageDots": false , "reloadOnUpdate": true}'>
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
