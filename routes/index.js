/*
 * GET home page.
 */
var MongoClient = require('mongodb').MongoClient
  , Server = require('mongodb').Server
  , assert = require('assert');


module.exports = function(app){
	
	app.get('/', function(req, res){
		if(!req.session.isLogged) {
			console.log('GET /');
			res.render('home');
		} else {
			console.log('GET /db');
			res.redirect('db');
		}
	});
	
	app.post('/', function(req, res){
		console.log('POST /');
		
		req.session.isLogged = true;
		req.session.numhost = req.body.numhost;
		req.session.numport = req.body.numport;
		
		req.session.cookie.expires = 60000;
		
		var server = new Server(req.body.numhost, req.body.numport);
		var mongoClient = new MongoClient(server);
		
		var URL = "mongodb://"+req.body.numhost+":"+req.body.numport+"/local";
		//var URLform = "mongodb://"+req.body.numhost+":"+req.body.numport;
		
		connetti(URL, server, mongoClient, function(err, next){
			if(err){
				var data = {
					err:"Impossibile connettersi al database specificato"
				}
				res.render('home',data);
			} else {
				console.log("Connessione Effettuata");
				res.redirect('db');
			}
		});
	});
	
}