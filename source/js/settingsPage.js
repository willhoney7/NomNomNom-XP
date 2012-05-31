enyo.kind({
	name: "settingsPage",
	kind: "Page",
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
		{classes: "settingsList", components: [
			{kind: "onyx.Groupbox", components: [
				{kind: "onyx.GroupboxHeader", content: "Reading Articles"},
				{kind: "onyx.MenuDecorator", style: "z-index: 11;", components: [
					{kind: "enyo.Control", content: "", classes: "settingValue floatRight", onclick: "requestMenuShow", menuName: "fontSizeMenu", showPreferenceValue: "articleFontSize"},
					{kind: "enyo.Control", content: "Font Size", onclick: "requestMenuShow", menuName: "fontSizeMenu"},
					{kind: "onyx.Menu", name: "fontSizeMenu", components: [
						{content: "Small", ontap: "setPreference", preference: "articleFontSize", menuName: "fontSizeMenu"},
						{content: "Medium", ontap: "setPreference", preference: "articleFontSize", menuName: "fontSizeMenu"},
						{content: "Large", ontap: "setPreference", preference: "articleFontSize", menuName: "fontSizeMenu"},
					]}
				]},
				/*{kind: "onyx.MenuDecorator", components: [
					{kind: "enyo.Control", content: "", classes: "settingValue floatRight", onclick: "requestMenuShow", menuName: "contrastMenu", showPreferenceValue: "articleContrast"},
					{kind: "enyo.Control", content: "Contrast", onclick: "requestMenuShow", menuName: "contrastMenu"},
					{kind: "onyx.Menu", name: "contrastMenu", components: [
						{content: "Normal", ontap: "setPreference", preference: "articleContrast", menuName: "contrastMenu"},
						{content: "High", ontap: "setPreference", preference: "articleContrast", menuName: "contrastMenu"},
					]}
				]}*/
			]},
			{kind: "onyx.Button", classes: "onyx-negative full", content: "Log Out", ontap: "logOut"}
		]}
	],
	create: function(){
		this.inherited(arguments);
	},
	rendered: function () {
		this.inherited(arguments);
		
		_.each(this.getComponents(), function(control){
			if(control.showPreferenceValue){
				control.setContent(AppPrefs.get(control.showPreferenceValue));
			}
		})
	},
	bubbleEvent: function(inSender, inEvent) {
		this.bubble(inSender.eventToBubble);
	},

	requestMenuShow: function(inSender, inEvent) {
		this.$[inSender.menuName].requestMenuShow();
	},

	setPreference: function(inSender, inEvent) {
		AppPrefs.set(inSender.preference, inSender.content);
		if(inSender.menuName){
			this.$[inSender.menuName].requestHide();
		}

		_.each(this.getComponents(), function(control){
			if(control.showPreferenceValue){
				control.setContent(AppPrefs.get(control.showPreferenceValue));
			}
		})
	},

	logOut: function() {
		reader.logout();
		databaseHelper.dumpData();
		this.bubble("onLogOut");

	},
		
});

