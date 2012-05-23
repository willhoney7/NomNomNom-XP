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

    function addArticlesToDb(array){
    	db.transaction(function(tx){
			
			//tx.executeSql('DROP TABLE IF EXISTS ARTICLES');
			tx.executeSql('CREATE TABLE IF NOT EXISTS ARTICLES (id, feed, read, data, imgs)');
			if(array.length > 1){
				var string = "INSERT INTO 'ARTICLES' SELECT '" + array[0].id + "' AS 'id', '" + array[0].origin.streamId + "' AS 'feed', '" + reader.isRead(array[0]) + "' AS 'read',  '" + Base64.encode(JSON.stringify(array[0])) + "' AS 'data', '' AS 'imgs'";
				for (var i = 1; i < array.length; i++) {
					string += " UNION SELECT '" + array[i].id + "', '" + array[0].origin.streamId + "', '" + reader.isRead(array[i]) + "', '" + Base64.encode(JSON.stringify(array[i])) + "', ''";
				};
				console.log(string);	
			} else {
				var string = 'INSERT INTO ARTICLES (id, feed, read, data, imgs) VALUES ("' + array[0].id + '", "' + array[0].origin.streamId + '", "' + reader.isRead(array[0]) + '", "' + Base64.encode(JSON.stringify(array[0])) + '", "")';
			}
			
			tx.executeSql(string);
			
		}, databaseHelper.error, function(){
			console.log("succcess");
			databaseHelper.loadArticles({read: "true"});
		});
    }

    databaseHelper.saveArticles = function (unreadArticles, readArticles, callback) {
    	addArticlesToDb(readArticles);
    	//if empty
    		//save ALL unread articles
    		//save past 3? days read articles
    	//else
    		//get array of articles
	    		//compare array of loaded unread articles to saved unread articles
	    			//extras from loaded go to array to be saved
	    			//extras from saved go to array to be deleted from db
	    		//compare array of loaded read articles to saved read articles
	    			//extras from loaded go to array to be saved
	    			//extras from saved go to array to be deleted from db

    	// (id, readstatus, date, data, imgs);
    	//save ALL unread articles
    	//mark articles as read as user goes through.
    	//on loads
    		//REMOVE all unread articles
    		//ADD all unread articles
    };

    databaseHelper.loadArticles = function (opts, callback) {
    	db.transaction(function(tx){
    		var string = 'SELECT * FROM ARTICLES';
    		if(opts){
    			string += " WHERE";
    			var keys = _.keys(opts);
    			var values = _.values(opts);
    			for (var i = keys.length - 1; i >= 0; i--) {
    				if(i !== keys.length - 1){
    					string += " AND";
    				}
    				string += " '" + keys[i] + "' = '" + values[i] + "'";
    			};
    		}

    		console.log(string);

		    tx.executeSql(string, [], querySuccess, databaseHelper.error);
    	}, databaseHelper.error);
    	
		function querySuccess(tx, results) {
			console.log(results.rows.length);
			console.log(results.rows.item(2));
			//var result = JSON.parse(Base64.decode(results.rows.item(0).data));
			//callback(result);
		}
    };

    databaseHelper.error = function (tx, error){
    	console.error("ERROR", error, tx);
    };
    databaseHelper.success = function (){
    	console.log("SQL Success");
    };


}());

