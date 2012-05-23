(function () {
	window.databaseHelper = {};

	var db;
	databaseHelper.loadDb = function () {
		db = window.openDatabase("nomnomnomXP", "1.0", "NomNomNomXP Database", 1000000);
	};
	databaseHelper.saveSubs = function (subs) {
		//@TODO: we can reduce the subs object's size.
		var data = Base64.encode(JSON.stringify(subs));
		db.transaction(function(tx){
			//we will want to flesh this out if we ever start notifications.
			tx.executeSql('CREATE TABLE IF NOT EXISTS SUBS (data)');
			tx.executeSql('DELETE FROM SUBS');
			tx.executeSql('INSERT INTO SUBS (data) VALUES (\''+ data + '\')');
		}, databaseHelper.error, databaseHelper.success);

    };
    databaseHelper.loadSubs = function (callback) {
    	db.transaction(function(tx){
		    tx.executeSql('SELECT * FROM SUBS', [], querySuccess, databaseHelper.error);
    	}, databaseHelper.error);
    	
		function querySuccess(tx, results) {
			var result = JSON.parse(Base64.decode(results.rows.item(0).data));
			callback(result);
		}
    };

    databaseHelper.error = function (tx, error){
    	console.error("ERROR", error, tx);
    };
    databaseHelper.success = function (){
    	console.log("SQL Success");
    };


}());

