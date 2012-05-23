enyo.kind({
	name: "articlePage",
	kind: "Page",
	fit: true,
	published: {
		articles: []
	},
	handlers: {
		onShowGridPage: ""
	},
	components:[
		{kind: "onyx.Toolbar", classes: "onyx-toolbar-inline", components: [
			{kind: "onyx.Button", content: "Back", ontap: "bubbleEvent", eventToBubble: "onShowGridPage", classes: "abs"},
			{content: "hai", classes: "center", style: "text-align: center"}
		]},
		{name: "list", kind: "List", rows: 0, multiSelect: false, classes: "enyo-fit list", onSetupRow: "setupRow", components: [
			{name: "divider", classes: "divider"},
			{name: "item", classes: "item enyo-border-box", components: [
				{classes: "unreadIndicator"},
				{name: "name"},
			]}
		]}
	],
	
		//for article card rendering
		//render 15-20 in the beginning.
		//at ends, render 10 more, kill 10 on opposite edge?
		//snap scroller, stretchable width.
		//300 width minimum
		//300-590 width of one card. 600-890 width of two cards. 900+ width of three cards
	create: function(){
		this.inherited(arguments);
		//if(pref.readingStyle === "list"){
			//this.$.articleList.show();
		//} else {
			//this.$.articleCards.show();
		//}
	},

	bubbleEvent: function(inSender, inEvent){
		this.bubble(inSender.eventToBubble);
	},

	articlesChanged: function(){
		console.log("LOAD DEM ARTICLES", this.getArticles());

		this.$.list.setRows(this.getArticles().length);
		this.$.list.reset();
	},

	setupRow: function(inSender, inEvent) {
		// this is the row we're setting up
		var i = inEvent.index;
		var item = this.getArticles()[i];
		if(item){
			// apply selection style if inSender (the list) indicates that this row is selected.
			//this.$.item.addRemoveClass("onyx-selected", inSender.isSelected(i));
			var string = "";
			for (var i = 0; i < Math.round(Math.random() * 150); i++) {
				string += (item.title + " ");
			};
			this.$.name.setContent(string);

			if (!this.hideDivider) {
				var prev = this.getArticles()[i-1];
				this.$.divider.setContent(item.date);
				this.$.divider.canGenerate = item.date != (prev && prev.date);;
			}
		}
	}


	
});
