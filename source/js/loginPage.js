enyo.kind({
	name: "loginPage",
	kind: "Page",
	fit: true,
	handlers: {
		onLogin: ""
	},
	components:[
		{content: "Please log in, chump."},
		{kind: "Button", content: "HAX log in", ontap: "loggedIn"}
	],
	create: function(){
		this.inherited(arguments);
		//showLogin Textfields

	},
	showingChanged: function(previousValue) {
		this.inherited(arguments);

		if(this.getShowing() && previousValue !== undefined){
			//ACTIVATED
			console.log("loginPage activated");
		}
	},
	attemptLogin: function () {
		/*
		get entered data
			getAuthHeader(username, passs)
				onSuccess: getToken()
					onSuccess: loggedIn()
					onFail: errorLogin()
				onFail: errorLogin()
		*/
	},
	loggedIn: function(){
		/*prompt("Wanna view the tour?")
			Yes: this.bubble("onLogin", {showTour: true});
			No: this.bubble("onLogin");
		*/
		this.bubble("onLogin", {showTour: true});
		//this.bubble("onLogin");
	}
});
