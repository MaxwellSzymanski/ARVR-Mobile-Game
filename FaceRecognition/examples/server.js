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

app.post('/fetch_external_image', async (req, res) => {
  const { imageUrl } = req.body
  if (!imageUrl) {
    return res.status(400).send('imageUrl param required')
  }
  try {
    const externalResponse = await request(imageUrl)
    res.set('content-type', externalResponse.headers['content-type'])
    return res.status(202).send(Buffer.from(externalResponse.body))
  } catch (err) {
    return res.status(404).send(err.toString())
  }
})

//connection between client and server.js
io.sockets.on('connection', function (socket) {
    console.log('A client is connected!');

    socket.on('getPlayerEntry', function(name, fv) {
        console.log('received player entry from: ' + name);
        addPlayerEntry(name, fv);
    });

    socket.on('getPlayerMatch', function() {
        getFeatureVectorsFromDB(function(result) {
          console.log(result)
          socket.emit('sendFV', result);
        })
    });
});

//MongoDB code
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var names;

function addPlayerEntry(name, fv) {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("gow");
    var myobj = { username: name , featureVector: fv };
    dbo.collection("players").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("document inserted");
      db.close();
    });
  });
}

async function getFeatureVectorsFromDB(callBack) {

  MongoClient.connect(url, async function(err, db) {
    if (err) throw err;
    var dbo = db.db("gow");
    dbo.collection("players").find({}, { projection: { _id: 0, username: 1, featureVector: 1 } }).toArray(function(err, result) {
      if (err) throw err;
      //console.log(result);
      db.close();
      return callBack(result);
    });
  });
}
