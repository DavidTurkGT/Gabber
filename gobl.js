const express = require('express');
const router = require('./routes/router');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const validator = require('express-validator');
const session = require('express-session');
const morgan = require('morgan');
const pg = require('pg');

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

pg.defaults.ssl = true;
pg.connect(process.env.DATABASE_URL, function(err, client) {
  if (err) throw err;
  console.log('Connected to postgres! Getting schemas...');

  client
    .query('SELECT table_schema,table_name FROM information_schema.tables;')
    .on('row', function(row) {
      console.log(JSON.stringify(row));
    });
});

app.use(router);

app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
  console.log("App running on " + app.get('port'));
});
