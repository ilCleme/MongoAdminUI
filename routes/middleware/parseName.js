var _ = require('underscore');

function parseName (req, res, next){
	
	var newdb = req.body.newDb; //ricavo stringa inserita...
	newdb = newdb.split(' ');
	var nomeDb = "";
	
	//ricompongo stringa senza spazi vuoti
	for(var i in newdb){
		nomeDb = nomeDb + newdb[i];
	}
	
	
	if ( _.indexOf(databases, nomeDb, true) > -1 ){
		data = {
			title : 'Index',
			database: databases,
			error: "Il nome scelto è già stato utilizzato"
			//dbStats: stat,
			//info :info	
		};
		res.render('index', data);
	} else {
		req.nomeDb = nomeDb; //passo nome del nuovo db all'oggetto req
		next();
	}
	
}

module.exports = parseName;
