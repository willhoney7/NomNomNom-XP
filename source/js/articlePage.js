enyo.kind({
	name: "articlePage",
	kind: "Page",
	fit: true,
	handlers: {
		onShowGridPage: ""
	},
	components:[
		{kind: "onyx.Toolbar", classes: "onyx-toolbar-inline", components: [
			{kind: "onyx.Button", content: "Back", ontap: "bubbleEvent", eventToBubble: "onShowGridPage", classes: "abs", style: "left: 10px;"},
			{name: "subTitle", content: "", classes: "subTitle center", style: "text-align: center"},
			{name: "includeReadButton", kind: "onyx.Button", content: "Include Read", ontap: "toggleIncludeUnread", classes: "abs", style: "right: 10px;"}
		]},
		{name: "list", kind: "List", rows: 0, multiSelect: false, classes: "enyo-fit list", onSetupRow: "setupRow", components: [
			{name: "divider", classes: "divider"},
			{name: "item", classes: "item enyo-border-box", components: [
				{name: "articleTime", classes: "articleTime"},
				{name: "unreadIndicator", fit: true, classes: "unreadIndicator"},
				{name: "articleTitle", classes: "articleTitle", allowHtml: true},
				{name: "articleSubtitle", classes: "articleSubtitle", allowHtml: true},
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

	showingChanged: function(previousValue) {
		this.inherited(arguments);

		if(this.getShowing() && previousValue !== undefined){
			//this.activate();
		}
	},

	bubbleEvent: function(inSender, inEvent){
		this.bubble(inSender.eventToBubble);
	},



	articles: [],
	loadArticles: function(sub, articles){
		console.log("LOAD DEM ARTICLES");
		this.$.includeReadButton.addRemoveClass("active", AppPrefs.get("includeRead"));
		var obj = _.groupBy(articles, function(item){ return reader.isRead(item) });
    	this.unreadArticles = obj.false || [], this.readArticles = obj.true || [];
    	this.sub = sub;

    	this.$.subTitle.setContent(sub.title);
    	this.orderAndShowArticles();
	},
	orderAndShowArticles: function(){
		var toSort = AppPrefs.get("includeRead") ? this.unreadArticles.concat(this.readArticles) : this.unreadArticles;
    	this.articles = _(toSort).sortBy(function(article){
			return (1 - article.updated);
		});

		this.$.list.setRows(this.articles.length);
		this.$.list.reset();
	},
	toggleIncludeUnread: function (inSender){
		AppPrefs.set("includeRead", !AppPrefs.get("includeRead"));
		inSender.addRemoveClass("active", AppPrefs.get("includeRead"));
		this.orderAndShowArticles();
	},

	setupRow: function(inSender, inEvent) {
		// this is the row we're setting up
		var i = inEvent.index;
		var item = this.articles[i];
		if(item){
			// apply selection style if inSender (the list) indicates that this row is selected.
			//this.$.item.addRemoveClass("onyx-selected", inSender.isSelected(i));

			//console.log(item);
			this.$.articleTitle.setContent(item.title);
			this.$.unreadIndicator.setShowing(!reader.isRead(item));
			this.$.articleTime.setContent(moment.unix(item.updated).format("h:mm a"));

			this.$.articleSubtitle.setContent("<b>" + item.origin.title + "</b> - " + _(htmlToText(item.summary.content)).prune(50));

			if (!this.hideDivider) {
				var date = moment.unix(item.updated).format("MMM Do");
				var prev = this.articles[i-1];
				this.$.divider.setContent(date);
				this.$.divider.canGenerate = date != (prev &&  moment.unix(prev.updated).format("MMM Do"));
			}
		}
	}


	
});
