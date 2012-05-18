enyo.kind({
	name: "App",
	fit: true,
	components:[
		{kind: "Book", components: [
			{name: "loadingPage", content: "loading"},
			{name: "loginPage", kind: "loginPage", onLogin: "loggedIn"},
			{kind: "gridPage"},
			{kind: "articlePage"}
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
		this.showGridPage();

		if(inEvent.showTour){
			//showTour
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

	
});
