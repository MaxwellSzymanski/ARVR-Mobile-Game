const express = require('express')
const path = require('path')
const { get } = require('request')
var http = require('http');


const app = express()

const server = http.createServer(app)
// Loading socket.io
var io = require('socket.io').listen(server);

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const viewsDir = path.join(__dirname, 'views')
app.use(express.static(viewsDir))
app.use(express.static(path.join(__dirname, './public')))
app.use(express.static(path.join(__dirname, '../weights')))
app.use(express.static(path.join(__dirname, '../dist')))
app.use(express.static(path.join(__dirname, './node_modules/axios/dist')))

app.get('/peno', (req, res) => res.sendFile(path.join(viewsDir, 'GoW/PenO.html')))

server.listen(3000, () => console.log('Listening on port 3000!'))

//connection between client and server.js
io.sockets.on('connection', function (socket) {
    console.log('A client is connected!');

    socket.on('getPlayerEntry', function(name, fv) {
        console.log('received player entry from: ' + name);
        addPlayerEntry(name, fv);
    });

    socket.on('getPlayerMatch', function() {
        getFeatureVectorsFromDB(function(result) {
          socket.emit('sendFV', result);
        })
    });
});

//MongoDB code
var MongoClient = require('mongodb').MongoClient;
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

async function getFeatureVectorsFromDB(callBack) {

  MongoClient.connect(url, async function(err, db) {
    if (err) throw err;
    var dbo = db.db("userdb");
    dbo.collection("facerecognition").find({}, { projection: { _id: 0, username: 1, featureVector: 1 } }).toArray(function(err, result) {
      if (err) throw err;
      //console.log(result);
      db.close();
      return callBack(result);
    });
  });
}
