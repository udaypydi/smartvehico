var express = require('express')
var bodyParser = require('body-parser');
var app = express();
var MongoClient = require('mongodb').MongoClient
var passwordUtil = require('./utils/passwordSender.js');
var db;


MongoClient.connect("mongodb://uday_pydi:Itsmylife1@ds061158.mlab.com:61158/smart_vehico", (err, database) => {
   if (err)
   	throw err
   else
   {
	db = database;
	console.log('Connected to MongoDB');
	app.listen(3000, '192.168.1.6');
   }
 });

 app.use(bodyParser.urlencoded({ extended: false }))
 app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.post('/authenticate_user', (req, res) => {
  var query = {vehicleNumber: req.body.vehicleNumber};
  db.collection("vehicle_details").find(query).toArray((err, result) => {
    if (err) throw err;
    res.send(JSON.stringify(result));
  });
});

app.post('/post_vehicle_details', (req, res) => {

  db.collection('vehicle_details').insert(req.body, function (err, result) {
     if (err)
        res.send('Error');
     else {
      res.send(JSON.stringify({ status: 200, statusText: 'OK' }));
     }
 })
});

app.get('/get_vehicles_details', (req, res) => {
  var query = {vehicleNumber: req.query.vehicleNumber};
  db.collection("vehicle_details").find(query).toArray(function(err, result) {
    if (err) throw err;
    res.send(JSON.stringify(result));
  });
})

app.post('/vehicle_location', (req, res) => {
  db.collection("vehicle_location").find(req.body).toArray(function(err, result) {
    if (err) throw err;
    if(result.length === 0) {
      db.collection('vehicle_location').insert(req.body, function (err, result) {
         if (err)
            res.send('Error');
         else
           res.send(JSON.stringify({ status: 200 }));
     });
    }
  });
})

app.get('/get_vehicle_current_location', (req, res) => {
  var query = {vehicleNumber: req.query.vehicleNumber};
  db.collection("vehicle_location").find(query).toArray(function(err, result) {
    if (err) throw err;
    res.send(JSON.stringify(result[result.length - 1]));
  });
});

app.get('/get_all_vehicles', (req, res) => {
  db.collection("vehicle_details").find().toArray(function(err, result) {
    if (err) throw err;
    res.send(JSON.stringify(result));
  });
});

app.post('/trip_count', (req, res) => {
  var query = req.body.vehicleNumber;
  db.collection("vehicle_trips").find(query).toArray(function(err, result) {
    if (err) throw err;
    req.body.coords.tripCount = result.length + 1;
    req.body.coords.startingCoordsLatitude = req.body.startingCoords.latitude;
    req.body.coords.startingCoordsLongitude = req.body.startingCoords.longitude;
    req.body.coords.tripEndTime = +new Date();
    console.log(+new Date());
    db.collection('vehicle_trips').insert(req.body.coords, function (err, result) {
       if (err)
          res.send('Error');
       else
         res.send(JSON.stringify({ status: 200 }));
   });
  });
});

app.get('/get_vehicle_trip_details', (req, res) => {
  var query = {vehicleNumber: req.query.vehicleNumber};
  db.collection("vehicle_trips").find(query).toArray(function(err, result) {
    if (err) throw err;
    res.send(JSON.stringify(result));
  });
});

app.post('/post_user_details', (req, res) => {
  var query = { phoneNumber: req.body.phoneNumber };
  db.collection("user_details").find(query).toArray(function(err, result) {
    if (err) throw err;
    if(result.length > 0) {
      res.send(JSON.stringify(result));
    } else {
      db.collection('user_details').insert(req.body, function (err, result) {
         if (err)
            res.send('Error');
         else
           res.send(JSON.stringify({ status: 200 }));
     });
    }
  });
});

app.post('/get_user_details', (req, res) => {
  var query = { phoneNumber: req.body.phoneNumber};
  db.collection("user_details").find(query).toArray(function(err, result) {
    if (err) throw err;
    res.send(JSON.stringify(result));
  });
})
