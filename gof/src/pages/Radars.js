import React from 'react';
import {async, axios} from 'axios';

class Radars extends React.Component {
  state = {
    urlD : 'https://35.241.198.186:80'
  }

  specialSignalReceived(){
      document.body.style.backgroundColor = "red";
      setTimeout(function(){
          document.body.style.backgroundColor = "black";
      }, 3000);
  }

   async getFrequency(){

     await axios.post(this.state.urlD, '{ "request": "frequency" }').then(function (dataHTTP) {
         var returnObject = JSON.parse(dataHTTP);
         if(returnObject.hasOwnProperty("frequency") && returnObject.hasOwnProperty("update") && returnObject.update === "true"){
             var cookieJson = JSON.parse(document.cookie);
             cookieJson.frequency = returnObject.frequency;
             document.cookie = JSON.stringify(cookieJson);
         }

     });
  }

  increaseUpdateFrequency(){
      this.sendUpdateFrequency(true);
  }

  decreaseUpdateFrequency(){
      this.sendUpdateFrequency(false);
  }

  async sendUpdateFrequency(increase){
      var cookieJson = JSON.parse(document.cookie);
      var frequency = Number(cookieJson.updateFrequency);
      if(increase && frequency > 1000) {
          frequency -= 1000;
      } else {
          frequency += 1000;
      }
      cookieJson.updateFrequency = frequency.toString();
      document.cookie = JSON.stringify(cookieJson);

      var data = {};

      data.request = "updateFrequency";
      data.frequency = frequency;

      var obj = JSON.stringify(data);

      await axios.post(this.state.urlD,obj).then( function (dataHTTP) {
          var returnObject = JSON.parse(dataHTTP);
          if(returnObject.hasOwnProperty("frequency") && returnObject.hasOwnProperty("update") && returnObject.update === "true"){
              var cookieJson = JSON.parse(document.cookie);
              cookieJson.frequency = returnObject.frequency;
              alert("Frequency is adjusted => frequency now: "+cookieJson.frequency);
          }});
  }

  sendSpecialSignal(){
      var cookieJson = JSON.parse(document.cookie);
      cookieJson.typeSignal = "specialSignal";
      document.cookie = JSON.stringify(cookieJson);
      document.getElementById("typeSignal").innerHTML = "Type signal: specialSignal"
  }

  sendHandShake(){
      var cookieJson = JSON.parse(document.cookie);
      cookieJson.typeSignal = "handShake";
      document.cookie = JSON.stringify(cookieJson);
      document.getElementById("typeSignal").innerHTML = "Type signal: handShakeSignal"
  }

  increaseNumberPixelPerMeter(){
      var cookieJson = JSON.parse(document.cookie);
      cookieJson.autozoom = "off";
      cookieJson.numberPixelPerMeter += 0.5;
      document.cookie = JSON.stringify(cookieJson);
  }

  decreaseNumberPixelPerMeter(){
      var cookieJson = JSON.parse(document.cookie);
      cookieJson.autozoom = "off";
      cookieJson.numberPixelPerMeter -= 0.5;
      document.cookie = JSON.stringify(cookieJson);
  }

  autozoom(){
      var cookieJson = JSON.parse(document.cookie);
      cookieJson.autozoom = "on";
      document.cookie = JSON.stringify(cookieJson);
  }

  degreesToRadians(degrees){
      return degrees * Math.PI / 180;
  }

  distanceBetween(lat1, lon1, lat2, lon2) {

      var earthRadiusKm = 6371;

      var dLat = this.degreesToRadians(lat2-lat1);
      var dLon = this.degreesToRadians(lon2-lon1);

      lat1 = this.degreesToRadians(lat1);
      lat2 = this.degreesToRadians(lat2);

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return earthRadiusKm * c * 1000; // * 1000 (answer in meters)
  }

  async d () {



      // get latest update frequency
      this.getFrequency();


      var data = {};

      var cookie = JSON.parse(document.cookie);

      data.request = "Radar";
      //data.playerId = cookie.idPlayer;
      data.playerId = document.getElementById("idPlayer").value;

      data.longitude = cookie.longitude;
      data.latitude =  cookie.latitude;

      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(showPosition);
      } else {
          alert("No geolocation available");
      }

      function showPosition(position) {
          var cookieJson = JSON.parse(document.cookie);
          cookieJson.longitude = position.coords.longitude;
          cookieJson.latitude = position.coords.latitude;
          document.cookie = JSON.stringify(cookieJson);
      }


      data.sendSignal = cookie.sendSignal;


      var obj = JSON.stringify(data);
      // Send get request use jquery ajax.

      await axios.post(this.state.urlD,obj).then( function (data) {
          this.createRadar(data);
      });

      function createRadar(dataHTTP){

          var cookie = (document.cookie);
          var playerLongitude = parseFloat(JSON.parse(cookie).longitude);
          var playerLatitude =  parseFloat(JSON.parse(cookie).latitude);

          var i = 0;

          var smallestDistancePlayer = 1000000;

          var object1 = JSON.parse(dataHTTP);

          var cookie = document.cookie;

          var x;

          if(JSON.parse(cookie).autozoom === "on") {
              for( x in object1){
                  var distancePlayer = this.distanceBetween(playerLongitude,playerLatitude,object1[i].longitude,object1[i].latitude);

                  if( distancePlayer > 10 && distancePlayer < smallestDistancePlayer){
                      smallestDistancePlayer = distancePlayer;
                  }
                  i++;
              }
              var newRatioPixelMeter = smallestDistancePlayer/(window.screen.height/4);

              var dataCookie = JSON.parse(document.cookie);
              dataCookie.numberPixelPerMeter = parseFloat(newRatioPixelMeter);
              document.cookie = JSON.stringify(dataCookie);
          }

          var object = JSON.parse(dataHTTP);

          i = 0;
          for( x in object) {
              let pos = JSON.parse(longLatToXandY(playerLongitude, playerLatitude, object[i].longitude, object[i].latitude));
              if( !object[i].hasOwnProperty("firstPlayer") ){
                  addElement(pos.x, pos.y, object[i].idPlayer);
              }
              i++;
          }

          // check if acknowledgement/specialSignal is send to player

          var object2 = JSON.parse(dataHTTP);

          var cookie = JSON.parse(document.cookie);
          var thisPlayer = cookie.idPlayer;
          //var thisPlayer = document.getElementById("radar").setAttribute("idPlayer",thisPlayer);

          i = 0;
          for( x in object2){

              // check if player is firstPlayer
              if( object2[i].hasOwnProperty("firstPlayer") && object2[i].firstPlayer === thisPlayer) {
                  document.getElementById("increaseFrequencyButton").style.visibility="visible";
                  document.getElementById("decreaseFrequencyButton").style.visibility="visible";
              } else {
                  document.getElementById("increaseFrequencyButton").style.visibility="hidden";
                  document.getElementById("decreaseFrequencyButton").style.visibility="hidden";                }

              // check for enemy!
              if( object2[i].idPlayer === thisPlayer && object2[i].hasOwnProperty("enemyPlayerId") &&object2[i].enemyPlayerId !== null ) {
                  document.getElementById(object2[i].enemyPlayerId).className = "objEnemy";
              }

              if (object2[i].sendSignal === "specialSignal" && object2[i].idPlayer === thisPlayer){
                  //alert("acknowledgement received!");
                  alert("specialSignal received!");
                  this.specialSignalReceived();
                  break;
              }

              if (object2[i].sendSignal === "handShakeSignal" && object2[i].idPlayer === thisPlayer){
                  //alert("acknowledgement received!");
                  alert("handShakeSignal received!");

                  var dataSignal = JSON.parse(object2[i].dataSignal);

                  if(dataSignal.acknowledged === "falseACK"){
                      this.acknowledgeHandshake(dataSignal.idPlayer);
                      break;
                  }
                  else if(dataSignal.acknowledged === "trueACK"){
                      alert("handshake is acknowledged!!! You are nog in a fight!!!");
                      this.fight(dataSignal.idPlayer);
                      break;
                  }}
              i++;

          }
      }
      function addElement (xValue,yValue,idPlayer) {
          // delete old div elements
          if (document.getElementById(idPlayer)) {
              var element = document.getElementById(idPlayer);
              element.parentNode.removeChild(element);
          }

          let html = '<button onclick="sendFixedSignal(this.id)" id=' +idPlayer+ ' class="obj" data-x="'+xValue+'" data-y="'+yValue+'" ></button>'

          var oldHtml = document.getElementById("body").innerHTML;
          document.getElementById("body").innerHTML = oldHtml + html;

      }

      function longLatToXandY(playerLogitude,playerLatitude,longitude, latitude){

          var cookie = (document.cookie);
          var numberPixelPerMeter = parseFloat(JSON.parse(cookie).numberPixelPerMeter);

          var m_per_deg_lat = 111132.954 - 559.822 * Math.cos( 2.0 * parseFloat(latitude) ) + 1.175 * Math.cos( 4.0 * parseFloat(latitude));
          var m_per_deg_lon = (3.14159265359/180 ) * 6367449 * Math.cos ( parseFloat(latitude) );

          var deltaLongitude = parseFloat(playerLogitude) - parseFloat(longitude);
          var deltaLatitude = parseFloat(playerLatitude) - parseFloat(latitude);

          var xPosition = deltaLongitude * m_per_deg_lon;
          var yPosition = deltaLatitude * m_per_deg_lat;

          var data = {};

          data.x = String(xPosition/numberPixelPerMeter + (window.screen.width/2));
          data.y = String(yPosition/numberPixelPerMeter + (window.screen.height/2));

          var obj = JSON.stringify(data);
          return obj;
      }


      var cookie = document.cookie;

      var updateFrequency = parseFloat(JSON.parse(cookie).updateFrequency);

      setTimeout(this.d, this.updateFrequency());
}

sendFixedSignal(id){
    var cookie = JSON.parse(document.cookie);
    var thisPlayer = cookie.idPlayer;

    if (thisPlayer === id){
        alert("cannot send signal to yourself :)")
    } else {

        var data = {};

        data.request = "sendSignal";
        data.playerId = id;
        var typeSignal = cookie.typeSignal;
        var dataSignal = {};
        if (typeSignal === "specialSignal") {
            data.sendSignal = "specialSignal";
            alert("send speciaSignal to player with id: " + id);
        } else {
            data.sendSignal = "handShakeSignal";
            dataSignal.acknowledged = "falseACK";
            alert("send acknowledgeHandshake falseACK signal to player with id: "+id);

        }
        dataSignal.idPlayer = thisPlayer;
        data.dataSignal = JSON.stringify(dataSignal);

        var obj = JSON.stringify(data);

        axios.post(this.state.urlD, obj); // send ajax object to server
    }
}

acknowledgeHandshake (id){

    var data = {};

    data.request = "sendSignal";
    data.playerId = id;
    data.sendSignal = "handShakeSignal";

    var cookie = JSON.parse(document.cookie);

    var dataSignal ={};
    dataSignal.idPlayer = cookie.idPlayer;
    dataSignal.acknowledged = "trueACK";
    data.dataSignal = JSON.stringify( dataSignal);

    alert("send acknowledgeHandshake trueACK signal to player with id: "+id);

    var obj = JSON.stringify(data);

    axios.post(this.state.urlD,obj); // send ajax object to server

}

fight(idEnemyPlayer) {

    var data = {};

    data.request = "fight";

    var cookie = JSON.parse(document.cookie);

    data.playerId = cookie.idPlayer;

    data.enemyPlayerId = String(idEnemyPlayer);

    alert(data.playerId+" player id fight enemey with id:" + idEnemyPlayer);

    var obj = JSON.stringify(data);

    axios.post(this.state.urlD,obj); // send ajax object to server

}





render() {
  var urlD = 'https://35.241.198.186:80';
  var dataCookie = {};

  dataCookie.idPlayer="5bf1d5a3b373a15628ea2b81";
  dataCookie.numberPixelPerMeter="1";
  dataCookie.updateFrequency="4000";
  dataCookie.autozoom="on";
  dataCookie.typeSignal= null;
  dataCookie.longitude ="4.361721";
  dataCookie.latitude ="50.850346";

  document.cookie = JSON.stringify(dataCookie);

  return(
    <div id="body">
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>

    <button onClick={this.increaseNumberPixelPerMeter}>Enlarge Radar!</button>
    <button onClick={this.decreaseNumberPixelPerMeter}>Reduce Radar!</button>
    <button onClick={this.sendSpecialSignal}>send Special Signal</button>
    <button onClick={this.sendHandShake}>send HandShake</button>
    <button onClick={this.autozoom}>AutoZoom!</button>
    <button onClick={this.increaseUpdateFrequency} id="increaseFrequencyButton">Increase update frequency!</button>
    <button onClick={this.decreaseUpdateFrequency} id="decreaseFrequencyButton">Decrease update frequency!</button>
    <input type="text" id="idPlayer" type="submit" value=""/>


    <h1 id="typeSignal"></h1>

    <div id="parentRadar">
        <div id="radar" ></div>
    </div>
    </div>

  );
}

}

export default Radars;
