enyo.kind({
	name: "App",
	fit: true,
	components:[
		{kind: "Book", components: [
			//always load these
			{name: "loadingPage", content: "loading"},
			{name: "loginPage", kind: "loginPage", onLogin: "loggedIn"},
			{kind: "gridPage"},
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

		if(inEvent && inEvent.showTour){
			this.showTourPage();
			//showTour
		} else {
			this.showGridPage();
		}
		console.log("Logged in");
	},

	showLoginPage: function() {
		this.$.book.pageName("loginPage");
	},
	showGridPage: function() {
		this.$.book.pageName("gridPage");
	},
	showArticlePage: function() {
		this.$.book.pageName("articlePage");
	},
	showTourPage: function () {
		this.$.book.pageName("tourPage");
	},

	
});
