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

reader.background.editFeedLabel = function(feedId, labelId, opt, callback) {

	function adjustDb () {
		if(opt){
			//TODO deal with new labels
			var item, labelIndex, feeds = reader.getFeeds();

			for (var i = feeds.length - 1; i >= 0; i--) {
				if(feeds[i].id === feedId){
					item = feeds.splice(i, 1)[0];
					break;
				}
			};
			_.each(feeds, function(feed, index){
				if(feed.id === labelId){
					labelIndex = index;
				}
			});
			item.categories.push(feeds[labelIndex]);
			feeds[labelIndex].feeds.push(item);
		} else {

			var item, 
				feeds = reader.getFeeds(),
				labelIndex;
				
			_.each(feeds, function(feed, index){
				if(feed.id === labelId){
					labelIndex = index;
				}
			});

			if(feeds[labelIndex].feeds.length === 1) {
				item = feeds[labelIndex].feeds.splice(0, 1)[0];	
				feeds.splice(labelIndex, 1);
			} else {
				for (var i = feeds[labelIndex].feeds.length - 1; i >= 0; i--) {
					if(feeds[labelIndex].feeds[i].id === feedId){
						item = feeds[labelIndex].feeds.splice(i, 1)[0];
						break;
					}
				};
			}

			for (var i = item.categories.length - 1; i >= 0; i--) {
				if(item.categories[i].id === labelId){
					item.categories.splice(i, 1);
					break;
				}
			};
			feeds.push(item);
		}

		console.log(feeds);

		databaseHelper.saveSubs(feeds);

	}

	AppUtils.testInternetConnection(function(hasInternet){
		if(hasInternet){
			reader.editFeedLabel(feedId, labelId, opt, function(){
				adjustDb();
			});
		} else {
			console.log("QUEUED");
			//databaseHelper.queue({action: "editFeedLabel", data: {feedId: feedId, labelId: labelId}});
			adjustDb();
		}
	});

	
};


