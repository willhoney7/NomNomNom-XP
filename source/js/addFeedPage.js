enyo.kind({
	name: "addFeedPage",
	kind: "Page",
	fit: true,
	layoutKind: "FittableRowsLayout",
	handlers: {
		onShowGridPage: ""
	},
	components:[
		{kind: "onyx.Toolbar", classes: "onyx-toolbar-inline", components: [
			{kind: "onyx.Button", content: "Back", ontap: "bubbleEvent", eventToBubble: "onShowGridPage", classes: "abs"},
			{content: "Add Feed", classes: "center"}
		]},
		{classes: "addFeedList", components: [
			{kind: "onyx.Groupbox", components: [
				{kind: "onyx.GroupboxHeader", content: "Add New Feed"},
				{kind: "onyx.InputDecorator", components: [
					{name: "username", kind: "onyx.Input", style: "width: 70%", placeholder: "URL/Search Term"},
					{kind: "enyo.Select", classes: "floatRight", components: [
						{content: "Auto", active: true},
						{content: "Force URL"},
						{content: "Force Search"},
					]},

				]},
				
			]},
			{kind: "onyx.Button", content: "Go", ontap: "processInput", classes: "full"}
		]},
	],
	
	bubbleEvent: function(inSender, inEvent) {
		this.bubble(inSender.eventToBubble);
	},
	create: function(){
		this.inherited(arguments);
	}
	
});
