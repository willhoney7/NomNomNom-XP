enyo.kind({
	name: "App",
	fit: true,
	components:[
		{kind: "Panels", classes: "enyo-fit", draggable: false, components: [
			//always load these
			{name: "loadingPage", content: "Loading...", classes: "loading"},
			{name: "loginPage", kind: "loginPage", onLogin: "loggedIn"},
			{name: "gridPage", kind: "gridPage", onViewArticles: "showArticlePage", onShowSettingsPage: "showSettingsPage", onShowEditSubPage: "showEditSubPage", onShowAddFeedPage: "showAddFeedPage"},
			{name: "articlePage", kind: "articlePage", onShowGridPage: "showGridPage", onViewArticle: "showArticleViewPage"},

			//load these lazy, because they might not always be needed
			{name: "tourPage", kind: "tourPage", onShowGridPage: "showGridPage"},
			{name: "addFeedPage", kind: "addFeedPage", onShowGridPage: "showGridPage"},
			{name: "settingsPage", kind: "settingsPage",  onShowGridPage: "showGridPage", onLogOut: "showLoginPage"},
			{name: "editSubPage", kind: "editSubPage", onShowGridPage: "showGridPage"}
		]},
	],
	panelsIndex: {
		"loadingPage": 0,
		"loginPage": 1,
		"gridPage": 2,
		"articlePage": 3,
		"tourPage": 4,
		"addFeedPage": 5,
		"settingsPage": 6,
		"editSubPage": 7
	},
	create: function () {
		this.inherited(arguments);

		window.document.body.className = "enyo-unselectable onyx " + AppUtils.getPlatform();

		databaseHelper.loadDb();

		subscribe("online", enyo.bind(this, this.nowOnline));
	},
	rendered: function () {
		this.inherited(arguments);

		//can't call this on create
		this.checkLogin();
	},
	checkLogin: function(){
		if (reader.hasAuth()) {
			AppUtils.testInternetConnection(enyo.bind(this, function(hasInternet){
				if(hasInternet){
					reader.getToken(
						enyo.bind(this, this.showGridPage),
						enyo.bind(this, function(){
							/*if(OS == iOS){
								getPassFromKeychain();
									onSuccess: getAuthHeader();
										onSuccess: getToken();
											onSuccess: showLoginPage();
											onFail: promptLogin();
										onFail: promptLogin();
									onFail: promptLogin();
							} else {*/
								this.showLoginPage();
							//}
						})
					)
				} else {
					this.showGridPage();
					//show grid. we should have it cached. when service comes later, the lib knows to re ask for a token.
				}
			}));
				
		} else {
			//technically the password shouldn't be saved if the authHeader isn't there... so remove?
			this.showLoginPage();
		}

		//this.showLoginPage();
	},
	loggedIn: function(inSender, inEvent) {

		console.log("Logged in");

		if(inEvent && inEvent.showTour){
			this.showTourPage();
			//showTour
		} else {
			this.showGridPage();
		}

		this.$.gridPage.loadFeedsFromOnline();

		//testing
		//this.showArticlePage(this, {articles: ["dog", "cat"]});
	},

	changePage: function(name) {
		//_.defer(enyo.bind(this, function() {
			this.$.panels.setIndex(this.panelsIndex[name]);
		//}));
	},

	showLoginPage: function() {
		this.changePage("loginPage");
	},
	showGridPage: function(inSender, inEvent) {
		this.changePage("gridPage");
	},
	showEditSubPage: function (inSender, inEvent) {
		this.changePage("editSubPage");
		this.$.editSubPage.setItem(inEvent.sub);
	},
	showArticlePage: function(inSender, inEvent) {
		if(!inEvent || !inEvent.articles || !inEvent.sub){
			console.error("Error Displaying Articles");
			return;
		}
		this.changePage("articlePage");
		this.$.articlePage.loadArticles(inEvent.sub, inEvent.articles);
	},
	backToArticlePage: function (){
		this.changePage("articlePage");
	},
	showArticleViewPage: function(inSender, inEvent){
		if(!inEvent || !inEvent.articles || inEvent.index === undefined){
			console.error("Error Viewing Articles");
			return;
		}
		this.changePage("articleViewPage");
		this.$.articleViewPage.viewArticles(inEvent.articles, inEvent.index);
	},

	showTourPage: function () {
		this.changePage("tourPage");
	},
	showSettingsPage: function () {
		this.changePage("settingsPage");
	},
	showAddFeedPage: function () {
		this.changePage("addFeedPage");
		//this.changePage("tourPage");
	},

	nowOnline: function(){
		databaseHelper.getQueue(enyo.bind(this, function(array){
			console.log("OUR QUEUE", array);
			var i = 0,
				iterate = enyo.bind(this, function () {
					if(i < array.length){
						i++;
						this.processQueuedData(array[i-1], iterate);
					}
				});

			iterate();

		}));
		console.log("NOW ONLINE. CHECK DAT QUEUE");
	},
	processQueuedData: function(obj, callback) {
		var data = JSON.parse(Base64.decode(obj.data));
		console.log("PROCESSING", data);
		switch (data.action) {
			case "markRead":
				var item = data.data;
				console.log("FROM QUEUE, isREAD?", item.read)
				reader.setItemTag(item.feed.id, item.id, "read", item.read, function(){

					console.log("marked read", item);

					databaseHelper.clearFromQueue(obj.id, callback);

				}, function () {
					console.log("Mark read from Queued Failed");
					callback();
				});
				break;
			case "markAllRead":

				//We have to treat this a little differently.
				//We have to mark each article read individually, not the entire feed
				//the api does not like it if we send more than 100 at a time... sooo we need to separate them out.

				var articleSets = _(data.data).chain().groupBy(function(article, index){ 
					return "set" + Math.floor(index/100); 
				}).toArray().value();

				var i = 0,
					iterate = function() {
						if (i < articleSets.length){
							var subIds = [], articleIds = [];

							_.each(articleSets[i], function(article, index){
								subIds.push(article.feed.id);
								articleIds.push(article.id);	
							});

							reader.setItemTag(subIds, articleIds, "read", true, function () {
								console.log("WORKED?");
								i++;
								iterate();
							
							}, function () {
								console.log("Mark all read from Queued Failed");
								callback();
							})
						} else {
							console.log("DONE! clearing from queue");
							databaseHelper.clearFromQueue(obj.id, callback);

						}
					}

				iterate();

				break;
			case "markStarred":
				var item = data.data;

				console.log("FROM QUEUE, isStarred?", item.starred)

				reader.setItemTag(item.feed.id, item.id, "star", item.starred, function(){

					console.log("marked read", item);

					databaseHelper.clearFromQueue(obj.id, callback);

				}, function () {
					console.log("Mark starred from Queued Failed");
					callback();
				});
				break;
			case  "editFeedLabel":
				var feedId = data.data.feedId,
					labelId = data.data.labelId,
					opt = data.data.opt;

				reader.editFeedLabel(feedId, labelId, opt, function(){
					console.log("Edited feed label");
					databaseHelper.clearFromQueue(obj.id, callback);

				}, function () {
					console.log("EDIT FEED LABEL FAILED");
					callback();
				});
				break;
			case "editFeedTitle":
				var feedId = data.data.feedId,
					newTitle = data.data.newTitle;

				reader.editFeedTitle(feedId, newTitle, function () {
					console.log("EDITED FEED TITLE");
					databaseHelper.clearFromQueue(obj.id, callback);
				}, function () {
					console.log("EDIT FEED TITLE FAILED");
					callback();
				});
				break;
			case "editLabelTitle":
				var labelId = data.data.labelId,
					newTitle = data.data.newTitle;

				reader.editLabelTitle(labelId, newTitle, function () {
					console.log("EDITED LABEL TITLE");
					databaseHelper.clearFromQueue(obj.id, callback);
				}, function () {
					console.log("EDIT LABEL TITLE FAILED");
					callback();
				});
				break;
			case "unsubscribeFeed":
				var feedId = data.data;

				reader.unsubscribeFeed(feedId, function () {
					console.log("UNSUBSCRIBED FEED");
					databaseHelper.clearFromQueue(obj.id, callback);
				}, function () {
					console.log("UNSUBSCRIBE FEED FAILED");
					callback();
				});
				break;
			case "sendToService":
				var toService = data.data.service;
				var item = data.data.item;

				console.log("Saving", item, "to", toService);

				if(AppPrefs.get(toService + "Authenticated")){
					var service = new serviceWrapper(toService);
					service.add({title: item.title, url: item.url}, enyo.bind(this, function (response) {
						console.log("SENT ITEM", response);
						databaseHelper.clearFromQueue(obj.id, callback);

						//humane.log("Sent!");
					}));
				} else {
					console.log("No longer authenticated...");
					databaseHelper.clearFromQueue(obj.id, callback);
				}
				break;
						
		}
	}


	
});
