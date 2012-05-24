enyo.kind({
	name: "App",
	fit: true,
	components:[
		{kind: "Book", components: [
			//always load these
			{name: "loadingPage", content: "Loading...", classes: "loading"},
			{name: "loginPage", kind: "loginPage", onLogin: "loggedIn"},
			{kind: "gridPage", onViewArticles: "showArticlePage", onShowSettingsPage: "showSettingsPage", onShowAddFeedPage: "showAddFeedPage"},
			{kind: "articlePage", onShowGridPage: "showGridPage"},

			//load these lazy, because they might not always be needed
			{name: "tourPage", kind: "tourPage", lazy: true, onShowGridPage: "showGridPage"},
			{name: "addFeedPage", kind: "addFeedPage", lazy: true, onShowGridPage: "showGridPage"},
			{name: "settingsPage", kind: "settingsPage", lazy: true, onShowGridPage: "showGridPage"}
		]},
	],
	create: function () {
		this.inherited(arguments);

		window.document.getElementsByTagName("body")[0].className += " " + getPlatform();

		databaseHelper.loadDb();
	},
	rendered: function () {
		this.inherited(arguments);

		//can't call this on create
		this.checkLogin();

	},
	checkLogin: function(){
		if (reader.hasAuth()) {
			if(navigator.onLine){
				reader.getToken(
					enyo.bind(this, this.loggedIn),
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

		//testing
		//this.showArticlePage(this, {articles: ["dog", "cat"]});
	},

	showLoginPage: function() {
		this.$.book.pageName("loginPage");
	},
	showGridPage: function() {
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
