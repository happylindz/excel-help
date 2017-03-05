let express = require('express');
let path = require('path');
let fs = require('fs');
let queryString = require('querystring')
let bodyParser = require('body-parser');
let session = require('express-session');
let app = express();
let routes = require("./routes/index.js");

app.use(bodyParser.urlencoded({
  extended: false,
  limit: '50mb',
  parameterLimit: 1000000
}));
app.use(bodyParser.json({
	limit: '50mb'
}));
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 3600000 }
}));

app.use(express.static(__dirname + '/public'));
app.set('views', './views');
app.set('view engine', 'ejs');
app.use("/", routes);


app.listen(3001, function() {
	console.log("Server listening on port 3001");
});