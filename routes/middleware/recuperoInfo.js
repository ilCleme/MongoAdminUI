//var aggiornaCollezioni = require('./aggiornaCollezioni');

function recuperoInfo(db){

	adminDb = db.admin();
	adminDb.listDatabases(function(err, dbs){
		databases = []; //elenco database...
		connessioni = [];
		//console.log("Database:");
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

module.exports = recuperoInfo;   