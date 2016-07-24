function infoCollection (req, res, next){
	
	var dbName = req.params.database;
	var db = connessioni[dbName];
	var statistiche = new Array();
	
	for(coll in collection[dbName]){
		collectName = collection[dbName][coll];
		db.collection(collectName, function(err, collect){
			collect.stats(function(err, stat){
				collect.isCapped(function(err, capped){
					var info = stat;
					//console.log(capped);
					info.isCapped = capped;
					statistiche.push(info);
				})
			});
		});
		
	}
	
	setTimeout(function(){
		statistiche.sort(function(a, b){ //personalizzo funzione di sort per ordinare array di oggetti
			var nameA=a.ns.toLowerCase(), nameB=b.ns.toLowerCase()
 		   	if (nameA < nameB) //sort string ascending
 		   		return -1 
 			if (nameA > nameB)
  		  	return 1
 		   	
			return 0 //default return value (no sorting)
		});
		
		req.statistiche = statistiche;
		
		next();
	}, 1000);
}

module.exports = infoCollection;
