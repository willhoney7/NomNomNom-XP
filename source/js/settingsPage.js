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

		{name: "settingList", classes: "fixedWidthList", components: []},
	],
	settings: [
		{section: "Subscription Grid", items: [
			{type: "toggle", description: "Hide Read Feeds", preference: "hideRead"},
			{type: "select", description: "Tapping on Folders...", preference: "folderTap", options: ["Shows Feeds", "Shows Articles"]}
		]},
		{section: "Reading Articles", items: [
			{type: "select", description: "Font Size", preference: "articleFontSize", options: ["Small", "Medium", "Large"]},
			{type: "select", description: "Article Sort", preference: "articleSort", options: ["Recent First", "Oldest First"]}

		]}
	],
	create: function(){
		this.inherited(arguments);

		_.each(this.settings, enyo.bind(this, function(setting){
			var settingKinds = [{kind: "onyx.GroupboxHeader", content: setting.section}]; 
			_.each(setting.items, function(item){
				var toAdd = {classes: "groupItem", components: []};

				switch (item.type){
					case "toggle":
						toAdd.components.push(
							{kind: "onyx.ToggleButton", onContent: "Yes", offContent: "No", classes: "floatRight", value: AppPrefs.get(item.preference), preference: item.preference, ontap: "setPreference"},
							{kind: "enyo.Control", content: item.description}
						);
						break;
					case "select":
						var options = [], selected = 0;

						_.each(item.options, function(opt, index){
							options.push({content: opt, value: opt});

							if(opt === AppPrefs.get(item.preference)){
								selected = index;
							}
						});

						toAdd.components.push(
							{kind: "Select", onchange: "setPreference", selected: selected, preference: item.preference, classes: "floatRight", components: options},
							{kind: "enyo.Control", content: item.description}
						);

						break;
				}

				settingKinds.push(toAdd);
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

	logOut: function() {
		reader.logout();
		databaseHelper.dumpData();
		this.bubble("onLogOut");

	},
		
});

