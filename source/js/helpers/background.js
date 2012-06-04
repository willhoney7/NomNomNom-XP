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
			reader.setItemTag(item.feed.id, item.id, "read", true, function(){
				//console.log("marked read", item);
				adjustDb();
			});
		} else {
			console.log("QUEUED");
			databaseHelper.queue({action: "markRead", data: item});
			adjustDb();
		}
	});
}