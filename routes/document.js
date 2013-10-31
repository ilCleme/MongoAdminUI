/*
*	Document Routes
*/

var json = require('../json');
//var JSON = require('JSON');
var _ = require('underscore');
var ObjectID = require('mongodb').ObjectID;
var BSON = require('mongodb').BSONPure;

module.exports = function(app) {

	app.get('/db/:database/:collection', function(req,res){
		console.log('GET /db/'+req.params.database+'/'+req.params.collection);
		
		var dbName = req.params.database;
		var collName = req.params.collection;
		var collection = [];
		var data = {};
		
		
		connessioni[dbName].collection(collName, function(err, coll) {
    		if (err) {
      			console.log('C\'è stato un errore: '+err);
    		} 
    		
    		collection = coll;

  		});
  	
  		var query_options = {};
  		var query = {};

  		collection.find(query, query_options).toArray(function(err, items) {
    		collection.stats(function(err, stats) {
				
      			var docs = [];
      			var id = [];
      			
      			if(items.length==0){
      				var noDocs = 'Non ci sono documenti in questa collezione';
				}
				
      			for(var i in items) {
        			docs[i] = items[i];
        			items[i] = json.stringify(items[i], null, '\n');
      			}

      			data = {
					collect: collName,
					title: req.params.collection,
      				database: databases,
      				db: dbName,
        			documents: items, //Docs converted to strings
        			docs: docs, //Original docs
        			stats: stats,
        			err: noDocs
        			//id : id
        		};

      			res.render('collection', data);
      		
    		});
   		 });
	
	});
	
	
	/*
	* Gestisce l'inserimento di un nuovo documento nel database
	*/
	app.post('/db/:database/:collection/new', function(req, res){
		console.log('POST /db/'+req.params.database+'/'+req.params.collection+'/new');
		
		
		var dbName = req.params.database;
		var collName = req.params.collection;
		var doc = req.body.docName;
		doc = {document: doc};
		var document = JSON.stringify(doc);
		var oid = new BSON.ObjectID();
		var noInsert;
		var db = connessioni[dbName];
		
		doc._id = oid;
		
		/*db.collection(collName, function(err, col){
			col.stat(function(err, stat){
				console.log(stat);
			});
		});*/
		
		db.collection(collName).insert(doc, function(err, result) {
  			if(err){
  				console.error(err);
  				noInsert = "Impossibile inserire il documento \"" + docName +"\"" ;
  				var data = {err : noInsert};
  				res.render('collection', data);
  			} else {
				var URL = '/db/'+dbName+'/'+collName;
  				res.redirect(URL);
  			}
  		});
  		
  		/*db.collection(collName).find().toArray(function(err,items){
  			db.collection(collName).stats(function(err, stats) {

      			var docs = [];

      			for(var i in items) {
        			docs[i] = items[i];
        			items[i] = json.stringify(items[i], null, '\n');
      			}

        		var URL = '/db/'+dbName+'/'+collName;

      			res.redirect(URL);
      		
    		});
  		});*/
		
	});
	
	/*
	* Gestisce la cancellazione di un documento dalla collezione corrente
	*/
	app.del('/db/:database/:collection', function(req, res){
		console.log('DEL /db/'+req.params.database+'/'+req.params.collection);
		
		//ObjectID document to delete, name of database, name of collection's document
		var docId;
		//console.log(req.body.docId.length);
		/*if (req.body.docId.length > 24) {
    		//Convert id string to mongodb object ID
      		docId = req.body.docId;
      		console.log(docId);
    	} else {*/
    		docId = new ObjectID(req.body.docId);
    		console.log(docId);
    	//}
		
		var dbName = req.params.database;
		var collName = req.params.collection;
		
		var db = connessioni[dbName]; //connessione al db
		
		db.collection(collName).remove({'_id':docId}, function(err, numDocRem){
			if(err){
				console.log(err);
				var data = {
					database: databases,
					db: dbName,
      				coll: collName,
					err : "Non è stato possibile eliminare "
					};
				res.render('collection',data);
			}
			
			if(numDocRem == 0){
				console.log("Cancellato: "+numDocRem);
				var data = {
					database: databases,
					db: dbName,
      				coll: collName,
					err : "Il documento selezionato non è stato eliminato"
					};
				res.render('collection',data);
			} else {
				var URL = '/db/'+dbName+'/'+collName;
				res.redirect(URL);
				/*db.collection(collName).find().toArray(function(err,items){
  					db.collection(collName).stats(function(err, stats) {
	      				var docs = [];
	
		      			for(var i in items) {
		        			docs[i] = items[i];
		        			items[i] = json.stringify(items[i], null, '\n');
		        			//console.log(docs[i]);
		      			}
	
		      			var data = {
		      				database: databases,
		      				db: dbName,
		      				coll: collName,
		        			title: collName,
		        			documents: items, //Docs converted to strings
		        			docs: docs, //Original docs
		        			stats: stats
		        		};
		
		      			res.render('collection', data);
      				});
    			});*/
        	}	
		});	
	});

};