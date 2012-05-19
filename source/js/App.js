enyo.kind({
	name: "App",
	fit: true,
	components:[
		{kind: "Book", components: [
			//always load these
			{name: "loadingPage", content: "loading"},
			{name: "loginPage", kind: "loginPage", onLogin: "loggedIn"},
			{kind: "gridPage", onViewArticles: "showArticlePage"},
			{kind: "articlePage"},

			//load these lazy, because they might not always be needed
			{name: "tourPage", kind: "tourPage", lazy: true},
			{name: "settingsPage", kind: "settingsPage", lazy: true}
		]},
	],
	create: function () {
		this.inherited(arguments);
	},
	rendered: function () {
		this.inherited(arguments);

		//can't call this on create
		this.checkLogin();
	},
	checkLogin: function(){
		/*
		if (storedAuthHeader) {
			getToken()
				onSuccess: this.showLoginPage();
				onFail: 
					if(OS == iOS){
						getPassFromKeychain();
							onSuccess: getAuthHeader();
								onSuccess: getToken();
									onSuccess: showLoginPage();
									onFail: promptLogin();
								onFail: promptLogin();
							onFail: promptLogin();
					} else {
						promptLogin();
					}
		} else {
			//technically the password shouldn't be saved if the authHeader isn't there... so remove?
			promptLogin();
		}



		//if (loggedIn)
		//	this.showGridPage();
		//else
			this.showLoginPage();*/
			
		this.showLoginPage();
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
		if(!inEvent || !inEvent.articles){
			console.error("Error Displaying Articles");
			return;
		}
		this.$.book.pageName("articlePage");
		this.$.articlePage.setArticles(inEvent.articles);
	},
	showTourPage: function () {
		this.$.book.pageName("tourPage");
	},

	
});
