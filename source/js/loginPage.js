enyo.kind({
	name: "loginPage",
	kind: "Page",
	fit: true,
	handlers: {
		onLogin: ""
	},
	components:[
		{classes: "loginGroup", components: [
			{kind: "onyx.Groupbox", components: [
				{kind: "onyx.GroupboxHeader", content: "Log into Google Reader"},
				{kind: "onyx.InputDecorator", components: [
					{name: "username", kind: "onyx.Input", placeholder: "Email Address"}
				]},
				{kind: "onyx.InputDecorator", components: [
					{name: "password", kind: "onyx.Input", type: "password", placeholder: "Password"}
				]},
				
			]},
			{kind: "enyo.GroupItem", components: [
				{name: "errorMessage", classes: "errorMessage", content: ""},
				{kind: "onyx.Button", content: "Log in", ontap: "attemptLogin", classes: "full"}
			]},
			{name: "popup", kind: "onyx.Popup", classes: "loginPopup", centered: true, modal: true, floating: true, components: [
				{name: "popupText", classes: "popupText", content: "Logged in successfully! Would you like to view the tour? We highly recommend it."},
				{kind: "onyx.Button", content: "Yes!", style: "width: 68%; margin-right: 8px;", ontap: "showFeeds", name: "showTour"},
				{kind: "onyx.Button", classes: "onyx-negative", style: "width: 30%", content: "No, I'm silly.", ontap: "showFeeds"},
			]},

		]}	
		
	],
	create: function(){
		this.inherited(arguments);

	},
	showingChanged: function(previousValue) {
		this.inherited(arguments);

		if(this.getShowing() && previousValue !== undefined){
			//ACTIVATED
			console.log("loginPage activated");
			this.resized();
		}
	},
	attemptLogin: function () {
		this.$.errorMessage.setContent("");

		AppUtils.testInternetConnection(enyo.bind(this, function(hasInternet){
			if(hasInternet){
				reader.login(
					this.$.username.getValue(), 
					this.$.password.getValue(), 
					enyo.bind(this, function(){
					//success
						console.log("succes 1");
						reader.getToken(
							enyo.bind(this, function(){
								//success
								console.log("succes 2");
								this.loggedIn();

							}), 
							enyo.bind(this, this.errorLogin)
						);
					}), 
					enyo.bind(this, this.errorLogin)
				);
			} else {
				this.$.errorMessage.setContent("No Internet Connection...");
			}

		}));
		/*
		get entered data
			getAuthHeader(username, passs)
				onSuccess: getToken()
					onSuccess: loggedIn()
					onFail: errorLogin()
				onFail: errorLogin()
		*/
		//this.loggedIn();
	},
	loggedIn: function(){
		//this.$.popupText.setContent(navigator.appVersion);
		this.$.popup.show();
		this.$.popup.resized();
	},

	errorLogin: function(error){
		console.log("ERROR", error);
		this.$.errorMessage.setContent(error);
	},

	showFeeds: function(inSender, inEvent) {
		this.$.popup.hide();

		var opt = (inSender.name && inSender.name === "showTour") ? {showTour: true} : null;
		this.bubble("onLogin", opt);
	}
});
