/*
*	Collection Routes
*/

var json = require('../json');
var _ = require('underscore');
//var ObjectID = require('mongodb').ObjectID;
//var BSON = require('mongodb').BSONPure;

var infoCollection = require('./middleware/infoCollection');

module.exports = function(app) {
	
	//Genera elenco di collezioni presenti su database scelto
	app.get('/db/:database', infoCollection, function(req, res){
		console.log('GET /db/'+req.params.database);
		
		var statistiche = req.statistiche;
		
		var dbName = req.params.database;
		var db = connessioni[dbName];
		
		
 	 	var data = {
    		db: dbName,
    		database: databases,
			statistiche: statistiche
  			};
  			
  		if (collection[dbName] == null){
  			data.err = "Non ci sono collezioni in questo database";
  		} else {
  			data.colls = collection[dbName];
  		}
		
  		//console.log(data);
  		res.render('database', data);
	});
	
	
	//Gestisce l'inserimento di una nuova collezione in un database
	app.post('/db/:database', function(req, res){
		console.log('POST /db/'+req.params.database);
		
		var db = connessioni[req.dbName];
		var dbColl = req.body.collName;
		var dbName = req.dbName;
		
		
		db.createCollection(dbColl, {capped:false}, function(err,coll){
			if(err){
				
				var data = {
					db: dbName,
					database: databases,
					colls : collection[dbName],
					err : "Impossibile creare collezione " +dbColl
					}
					
				console.log(err);
				
			} else {
				
				//collect = collection[dbName];
				try{
					collection[dbName].push(dbColl);
					collection[dbName].sort();
				} catch(err){
					console.log(err);
					aggiornaCollezioni(db,dbName);
					res.redirect('/db/'+dbName);
				}
				
				var data = {
    				db: dbName,
    				database: databases,
    				colls : collection[dbName]
  				}
				
  				console.log(data);
				res.redirect('/db/'+req.params.database);
				
			}
		})
	});
	
	
	//Gestisce la cancellazione di una collezione da un database
	app.del('/db/:database',function(req,res){
		console.log('DEL /db/'+req.params.database);
		
		var db = connessioni[req.dbName];
		var dbColl = req.body.collName;
		var dbName = req.dbName;
		
		db.dropCollection(dbColl, function(err, result){
			if(!err){
				console.log("Collezione eliminata! ");
				collection[dbName] = _.without(collection[dbName], dbColl);
			} else {
				console.log(err);
			}
			
			if(collection[dbName].lenght < 1){
				var data = {
					database: databases,
	    			db: dbName,
	    			err: "Non ci sono collezioni in questo database"
	  			}
			} else {
				var data = {
					database: databases,
    				db: dbName,
    				colls: collection[dbName]
  				}
			}
  			
			res.redirect('/db/'+req.params.database);
		});
	});
};