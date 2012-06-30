enyo.kind({
	name: "tourPage",
	fit: true,
	layoutKind: "FittableRowsLayout",
	handlers: {
		onShowGridPage: ""
	},
	components:[
		{kind: "onyx.Toolbar", classes: "onyx-toolbar-inline", components: [
			{kind: "onyx.Button", content: "Exit", ontap: "bubbleEvent", eventToBubble: "onShowGridPage", classes: "abs"},
			{content: "Tour", classes: "center", style: "text-align: center"}
		]},
		{name: "test", content: "this is the tour page"},
	],
	create: function(){
		this.inherited(arguments);
	},
	rendered: function () {
		this.inherited(arguments);
	},

	bubbleEvent: function(inSender, inEvent) {
		this.bubble(inSender.eventToBubble);
	}

	/*
		Button top-right to exit tour

		SnapScroller with images in center, one large background image.
		

	*/
	
});
