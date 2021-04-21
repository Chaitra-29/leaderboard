const express = require('express');
//const history = require("connect-history-api-fallback");
const cors = require("cors");
const fetch = require('node-fetch');
const path = require('path');

const app = express();

//app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../dist')));
//app.use(express.static('/path/to/dist/directory'));

//app.use('/', history())

var corsOptions = {
  origin: "http://localhost:8080"
};

app.use(cors(corsOptions));

const clientID = "54287";
const clientSecret = "edee55f0ee48c484314874c9b18a33b5e4a135bf";

// app.get('/', (req,res) => {
//   res.sendFile(path.join(__dirname, '../app/build/index.html'));
// });
app.get('/api/exchange_token', (req,res) => {
  const token = req.query.code;
  fetch(`https://www.strava.com/api/v3/oauth/token?client_id=${clientID}&client_secret=${clientSecret}&code=${token}&grant_type=authorization_code`,{
    method: "POST",
    headers: {
      accept: 'application/json'
    }
  }).then(response => response.json())
  .then(data => { 
    //console.log(data)
    const accessToken = data.access_token;
    res.redirect(`http://localhost:8080/leaderboard?accessToken=${accessToken}`)
    //res.send(``) 
    //res.sendFile(path.join(__dirname, '../app/build/index.html'));
  })
});
  
// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});