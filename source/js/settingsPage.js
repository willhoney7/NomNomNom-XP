enyo.kind({
	name: "settingsPage",
	kind: "Page",
	fit: true,
	layoutKind: "FittableRowsLayout",
	handlers: {
		onShowGridPage: ""
	},
	components:[
		{kind: "onyx.Toolbar", classes: "onyx-toolbar-inline", components: [
			{kind: "onyx.Button", content: "Back", ontap: "bubbleEvent", eventToBubble: "onShowGridPage", classes: "abs"},
			{content: "Settings", classes: "center", style: "text-align: center"}
		]},
		{content: "this is the settings page"},
	],
	create: function(){
		this.inherited(arguments);
	},
	bubbleEvent: function(inSender, inEvent) {
		this.bubble(inSender.eventToBubble);
	}
	
});
