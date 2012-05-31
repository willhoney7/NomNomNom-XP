enyo.kind({
	name: "App",
	fit: true,
	components:[
		{kind: "Book", components: [
			//always load these
			{name: "loadingPage", content: "Loading...", classes: "loading"},
			{name: "loginPage", kind: "loginPage", onLogin: "loggedIn"},
			{kind: "gridPage", onViewArticles: "showArticlePage", onShowSettingsPage: "showSettingsPage", onShowAddFeedPage: "showAddFeedPage"},
			{kind: "articlePage", onShowGridPage: "showGridPage", onViewArticle: "showArticleViewPage"},

			//load these lazy, because they might not always be needed
			{name: "tourPage", kind: "tourPage", lazy: true, onShowGridPage: "showGridPage"},
			{name: "addFeedPage", kind: "addFeedPage", lazy: true, onShowGridPage: "showGridPage"},
			{name: "settingsPage", kind: "settingsPage", lazy: true, onShowGridPage: "showGridPage", onLogOut: "showLoginPage"}
		]},
	],
	create: function () {
		this.inherited(arguments);

		window.document.getElementsByTagName("body")[0].className += " " + AppUtils.getPlatform();

		databaseHelper.loadDb();
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

	showLoginPage: function() {
		this.$.book.pageName("loginPage");
	},
	showGridPage: function(inSender, inEvent) {
		this.$.book.pageName("gridPage");
	},
	showArticlePage: function(inSender, inEvent) {
		if(!inEvent || !inEvent.articles || !inEvent.sub){
			console.error("Error Displaying Articles");
			return;
		}
		this.$.book.pageName("articlePage");
		this.$.articlePage.loadArticles(inEvent.sub, inEvent.articles);
	},
	backToArticlePage: function (){
		this.$.book.pageName("articlePage");
	},
	showArticleViewPage: function(inSender, inEvent){
		if(!inEvent || !inEvent.articles || inEvent.index === undefined){
			console.error("Error Viewing Articles");
			return;
		}
		this.$.book.pageName("articleViewPage");
		this.$.articleViewPage.viewArticles(inEvent.articles, inEvent.index);
	},

	showTourPage: function () {
		this.$.book.pageName("tourPage");
	},
	showSettingsPage: function () {
		this.$.book.pageName("settingsPage");
	},
	showAddFeedPage: function () {
		this.$.book.pageName("addFeedPage");
	}

	
});
