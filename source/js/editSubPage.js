enyo.kind({
	name: "editSubPage",
	fit: true,
	layoutKind: "FittableRowsLayout",
	handlers: {
		onShowGridPage: ""
	},
	components:[
		{kind: "onyx.Toolbar", classes: "onyx-toolbar-inline", components: [
			{kind: "onyx.Button", content: "Back", ontap: "bubbleEvent", eventToBubble: "onShowGridPage", classes: "abs"},
			{content: "Edit", classes: "center"}
		]},
		{classes: "fixedWidthList", components: [
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
	},

	showingChanged: function(previousValue) {
		this.inherited(arguments);

		if(this.getShowing() && previousValue !== undefined){
			this.activate();
		}
	},

	activate: function(){
		console.log("gridPage activated");

		//some bugs with fit:true?
		this.resized();

	},
	
});
