enyo.kind({
	name: "articlePage",
	kind: "Page",
	fit: true,
	published: {
		articles: []
	},
	components:[
		{content: "this is the article list"},
		{name: "articleList", showing: false, content: "LALAL"},
		{name: "articleCards", showing: false}

		//for article card rendering
		//render 15-20 in the beginning.
		//at ends, render 10 more, kill 10 on opposite edge?
		//snap scroller, stretchable width.
		//300 width minimum
		//300-590 width of one card. 600-890 width of two cards. 900+ width of three cards.
	],
	create: function(){
		this.inherited(arguments);
		//if(pref.readingStyle === "list"){
			this.$.articleList.show();
		//} else {
			//this.$.articleCards.show();
		//}
	},

	articlesChanged: function(){
		console.log("LOAD DEM ARTICLES", this.getArticles());
	}
	
});
