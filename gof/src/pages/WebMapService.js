import React from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Card } from 'material-ui'


// Open Layers Imports
import {ol} from 'openlayers';

class WebMapService extends React.Component {
    constructor(props) {
        super(props)

        this.map = {};
    }


    componentDidMount() {

        this.map = new ol.Map({
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                })
            ],
            target: 'map',
            view: new ol.View({
                center: [0, 0],
                zoom: 2
            })
        });

        // this.map.updateSize();
        // this.map.render();
        // this.map.redraw();
    }


    render() {
        //if(this.props.contentRender) {      // Conditional Rendering
        return (
            <div>
                <Card id="WebMapService" className="cardContainerFullScreen">


                    <div id="map" className="map" ref="olmap"></div>


                </Card>
            </div>
        )
        //}else{return false}
    }
}



WebMapService.propTypes = {
    contentRender: PropTypes.bool
};

const mapStateToProps = (state) => {
    return {
        contentRender: state.setWMSComponentStatus.setWMSComponentStatusState
    }
}

export default connect(mapStateToProps)(WebMapService);
