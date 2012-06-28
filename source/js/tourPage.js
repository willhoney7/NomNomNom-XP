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
		{name: "image", kind: "enyo.Image", src: "assets/bg.png"},
		{content: "this is the tour page"},
	],
	create: function(){
		this.inherited(arguments);
	},
	rendered: function () {
		this.inherited(arguments);

		if(this.$.image.hasNode()) {
			console.log("HAS NODE?");
			var pinchCallback = new GestureCallback( this.$.image.node, function( scale, rotation ){
				humane.log("done", scale, rotation);
			  	console.log('done: '+scale+','+rotation);
			  	alert("DONE? " + scale + " " + rotation);
			  if( scale < 1 ) {
			    // leave the section, since we've pinched it closed
			  }
			}, function( scale, rotation ){
				humane.log("changing", scale, rotation);
			  console.log('changing: '+scale+','+rotation);
			});
		}

	},

	bubbleEvent: function(inSender, inEvent) {
		this.bubble(inSender.eventToBubble);
	}
	
	/*
		Button top-right to exit tour

		SnapScroller with images in center, one large background image.
		

	*/
	
});
