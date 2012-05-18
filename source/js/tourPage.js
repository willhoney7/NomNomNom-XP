enyo.kind({
	name: "tourPage",
	kind: "Page",
	fit: true,
	components:[
		{content: "this is the tour page"}
	],
	create: function(){
		this.inherited(arguments);
	}
	/*
		Button top-right to exit tour

		SnapScroller with images in center, one large background image.
		

	*/
	
});
