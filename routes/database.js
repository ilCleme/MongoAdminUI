/*
* Database Routes
* Gestisce le chiamate alle pagine /db, sia GET che POST.
* Permette di gestire l'inserimento e la cancellazione di un database.
*/

var _ = require('underscore');  //funzioni utili per Array e Collezioni
var async = require('async'); //funzioni utili per il Flow Control
var mongodb = require('mongodb');
var path = require('path');

var parseName = require('./middleware/parseName');

module.exports = function(app) {
	
	//Genera elenco database presenti su server
	app.get('/db', function(req, res){
		console.log('GET /db');
		var data = {};
		
		if(databases.length == 0){
			data.err = "Non ci sono database";
		}
		
		adminDb.serverStatus(function(err,info){
			mainDb.stats(function(err, stat){
				if(err){
					console.log(err);
				} else {	
					data = {
						database: databases,
						err: null,
						dbStats: stat,
						info :info	
					};
					res.render('index', data);
				}
			})
		});
		
	});
	
	//Gestisce l'inserimento di un nuovo database
	app.post('/db', parseName, function(req, res){ 
		console.log('POST /db');
		
		var nomeDb = req.nomeDb;
		
		var db = mainDb.db(nomeDb);
		
		databases.push(nomeDb);//Inserisco nome database nell'elenco
		databases.sort(); //ordino...
		
		connessioni[nomeDb] = db; //aggiungo dati connessione nell'array elenco
		
		db.createCollection("test", function(err,collection){
			db.dropCollection("test", function(err, coll){
				if(err){
					console.log("Errore cancellazione"+ err);
				} else {
					console.log("Creato Database "+nomeDb);
					res.redirect('db');
				}
			});
		});
		
	});
	
	//Gestisce la cancellazione di un database
	app.del('/db', function(req, res){
		console.log('DEL /db');
		
		console.log("Cancello database "+req.body.dbdel);
	
		var dbdel = req.body.dbdel;
		var db = connessioni[dbdel];
		
		db.dropDatabase(function(err, drop){
			if(err){
				console.log(err);
				res.redirect('db');
			} else {
				databases = _.without(databases, dbdel);
				connessioni[dbdel] = null;
				res.redirect('db');
			}
		});
	});
	
}