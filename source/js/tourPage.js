enyo.kind({
	name: "tourPage",
	kind: "Page",
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
		{content: "this is the tour page"},
	],
	create: function(){
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
