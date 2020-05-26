//TEMPORARY!! USED FOR LOCAL TESTING ONLY TO AVOID CORS BLOCKING!!!
var express = require('express');
var app = express();

//setting middleware
app.use(express.static(__dirname)); //Serves resources from public folder


var server = app.listen(8888);