//background operations
reader.background = {};

reader.background.markRead = function(item, callback){ 
	function adjustDb () {
		databaseHelper.markArticlesRead([item], function(){
			//console.log("read articles saved methinks");

			reader.decrementUnreadCount(item.feed.id, 1);

			databaseHelper.saveSubs(reader.getFeeds());

			if (callback)
				callback();
		});
	}

	AppUtils.testInternetConnection(function(hasInternet){
		if(hasInternet){
			reader.setItemTag(item.feed.id, item.id, "read", item.read, function(){
				//console.log("marked read", item);
				adjustDb();
			});
		} else {
			console.log("QUEUED");
			databaseHelper.queue({action: "markRead", data: item});
			adjustDb();
		}
	});
};

reader.background.markStarred = function(item, callback){ 
	function adjustDb () {
		databaseHelper.markArticleStarred(item, function(){
			//console.log("read articles saved methinks");

			if (callback)
				callback();
		});
	}

	AppUtils.testInternetConnection(function(hasInternet){
		if(hasInternet){
			reader.setItemTag(item.feed.id, item.id, "star", item.starred, function(){
				//console.log("marked read", item);
				adjustDb();
			});
		} else {
			console.log("QUEUED");
			databaseHelper.queue({action: "markStarred", data: item});
			adjustDb();
		}
	});
};


reader.background.markAllRead = function(sub, articles, callback){

	function adjustDb () {


		databaseHelper.markArticlesRead(articles, enyo.bind(this, function(){
			console.log("read articles saved methinks");

			_.each(articles, function(article){
				reader.decrementUnreadCount(article.feed.id, 1);
			});

			databaseHelper.saveSubs(reader.getFeeds());

			if (callback)
				callback();
		}));
	}

	AppUtils.testInternetConnection(function(hasInternet){
		if(hasInternet){
			reader.markAllAsRead(sub.id, enyo.bind(this, function(){

				//console.log("marked read", item);
				adjustDb();
			}));
		} else {
			console.log("QUEUED");
			databaseHelper.queue({action: "markAllRead", data: articles});
			adjustDb();
		}
	});
};
