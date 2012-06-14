enyo.kind({
	name: "settingsPage",
	fit: true,
	layoutKind: "FittableRowsLayout",
	handlers: {
		onShowGridPage: "",
		onLogOut: ""
	},
	components:[
		{kind: "onyx.Toolbar", classes: "onyx-toolbar-inline", components: [
			{kind: "onyx.Button", content: "Back", ontap: "bubbleEvent", eventToBubble: "onShowGridPage", classes: "abs"},
			{content: "Settings", classes: "center"}
		]},
		{kind: "enyo.Scroller", fit: true, horizontal: "hidden", components: [
			{name: "settingList", classes: "fixedWidthList", components: []},
		]},
	],
	settings: [
		{section: "Subscription Grid", items: [
			{type: "toggle", description: "Hide Read Feeds", preference: "hideRead"},
			{type: "select", description: "Tapping on Folders...", preference: "folderTap", options: ["Shows Feeds", "Shows Articles"]}
		]},
		{section: "Reading Articles", items: [
			{type: "select", description: "Font Size", preference: "articleFontSize", options: ["Small", "Medium", "Large"]},
			{type: "select", description: "Article Sort", preference: "articleSort", options: ["Recent First", "Oldest First"]}
		]},

		{section: "Instapaper", items: [
			{type: "login", description: "Instapaper", preference: "instapaper"},
		]},
		{section: "Pocket", items: [
			{type: "login", description: "Pocket", preference: "readitlater"},
		]},
		{section: "Delicious", items: [
			{type: "login", description: "Pocket", preference: "delicious"},
		]},
		{section: "Pinboard", items: [
			{type: "login", description: "Pinboard", preference: "pinboard"},
		]}
	],
	create: function(){
		this.inherited(arguments);

		this.buildSettings();
	},
	buildSettings: function () {

		this.$.settingList.destroyClientControls();

		_.each(this.settings, enyo.bind(this, function(setting){
			var settingKinds = [{kind: "onyx.GroupboxHeader", content: setting.section}]; 
			_.each(setting.items, function(item){
				switch (item.type){
					case "toggle":

						var toAdd = {classes: "groupItem", components: [
							{kind: "onyx.ToggleButton", onContent: "Yes", offContent: "No", classes: "floatRight", value: AppPrefs.get(item.preference), preference: item.preference, ontap: "setPreference"},
							{kind: "enyo.Control", content: item.description}
						]};

						settingKinds.push(toAdd);
						
						break;
					case "select":
						var options = [], selected = 0;

						_.each(item.options, function(opt, index){
							options.push({content: opt, value: opt});

							if(opt === AppPrefs.get(item.preference)){
								selected = index;
							}
						});

						var toAdd = {classes: "groupItem", components: []};

						toAdd.components.push(
							{kind: "Select", onchange: "setPreference", selected: selected, preference: item.preference, classes: "floatRight", components: options},
							{kind: "enyo.Control", content: item.description}
						);
						
						settingKinds.push(toAdd);

						break;
					case "login":
						if(AppPrefs.get(item.preference + "Authenticated")) {
							//log out stuff
							settingKinds.push(
								{classes: "groupItem", components: [
									{kind: "onyx.Button", classes: "full", preference: item.preference, content: "Log Out", ontap: "logoutService"}
								]}
							);
						} else {
							settingKinds.push(
								{kind: "onyx.InputDecorator", components: [
									{kind: "onyx.Input", name: item.preference + "Username", placeholder: "Username"}
								]},
								{kind: "onyx.InputDecorator", components: [
									{kind: "onyx.Input", type: "password", name: item.preference + "Password", placeholder: "Password"}
								]},
								{classes: "groupItem", components: [
									{kind: "onyx.Button", classes: "full", preference: item.preference, content: "Log in", ontap: "loginService"}
								]}
							);
					}
						break;
				}
			});

			this.$.settingList.createComponent(
				{kind: "onyx.Groupbox", components: settingKinds},
				{owner: this}
			);
		}));

		this.$.settingList.createComponent({kind: "onyx.Button", classes: "onyx-negative full", content: "Log Out", ontap: "logOut"}, {owner: this})
	},
	rendered: function () {
		this.inherited(arguments);
	},
	bubbleEvent: function(inSender, inEvent) {
		this.bubble(inSender.eventToBubble);
	},

	setPreference: function(inSender, inEvent) {
		var value = inSender.type === "select" ? inSender.components[inSender.getSelected()].value : inSender.getValue();
		AppPrefs.set(inSender.preference, value);
	},
	loginService: function (inSender, inEvent) {
		var service = new serviceWrapper(inSender.preference);
			service.authenticate(this.$[inSender.preference + "Username"].getValue(), this.$[inSender.preference + "Password"].getValue(), enyo.bind(this, function (response) {
				if(response.success){
					humane.log("Logged in!");
					AppPrefs.set(inSender.preference + "Authenticated", true);
					this.buildSettings();
					this.render();
				} else {
					humane.log(response.error);
				} 
			}));
	},
	logoutService: function (inSender, inEvent) {
		service = new serviceWrapper(inSender.preference);
		service.logOut();

		AppPrefs.set(inSender.preference + "Authenticated", false);
		this.buildSettings();
		this.render();
	},
	logOut: function() {
		reader.logout();
		databaseHelper.dumpData();
		this.bubble("onLogOut");

	},
		
});

