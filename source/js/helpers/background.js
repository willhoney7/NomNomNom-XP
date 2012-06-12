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

			var item, labelIndex, feeds = reader.getFeeds();

			//Get our label
			_.each(feeds, function(feed, index){
				if(feed.id === labelId){
					labelIndex = index;
				}
			});

			//It's a new label
			if(!labelIndex) {
				var labelToAdd = {id: labelId, count: 0, feeds: [], isLabel: true, title: labelId.replace(reader.TAGS["label"], "")};
				for (var i = 0; i < feeds.length; i++) {
					if(feeds[i].isLabel){

						if(labelId < feeds[i].id) {
							feeds.splice(i, 0, labelToAdd);
							labelIndex = i;
							break;
						}
					}
				};
				if(!labelIndex) {
					feeds.splice(2, 0, labelToAdd);
					labelIndex = 2;
				}
			}

			//delete the category on the feed we push inside. Otherwise it would be recursive
			var categoryLabel = _(feeds[labelIndex]).clone();
				delete categoryLabel.feeds;


			//GET OUR ITEM
			for (var i = feeds.length - 1; i >= 0; i--) {
				if(feeds[i].id === feedId){
					//find the feed if it has no label
					
					item = feeds.splice(i, 1)[0];
					item.categories.push(categoryLabel);

					break;
				} else if(feeds[i].isLabel){
					//otherwise find the feed if it is in a label
					_.each(feeds[i].feeds, function(feed){
						if(feed.id === feedId){
							item = feed;
							item.categories.push(categoryLabel);
						}
					});
				}
			};

			console.log(feeds[labelIndex]);

			feeds[labelIndex].feeds.push(item);
			feeds[labelIndex].count = (parseInt(feeds[labelIndex].count) || 0) + (item.count || 0);

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

						feeds[labelIndex].count = (parseInt(feeds[labelIndex].count) || 0) - (item.count || 0);

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
			var alreadyThere = false;
			_.each(feeds, function(feed) {
				if(feed.isLabel){
					_.each(feed.feeds, function (insideFeed) {
						if(insideFeed.id === item.id){
							alreadyThere = true;
						}
					});
					
				}
			});
			if(!alreadyThere)
				feeds.push(item);
		}	

		console.log("feeds", feeds);

		databaseHelper.saveSubs(feeds);
		//reader.setFeeds(feeds);

		callback();
	}

	AppUtils.testInternetConnection(function(hasInternet){
		if(hasInternet){
			adjustDb();

			reader.editFeedLabel(feedId, labelId, opt, function(){
				console.log("EDITED FEED LABEL");

			});
		} else {
			console.log("QUEUED");
			adjustDb();

			databaseHelper.queue({action: "editFeedLabel", data: {feedId: feedId, labelId: labelId, opt: opt}});
		}
	});

};

reader.background.editFeedTitle = function(feedId, newTitle, callback){ 
	function adjustDb () {
		var item, feeds = reader.getFeeds();

			//GET OUR ITEM
			for (var i = feeds.length - 1; i >= 0; i--) {
				if(feeds[i].id === feedId){
					item = feeds[i];
					break;
				} else if(feeds[i].isLabel){
					_.each(feeds[i].feeds, function(feed){
						if(feed.id === feedId){
							item = feed;
						}
					});
				}
			};

			item.title = newTitle;
			databaseHelper.saveSubs(feeds);

			if (callback)
				callback();
	}

	//@TODO: REMOVE SPECIAL KEYS
	//WHAT IF THIS FAILS???
	adjustDb();

	AppUtils.testInternetConnection(function(hasInternet){
		if(hasInternet){
			reader.editFeedTitle(feedId, newTitle, function(){
				//console.log("marked read", item);
			});
		} else {
			console.log("QUEUED");

			databaseHelper.queue({action: "editFeedTitle", data: {feedId: feedId, newTitle: newTitle}});
		}
	});
};

reader.background.editLabelTitle = function (labelId, newTitle, callback) {
	function adjustDb () {
		var label, feeds = reader.getFeeds(), newLabelIndex, existingLabelIndex;
			
			//GET OUR label

			for (var i = feeds.length - 1; i >= 0; i--) {
				if(feeds[i].isLabel){
					if(feeds[i].id === labelId){
						label = feeds[i];
						changedLabelIndex = i;
					} else if(feeds[i].id === reader.TAGS["label"] + newTitle) {
						existingLabelIndex = i;
						//our rename already exists. well poop
					}
					_.each(feeds[i].feeds, function (feed) {
						_.each(feed.categories, function (category) {
							if(category.id === labelId) {
								category.label = newTitle;
								category.id = reader.TAGS["label"] + newTitle;
							}
						});
					});
				}
			};

			if(existingLabelIndex){
				console.log("IT LIVES");

				feeds[existingLabelIndex].feeds = _(label.feeds).chain().union(feeds[existingLabelIndex].feeds).uniq(false, function(item) { return item.id } ).sortBy( function(item) { return item.title }).value();
				if(feeds[existingLabelIndex].count) {
					label.count = (label.count || 0) + feeds[existingLabelIndex].count;
				}
				feeds.splice(changedLabelIndex, 1);

			} else {

				label.title = newTitle;
				label.id = reader.TAGS["label"] + newTitle;
			}
			databaseHelper.saveSubs(feeds);

			if (callback)
				callback();
	}

	//@TODO: REMOVE SPECIAL KEYS
	//WHAT IF THIS FAILS???
	adjustDb();

	AppUtils.testInternetConnection(function(hasInternet){
		if(hasInternet){
			reader.editLabelTitle(labelId, newTitle, function(){
				//console.log("marked read", item);
			});
		} else {
			console.log("QUEUED");

			databaseHelper.queue({action: "editLabelTitle", data: {labelId: labelId, newTitle: newTitle}});
		}
	});	
};

reader.background.unsubscribeFeed = function(feedId, callback){ 
	function adjustDb () {
		var item, feeds = reader.getFeeds();

			//GET OUR ITEM
			for (var i = feeds.length - 1; i >= 0; i--) {
				if(feeds[i].id === feedId){
					item = feeds.splice(i, 1)[0]; //feeds[i];
					break;
				} else if(feeds[i].isLabel){
					for (var j = feeds[i].feeds.length - 1; j >= 0; j--) {
						if(feeds[i].feeds[j].id === feedId){
							if (feeds[i].count) {
								feeds[i].count -= feeds[i].feeds[j].count;
							}
							item = feeds[i].feeds.splice(j, 1)[0]
							break;
						}
					};
				}
			};
			if(feeds[0].count){
				feeds[0].count -= (item.count || 0);
			}

			databaseHelper.saveSubs(feeds);

			if (callback)
				callback();
	}

	adjustDb();

	AppUtils.testInternetConnection(function(hasInternet){
		if(hasInternet){
			reader.unsubscribeFeed(feedId, function(){
				//console.log("marked read", item);
			});
		} else {
			console.log("QUEUED");

			databaseHelper.queue({action: "unsubscribeFeed", data: feedId});
		}
	});
};



