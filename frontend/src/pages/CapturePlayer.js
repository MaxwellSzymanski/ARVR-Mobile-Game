import React from 'react';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import { Redirect } from 'react-router';
import { getFeatureVector, getFVMatch } from '../facerecognition/FaceRecognition';
import swal from '@sweetalert/with-react';
import SocketContext from "../socketContext";

class CapturePlayer extends React.Component {

  state = {
    redirect : false }

  setRedirect = () => {
      this.setState({redirect: true})
    }

  renderRedirect = () => {
    if (this.state.redirect) {return <Redirect to="/captureResult" />}
  }


  async onTakePhoto (dataUri) {

      var photoSrc = dataUri;
      var photo = new Image;
      photo.src = photoSrc;
      console.log(photo);

      var fv = await getFeatureVector(photo);

      if (fv === null) {
          console.log("No face detected!")
          swal({
              title: "No face detected",
              text: "Make sure the target is exposed to enough light.",
              icon: "warning",
              button: "try again!",
          });
      }

      else {
          localStorage.setItem("PhotoOfPlayer", dataUri);
          localStorage.setItem("fv", fv);
          this.context.emit('getFVfromDB');
      }
  }

  this.context.on('sentFVfromDB', (results) => {
      let matchingPlayerId = getMatchingPlayerFromFV(results);
      if (matchingPlayerId != null) {
        localStorage.setItem("matchingPlayerId", matchingPlayerId);
        this.setRedirect();
      }
      //else if (matchingPlayerId = playerId){ "You can't capture yourself!" }
      else {
        swal({
            title: "Unkown Person",
            text: "The Person in the photo is NOT a player",
            icon: "warning",
            button: "try again!",
        });

      }
  });

  async function getMatchingPlayerFromFV(results) {
    console.log(results)
    console.log(results.featureVector)
    console.log(results._id)
    console.log(results[0]._id)
    let fv1 = localStorage.getItem("fv");
    let minDist = 1;
    let index = null;
    const threshold = 0.52;
    for (i = 0; i < results.length; i++) {
      let fv2 = Object.values(results[i].featureVector);
      let dist = getFVDistance(fv1, fv2)
      if (minDist > dist && dist <= threshold) {
        minDist = dist;
        index = i;
      }
    }
    if (index != null) {
      return (results[i]._id);
    }
    else return null;
  }


  async function showCapturedPlayer(id) {
    this.context.emit('getCapturedPlayerStats', id);
  }

  this.context.on('sentCapturedPlayerStats', (stats) => {

  });


  //Code for in the server
  /*    socket.on('getPlayerEntry', function(name, fv) {
          console.log('received player entry from: ' + name);
          addPlayerEntry(name, fv);
      });

      socket.on('getFVfromDB', function() {
          getFeatureVectorsFromDB(function(result) {
            socket.emit('sentFVfromDB', result);
          })
      });

      socket.on('addToJSON', function(json, callback) {
          fs.writeFile('testFeatureVectors.json', json, 'utf8', callback);
      });
  }); */

  //MongoDB code
  /* var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://team12:mongoDBteam12@35.241.198.186:27017/?authMechanism=SCRAM-SHA-1&authSource=userdb";

  var names;

  function addPlayerEntry(name, fv) {
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("userdb");
      var myobj = { username: name , featureVector: fv };
      dbo.collection("facerecognition").insertOne(myobj, function(err, res) {
        if (err) throw err;
        db.close();
      });
    });
  }

  async function getCapturedPlayerStats(callBack, id) {
    MongoClient.connect(url, async function(err, db) {
      if (err) throw err;
      var dbo = db.db("userdb");
      dbo.collection("facerecognition").find({id}, { projection: {image: 1, username: 1, level: 1, attack: 1, defense: 1, health: 1} }).toArray(function(err, result) {
        if (err) throw err;
        db.close();
        return callBack(result);
      });
    });
  }

  async function getFeatureVectorsFromDB(callBack) {

    MongoClient.connect(url, async function(err, db) {
      if (err) throw err;
      var dbo = db.db("userdb");
      dbo.collection("facerecognition").find({}, { projection: { _id: 1, username: 1, featureVector: 1 } }).toArray(function(err, result) {
        if (err) throw err;
        db.close();
        return callBack(result);
      });
    });
  } */



  render () {
    return (
      <div className="background">
        {this.renderRedirect()}
        <div className="polaroid">
            <Camera
                onTakePhoto = { (dataUri) => { this.onTakePhoto(dataUri); } }
                isImageMirror = {true}
            />
        </div>
      </div>
    );
  }
}

CapturePlayer.contextType = SocketContext;
