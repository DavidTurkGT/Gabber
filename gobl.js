const express = require('express');
const router = require('./routes/router');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const validator = require('express-validator');
const session = require('express-session');
const morgan = require('morgan');

const app = express();

app.engine('mustache', mustacheExpress());
app.set('views','./views');
app.set('view engine', 'mustache');
app.set('layout', 'layout');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(validator());

app.use(morgan('dev'));

app.use(session({
  secret: 'cornbread',
  resave: false,
  saveUninitialized: false
}));

app.use(router);

app.listen(3000, function(){
  console.log("App running on localhost:3000")
});
