//background operations
reader.background = {};

reader.background.markRead = function(item, callback){ 
	reader.setItemTag(item.feed.id, item.id, "read", true, function(){
		//console.log("marked read", item);

		databaseHelper.markArticlesRead([item], function(){
			//console.log("read articles saved methinks");

			reader.decrementUnreadCount(item.feed.id, 1);

			databaseHelper.saveSubs(reader.getFeeds());

			if (callback)
				callback();
		});

	});
}