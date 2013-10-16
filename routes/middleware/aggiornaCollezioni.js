//var utils = require('./utils');

function aggiornaCollezioni(db, dbName){
	db.collectionNames(function(err, items) {
				
				var names = [];
				
				for(var i = 0; i < items.length; i++){
					var coll = utils.parseCollectionName(items[i].name);
	      			names.push(coll.name);
				}
				names.sort();
				collection[dbName] = names;
				//console.log(collection);
			});
};

module.exports = aggiornaCollezioni; 