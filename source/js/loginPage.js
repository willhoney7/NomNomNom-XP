enyo.kind({
	name: "loginPage",
	kind: "Page",
	fit: true,
	handlers: {
		onLogin: ""
	},
	components:[
		
		{classes: "centered loginGroup", components: [
			{kind: "onyx.Groupbox", components: [
				{kind: "onyx.GroupboxHeader", content: "Log into Google Reader"},
				{kind: "onyx.InputDecorator", components: [
					{kind: "onyx.Input", placeholder: "Email Address"}
				]},
				{kind: "onyx.InputDecorator", components: [
					{kind: "onyx.Input", type: "password", placeholder: "Password"}
				]},
				
			]},
			{kind: "enyo.GroupItem", components: [
				{name: "errorMessage", classes: "errorMessage", content: ""},
				{kind: "onyx.Button", content: "Log in"}
			]}
		]},
		
			//{fit: true, kind: "Button", content: "HAX log in", ontap: "loggedIn", style: "text-align: center"},
	
		

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
		//this.bubble("onLogin", {showTour: true});
		this.bubble("onLogin");
	}
});
