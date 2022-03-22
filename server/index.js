const express = require('express');
let app = express();
let { save, getTop25 } = require('../database');
let getReposByUsername = require('../helpers/github');

app.use(express.json());
app.use(express.static(__dirname + '/../client/dist'));

app.post('/repos', function (req, res) {
  console.log(req.body);
  getReposByUsername(req.body.term)
    .then(result => save(result.data))
    .then(result => result.length)
    .catch(err => err.result.result.nInserted)
    .then(nInserted => {
      console.log(`Items Inserted: ${nInserted}`);
      res.send({nInserted});
    });
});

app.get('/repos', function (req, res) {
  getTop25()
    .then((result) => {
      res.send(result);
    });
})

let port = 1128;

app.listen(port, function() {
  console.log(`listening on port ${port}`);
});

