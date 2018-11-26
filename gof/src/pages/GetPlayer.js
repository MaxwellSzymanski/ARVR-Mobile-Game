import React from 'react';
import {async, axios} from 'axios';
import {ol} from 'openlayers';

class GetPlayer extends React.Component {

  state = {
    longitude: 4.361721,
    latitude: 50.850346
  }

  increaseUpdateFrequencyMap (){

  }

  decreaseUpdateFrequencyMap(){

  }

  async d () {
      document.getElementById("map").innerHTML = "";

      // send HTTP request to get JSON object with players
      var urlD = 'https://35.241.198.186:80';

      var data = {};

      data.playerId = document.getElementById("idPlayer").value;

      data.request = "Radar";

      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(showPosition);
      } else {
          data.longitude = this.state.longitude;
          data.latitude = this.state.latitude;
      }
      function showPosition(position) {
          this.setState({longitude: position.coords.longitude});
          this.setState({latitude: position.coords.latitude});
      }

      data.longitude = this.state.longitude;
      data.latitude = this.state.latitude;

      var obj = JSON.stringify(data);

  // Send request use jquery ajax.
      await axios.post(urlD, obj).then( function (data) {
          create(data);
      });

      function create(players) {
          // Create Map
          let rotationMap = 0;

          const map = new ol.Map({
              target: 'map',
              layers: [new ol.layer.Tile({
                  source: new ol.source.OSM(),
              })],
              view: new ol.View({
                  center: ol.proj.fromLonLat([this.state.longitude, this.state.latitude]),
                  rotation: rotationMap
              })
          });

          map.getView().setZoom(parseInt(document.getElementById("mapInfo").getAttribute("zoom")));

          map.on('click', function(evt) {
              var feature = map.forEachFeatureAtPixel(evt.pixel,
                  function(feature, layer) {
                      return feature;
                  });
              if( feature) {
                  var att = feature.getProperties();
                  var json = JSON.parse(att.name);
                  alert("Id player: "+json.idPlayer);
              }
          });
          map.getView().setZoom(parseInt(document.getElementById("mapInfo").getAttribute("zoom")));

          map.on('click', function(evt) {
              var feature = map.forEachFeatureAtPixel(evt.pixel,
                  function(feature, layer) {
                      return feature;
                  });
              if( feature) {
                  var att = feature.getProperties();
                  var json = JSON.parse(att.name);
                  alert("Id player: "+json.idPlayer);
              }
          });

          // add every player to map
          getPlayerLayers(players, map);

          setTimeout(function(){
              // store zoom of previous map
              var zoom = map.getView().getZoom();
              // alert("get value of zoom: "+document.getElementById("mapInfo").getAttribute("zoom"));
              document.getElementById("mapInfo").setAttribute("zoom",zoom.toString());
          }, 8000);

          setTimeout(function(){
              // store zoom of previous map
              var zoom = map.getView().getZoom();
              alert("get value of zoom: "+document.getElementById("mapInfo").getAttribute("zoom"));
              document.getElementById("mapInfo").setAttribute("zoom",zoom.toString());
          }, 8000);

          function getPlayerLayers(players, map) {
              var obj = (JSON.parse(players));

              let i = 0;
              var x;
              for (x in obj) {

                  // create icon
                  // Source: https://stackoverflow.com/questions/48902253/how-to-add-icon-marker-to-osm-map-using-openlayers-4-6-4
                  let longitude = obj[i].longitude;
                  let latitude = obj[i].latitude;
                  let name = JSON.stringify(obj[i]);


                  var icon1 = new ol.Feature({
                      geometry: new ol.geom.Point(ol.proj.fromLonLat([longitude, latitude]),),
                      name: name
                  });

                  let iconLayerSource = new ol.source.Vector({
                      features: [icon1]
                  });

                  let iconLayer = new ol.layer.Vector({
                      source: iconLayerSource,
                      style: new ol.style.Style({
                          image: new ol.style.Icon({
                              anchor: [0.5, 0.5],
                              anchorXUnits: 'fraction',
                              anchorYUnits: 'fraction',
                              scale: 0.1,
                              src: 'https://img.freepik.com/free-icon/frontal-standing-man-silhouette_318-29133.jpg?size=338c&ext=jpg'
                          })
                      })
                  });
                  i++;

                  // adding every player icon to map!
                  map.addLayer(iconLayer);
              }
          }
      }
      setTimeout(this.d, 8000); //
      };

      autozoom(){
          var zoom = document.getElementById("mapInfo").getAttribute("autozoom");
          document.getElementById("mapInfo").setAttribute("zoom",zoom.toString());
          // alert("AUTOZOOM ACITVATED");
          this.d();
      }

render() {
  return(
    <div>
    {this.d()}
    <button onClick={this.increaseUpdateFrequencyMap}>Raise update Frequency</button>
    <button onClick={this.decreaseUpdateFrequencyMap}>Decrease update Frequency</button>
    <button onClick={this.autozoom}>Autozoom</button>
    <input type="text" id="idPlayer" type="submit" value=""/>

    <div id="mapInfo" autozoom="14" zoom="14"></div>
    <div id="map" className="map" autozoom="14" zoom="14"></div>


    </div>
  );
}


}

export default GetPlayer;
