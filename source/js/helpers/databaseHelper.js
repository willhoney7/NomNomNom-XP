(function () {
	window.databaseHelper = {};

	var db;
	databaseHelper.loadDb = function () {
		db = window.openDatabase("nomnomnomXP_db", "1.0", "NomNomNomXP Database", 2000000);
		db.transaction(function(tx){
			//tx.executeSql('DROP TABLE IF EXISTS ARTICLES');
			tx.executeSql('CREATE TABLE IF NOT EXISTS ARTICLES (id unique, feed, read, starred, data, imgs)');
			tx.executeSql('CREATE TABLE IF NOT EXISTS SUBS (data)');
			//@TODO: check to make sure this works XP.
			tx.executeSql('CREATE TABLE IF NOT EXISTS QUEUE (id INTEGER PRIMARY KEY, data)');


		}, databaseHelper.error, databaseHelper.success);
	};

	databaseHelper.dumpData = function () {

		db.transaction(function(tx){
			tx.executeSql('DROP TABLE IF EXISTS ARTICLES');
			tx.executeSql('CREATE TABLE IF NOT EXISTS ARTICLES (id unique, feed, read, starred, data, imgs)');
			
			tx.executeSql('DROP TABLE IF EXISTS SUBS');
			tx.executeSql('CREATE TABLE IF NOT EXISTS SUBS (data)');
			
			tx.executeSql('DROP TABLE IF EXISTS QUEUE');
			tx.executeSql('CREATE TABLE IF NOT EXISTS QUEUE (id INTEGER PRIMARY KEY, data)');

		}, databaseHelper.error, databaseHelper.success);
	};

	databaseHelper.saveSubs = function (subs, callback) {
		//@TODO: we can reduce the subs object's size.
		var data = Base64.encode(JSON.stringify(subs));
		db.transaction(function(tx){
			//we will want to flesh this out if we ever start notifications.
			tx.executeSql('CREATE TABLE IF NOT EXISTS SUBS (data)');
			tx.executeSql('DELETE FROM SUBS');
			tx.executeSql('INSERT INTO SUBS (data) VALUES (\''+ data + '\')');
		}, databaseHelper.error, callback || databaseHelper.success);

    };
    databaseHelper.loadSubs = function (callback) {
    	db.transaction(function(tx){
		    tx.executeSql('SELECT * FROM SUBS', [], querySuccess, databaseHelper.error);
    	}, databaseHelper.error);
    	
		function querySuccess(tx, results) {
			if(results.rows.length > 0){
				var result = JSON.parse(Base64.decode(results.rows.item(0).data));
			}
			callback(result || []);
		}
    };

    function formatArticle (item) {

    	var condensedItem = {
			id: item.id,
			title: item.title,
			author: item.author,
			url: (item.alternate && item.alternate[0]) ? item.alternate[0].href : item.origin.htmlUrl || item.origin.streamId,
			feed: {
				title: item.origin.title,
				id: item.origin.streamId
			},
			updated: item.updated,
			content: (item.summary) ? item.summary.content || "": (item.content) ? item.content.content || "" : "",
			enclosure: item.enclosure,
			//_orig: _.clone(item) we may want to do this in the future
		};
		//condensedItem.strippedContent = htmlToText(condensedItem.content); in da future?
		condensedItem.preview = _(htmlToText(condensedItem.content)).prune(50);

		return condensedItem;

    }

    function addArticlesToDb(array, callback) {
    	if(array.length === 0){
    		callback();
    		return;
    	}

		var articleSets = _(array).chain().groupBy(function(item, index){ 
			return "set" + Math.floor(index/200); 
		}).toArray().value();

		var i = 0,
			iterate = function() {
				if (i < articleSets.length){
					_addArticlesToDb(articleSets[i], function () {
						console.log("WORKED?");
						i++;
						iterate();
					});
				} else {
					callback();
				}
			}

		iterate();
   
    }

    function _addArticlesToDb(array, callback){

    	db.transaction(function(tx){
			
			//tx.executeSql('DROP TABLE IF EXISTS ARTICLES');
			tx.executeSql('CREATE TABLE IF NOT EXISTS ARTICLES (id unique, feed, read, starred, data, imgs)');
			if(array.length > 1){
				//console.log(array[0]);
				var string = "INSERT INTO ARTICLES SELECT '" + array[0].id + "' AS id, '" + (array[0].origin.streamId) + "' AS feed, '" + reader.isRead(array[0]) + "' AS read, '" + reader.isStarred(array[0]) + "' AS starred,  '" + Base64.encode(JSON.stringify(formatArticle(array[0]))) + "' AS data, '' AS imgs";
				for (var i = 1; i < array.length; i++) {
					//console.log("isRead", reader.isRead(array[i]));
					string += " UNION SELECT '" + array[i].id + "', '" + (array[i].origin.streamId) + "', '" + reader.isRead(array[i]) + "','" + reader.isStarred(array[i]) + "', '" + Base64.encode(JSON.stringify(formatArticle(array[i]))) + "', ''";
				};
				//console.log(string);	
			} else {
				var string = 'INSERT INTO ARTICLES (id, feed, read, starred, data, imgs) VALUES ("' + array[0].id + '", "' + (array[0].origin.streamId) + '", "' + reader.isRead(array[0]) + '","' + reader.isStarred(array[0]) + '", "' + Base64.encode(JSON.stringify(formatArticle(array[0]))) + '", "")';
			}
			
			tx.executeSql(string);
			
		}, function(er){
			console.log("ADD ARTICLES FAILED", er);
		}, callback);
    }
    function removeArticlesFromDb(array, callback){
    	if(array.length === 0){
    		callback();
    		return;
    	}

    	db.transaction(function(tx){
			
			var string = "DELETE FROM ARTICLES WHERE id IN (";

			for (var i = array.length - 1; i >= 0; i--) {
				if(i !== array.length - 1){
					string += ",";
				}
				//string += " 'id' = '" + array[i].id + "'";
				string += "'" + array[i].id + "'";
			};
			string += ")";
 
			tx.executeSql(string);
			
		}, databaseHelper.error, callback);
    }



    function getItemsNotInAnotherArray (originalArray, anotherArray) {
    	var processedArray = [];
    	_.each(originalArray, function(obj){
			//check it if it exists

			//we assume the property we want to check is .id
			if(!_.find(anotherArray, function(foundObj){ return foundObj.id === obj.id })){
				processedArray.push(obj);
			}
		});
		return processedArray;
    }
    function getItemsInAnotherArray (originalArray, anotherArray) {
    	var processedArray = [];
    	_.each(originalArray, function(obj){
			//check it if it exists

			//we assume the property we want to check is .id
			if(_.find(anotherArray, function(foundObj){ return foundObj.id === obj.id })){
				processedArray.push(obj);
			}
		});
		return processedArray;
    }


    databaseHelper.saveArticles = function (downloadedArticles, callback) {
    	//addArticlesToDb(readArticles);
    	//addArticlesToDb(unreadArticles);

    	databaseHelper.loadArticles(null, function(loadedArticles){
    		//console.log(JSON.stringify(loadedArticles));

    		var savedUnreadArticles = [], 
    			savedReadArticles = [],
    			savedStarredArticles = [],
    			unreadArticles = downloadedArticles.unread,
    			readArticles = downloadedArticles.read,
    			starredArticles = downloadedArticles.starred;

    		_.each(loadedArticles, function(article){
    			if(reader.isStarred(article)){
    				savedStarredArticles.push(article);
    			} else if(reader.isRead(article)){
    				savedReadArticles.push(article);
    			} else {
    				savedUnreadArticles.push(article);
    			}
    		});

    		//console.log("savedReadArticles", savedReadArticles.length);
    		//console.log("savedUnreadArticles", savedUnreadArticles.length);
    		//console.log("savedStarredArticles", savedStarredArticles.length);

    		//add starred articles NOT saved
    		var starredToAdd = [].concat(getItemsNotInAnotherArray(starredArticles, savedStarredArticles));	
    						
    						//remove items that are saved that are no longer starred                       remove items that are already saved as unread articles or read articles
    		var starredToRemove = [].concat(getItemsNotInAnotherArray(savedStarredArticles, starredArticles), getItemsInAnotherArray(starredArticles, savedUnreadArticles), getItemsInAnotherArray(starredArticles, savedReadArticles), getItemsInAnotherArray(starredArticles, readArticles), getItemsInAnotherArray(starredArticles, unreadArticles));
    		console.log("starredToRemove", starredToRemove);
    		var arrayToAdd, arrayToRemove;
    		
    		arrayToAdd = [].concat(getItemsNotInAnotherArray(unreadArticles, savedUnreadArticles), getItemsNotInAnotherArray(readArticles, savedReadArticles), starredToAdd);
    		arrayToRemove = [].concat(getItemsNotInAnotherArray(savedUnreadArticles, unreadArticles), getItemsNotInAnotherArray(savedReadArticles, readArticles), starredToRemove);

    		console.log("removing these from the db", arrayToRemove.length);	

    		removeArticlesFromDb(arrayToRemove, function(){
	    		console.log("adding these to the db", arrayToAdd.length);
    			addArticlesToDb(arrayToAdd, callback);
    		});
    	
    	});
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

    function buildOrString (key, array) {
    	var string = " (";
    	for (var i = 0; i < array.length; i++) {
    		if(i > 0){
    			string += " OR";
    		}
    		string +=  " " + key + " = '" + array[i] + "'";
    	};
    	return string + ")";
    }
    databaseHelper.loadArticles = function (opts, callback) {
    	db.transaction(function(tx){
    		var string = 'SELECT * FROM ARTICLES';
    		if(opts && !_.isEmpty(opts)){
    			string += " WHERE";
    			var keys = _.keys(opts);
    			var values = _.values(opts);
    			for (var i = keys.length - 1; i >= 0; i--) {
    				if(i !== keys.length - 1){
    					string += " AND";
    				}
    				if(_.isArray(values[i])){
    					string += buildOrString(keys[i], values[i]);
    				} else {
	    				string += " " + keys[i] + " = '" + values[i] + "'";
    				}
 
    			};
    		}

    		//console.log(string);

		    tx.executeSql(string, [], querySuccess, databaseHelper.error);
    	}, databaseHelper.error);
    	
		function querySuccess(tx, results) {
			var array = [];

			for (var i = 0; i < results.rows.length; i++){
				array.push(results.rows.item(i));
			}
			callback(array);
			
			//console.log(results.rows.item(2));
			//var result = JSON.parse(Base64.decode(results.rows.item(0).data));
			//callback(result);
		}
    };

    databaseHelper.removeArticlesByFeed = function (feedId, callback) {

    	db.transaction(function(tx){
			
			var string = "DELETE FROM ARTICLES WHERE feed = '" + feedId + "'";

			tx.executeSql(string);
			
		}, databaseHelper.error, callback);
    };

    databaseHelper.markArticlesRead = function(array, callback, value) {

    	var toModify = {};
    	db.transaction(function(tx){
			
			var string = "UPDATE ARTICLES SET read = '" + ((value !== undefined) ? value: true) + "' WHERE",
				keyArray = [];

			_(array).each(function(article){
				keyArray.push(article.id);
				toModify[article.feed.id] = (toModify[article.feed.id] || 0) + (value !== undefined ? (value ? -1 : 1) : -1);
			});
			console.log("toModify",toModify);

			string += buildOrString("id", keyArray);
 
			console.log(string);

			tx.executeSql(string);

		}, databaseHelper.error, function () {

			databaseHelper.loadSubs(function(subs) {

				_.each(subs, function (subscription) {
					if (toModify[subscription.id] !== undefined) {
						subscription.count = (subscription.count || 0) + toModify[subscription.id];
						subs[0].count = (subs[0].count || 0) + toModify[subscription.id];
					} else if (subscription.feeds && subscription.feeds.length > 0) {
						_.each(subscription.feeds, function (feed) {
							if ((toModify[feed.id] !== undefined)) {
								subscription.count = (subscription.count || 0) + toModify[feed.id];
								feed.count = (feed.count || 0) + toModify[feed.id];
								subs[0].count = (subs[0].count || 0) + toModify[feed.id];
							}
						});
					}
				});

				console.log("SAVING THESE SUBS", subs);

				databaseHelper.saveSubs(subs, callback);
			});

		});
    };

     databaseHelper.markArticleStarred = function(item, callback) {

    	db.transaction(function(tx){
			
			var string = "UPDATE ARTICLES SET starred = '" + item.starred + "' WHERE id = '" + item.id + "'";
 
			console.log(string);

			tx.executeSql(string);

		}, databaseHelper.error, callback);

    };

    databaseHelper.queue = function (opts) {

    	var data = Base64.encode(JSON.stringify(opts));

		db.transaction(function(tx){
			tx.executeSql('CREATE TABLE IF NOT EXISTS QUEUE (id INTEGER PRIMARY KEY, data)');
			tx.executeSql('INSERT INTO QUEUE (id, data) VALUES (null, "' + data + '")');
		}, databaseHelper.error, databaseHelper.success);

    };
    databaseHelper.getQueue = function (callback) {
    	db.transaction(function(tx){
    		var string = 'SELECT * FROM QUEUE';

		    tx.executeSql(string, [], querySuccess, databaseHelper.error);
    	}, databaseHelper.error);
    	
		function querySuccess(tx, results) {
			var array = [];

			for (var i = 0; i < results.rows.length; i++){
				array.push(results.rows.item(i));
			}
			callback(array);
			
			//console.log(results.rows.item(2));
			//var result = JSON.parse(Base64.decode(results.rows.item(0).data));
			//callback(result);
		}
    };
    databaseHelper.clearFromQueue = function (id, callback) {
    	db.transaction(function(tx){
    		var string = 'DELETE FROM QUEUE WHERE id = ' + id;

		    tx.executeSql(string, [], callback, databaseHelper.error);
    	}, databaseHelper.error);
    	
    };

   	databaseHelper.test = function () {
    	var array = [];
    	//for (var i = 20 - 1; i >= 0; i--) {
    		array.push({id: "asbasbsdbasb" + 0, feed: ((Math.random() * 2) > 1) ? "dog" : "cat", read: false});
    		array.push({id: "asbasbsdbasb" + 1, feed: ((Math.random() * 2) > 1) ? "dog" : "cat", read: false});
    	//};

    	db.transaction(function(tx){
			
			//tx.executeSql('DROP TABLE IF EXISTS ARTICLES');
			tx.executeSql('CREATE TABLE IF NOT EXISTS ARTICLES (id unique, feed, read, data, imgs)');

			/*if(array.length > 1){
				var string = "INSERT INTO ARTICLES SELECT '" + array[0].id + "' AS id, '" + array[0].feed + "' AS feed, '" + array[0].read + "' AS read,  '" + Base64.encode(JSON.stringify(array[0])) + "' AS data, '' AS imgs";
				for (var i = 1; i < array.length; i++) {
					string += " UNION SELECT '" + array[i].id + "', '" + array[i].feed + "', '" + array[i].read + "', '" + Base64.encode(JSON.stringify(array[i])) + "', ''";
				};
				//console.log(string);	
			} else {
				var string = 'INSERT INTO ARTICLES (id, feed, read, data, imgs) VALUES ("' + array[0].id + '", "' + array[0].feed + '", "' + array[0].read + '", "' + Base64.encode(JSON.stringify(array[0])) + '", "")';
			}
			
			console.log(string);*/
			//tx.executeSql(string);

			var string = "DELETE FROM ARTICLES WHERE id IN (";

			for (var i = array.length - 1; i >= 0; i--) {
				if(i !== array.length - 1){
					string += ",";
				}
				//string += " 'id' = '" + array[i].id + "'";
				string += "'" + array[i].id + "'";
			};
			string += ")";
 
    		console.log(string);
			tx.executeSql(string);
			
		}, databaseHelper.error, function(){
			console.log("successfully deleted some articles.");

			databaseHelper.loadArticles({id: ["asbasbsdbasb0", "asbasbsdbasb1"]}, function(articles){
				console.log("ARTICLES LOADED", articles);
			})
		});
 
    }

    databaseHelper.error = function (tx, error){
    	console.error("ERROR", error, tx);
    };
    databaseHelper.success = function (){
    	console.log("SQL Success");
    };


}());

