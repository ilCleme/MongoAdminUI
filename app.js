/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , mongodb = require('mongodb');

var _ = require('underscore'); 

var cons = require('consolidate');
var swig = require('swig');
var swigFilters = require('./filters');
var http = require('http');
var utils = require('./utils');
var config = require('./config');
var path = require('path');

var app = express();

var MongoStore = require('connect-mongo')(express);
var server = http.createServer(app);
app.engine('html', cons.swig);

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'html');
  app.set('view options', {layout: true});
  app.use("/public", express.static(__dirname + '/public'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.favicon('./public/images/favicon.ico')); 
  app.use(express.cookieParser());
  app.use(express.session({
	  secret: 'mattia',
	  cookie:{ expires: false },
      store: new MongoStore({
        db: 'local',
		collection: 'session'
      }),
	  expires:60000
    }));
  app.use(app.router);
  swig.setDefaults({ cache: false });
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

/*app.configure('production', function(){
  app.use(express.errorHandler());
});*/


mainDb = {}; //dati connessione...
adminDb = {};
collection = {}; //elenco collezioni...
databases = []; //elenco database...
connessioni = []; //elenco dati connessioni singoli database...

//Connessione a istanza MongoDB
connetti = function(URL, server, mongoClient, next){
	mongoClient.connect(URL,function(err,db){
		if(err){
			next(err);
		} else {
			console.log("Database connesso!!");
			mainDb = db;
			recuperoInfo(mainDb);
			setTimeout(next(),1000);
		}
	});
};

/*
*	Recupero informazioni sui database disponibili
*/
recuperoInfo = function(db){
	adminDb = db.admin();
	adminDb.listDatabases(function(err, dbs){
		for(var data in dbs.databases){
			var dbName = dbs.databases[data]['name'];
			
			if(dbName == 'local'){
				continue;
			}
			
			databases.push(dbName);
			connessioni[dbName] = mainDb.db(dbName);
			aggiornaCollezioni(connessioni[dbName], dbName);
		}
		databases.sort();
	}); 
}    

/*
*  Recupero informazioni sulle collezioni presenti nei database disponibili
*/
aggiornaCollezioni = function(db,dbName){
		db.collectionNames(function(err, items) {
			
			var names = [];
			
			for(var i = 0; i < items.length; i++){
				var coll = utils.parseCollectionName(items[i].name);
      			names.push(coll.name);
			}
			names.sort();
			collection[dbName] = names;
			
		});
};

app.param('database', function(req, res, next, id) {

  req.dbName = id;
  res.locals.dbName = id;
  req.mainDb = mainDb;

  next();
});

app.all('*', function(req, res, next) {
  req.adminDb = adminDb;
  next();
});

// Routes
require('./routes/index')(app);
require('./routes/database')(app);
require('./routes/collection')(app);
require('./routes/document')(app);
app.listen(8000, function(){
	console.log("Express server listening on port 8000...");
  //console.log("Express server listening on port %d in %s mode", server.address(), app.settings.env);
});
