enyo.kind({
	name: "gridPage",
	kind: "Page",
	fit: true,
	components:[
		{content: "this is the grid WORLD"}
	],

	showingChanged: function(previousValue) {
		this.inherited(arguments);

		if(this.getShowing() && previousValue !== undefined){
			this.activate();
		}
	},

	activate: function(){
		console.log("gridPage activated");
		//load dem feeds!
	}
	
});
