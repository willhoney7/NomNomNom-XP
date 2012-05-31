enyo.kind({
	name: "articlePage",
	kind: "Page",
	fit: true,
	handlers: {
		onShowGridPage: "",
		onViewArticle: ""
	},
	components:[
		{kind: "onyx.Toolbar", classes: "onyx-toolbar-inline", components: [
			{kind: "onyx.Button", content: "Grid", ontap: "bubbleEvent", eventToBubble: "onShowGridPage", opts: {refresh: true}, classes: "abs", style: "left: 10px;"},
			{name: "subTitle", content: "", classes: "subTitle center", style: "text-align: center"},
			{name: "includeReadButton", kind: "onyx.Button", content: "Include Read", ontap: "toggleIncludeUnread", classes: "abs", style: "right: 10px;"}
		]},

		/**/
		{kind: "ArticlePanel", classes: "enyo-fit", onSetupItem: "setupItem"}
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
			this.activate();
			this.resized();
		}
	},

	resized: function() {
		this.inherited(arguments);

		this.$.articlePanel.resized();
	},

	activate: function () {
		this.$.articlePanel.refreshSettings();
		this.$.articlePanel.clearCurrentArticle();
	},

	bubbleEvent: function(inSender, inEvent){
		this.bubble(inSender.eventToBubble, inSender.opts);
	},


	articles: [],
	loadArticles: function(sub, articles){
		console.log("LOAD DEM ARTICLES");
		this.$.includeReadButton.addRemoveClass("active", AppPrefs.get("includeRead"));
    	this.$.subTitle.setContent(sub.title);
    	this.$.articlePanel.loadArticles(sub, articles);

	},
	toggleIncludeUnread: function (inSender){
		AppPrefs.set("includeRead", !AppPrefs.get("includeRead"));
		inSender.addRemoveClass("active", AppPrefs.get("includeRead"));
		this.$.articlePanel.orderAndShowArticles();
	},


});

enyo.kind({
	name: "ArticlePanel",
	kind: "Panels",
	fit: true,
	classes: "articlePanel enyo-unselectable",
	arrangerKind: "CarouselArranger",
	handlers: {
		onSetupItem: ""
	},
	components: [
		{name: "left", classes: "articleList", layoutKind: "FittableRowsLayout", components: [
			{name: "list", kind: "List", count: 0, multiSelect: false, fit: true, classes: "list", onSetupItem: "setupItem", components: [
				{name: "divider", classes: "divider"},
				{name: "item", classes: "item enyo-border-box", ontap: "viewArticle", components: [
					{name: "articleTime", classes: "articleTime"},
					{name: "unreadIndicator", fit: true, classes: "unreadIndicator"},
					{name: "articleTitle", classes: "articleTitle", allowHtml: true},
					{name: "articleSubtitle", classes: "articleSubtitle", allowHtml: true},
				]}
			]},
			{kind: "onyx.Toolbar", classes: "onyx-toolbar-inline", components: [
				{kind: "onyx.Button", content: "CHECK", ontap: "markAllRead"},
			]},		
		]},
		{name: "body", Xfit: true, style: "Xwidth: 100%;", layoutKind: "FittableRowsLayout", classes: "articleView", components: [
			{kind: "enyo.Scroller", fit: true, components: [
				{name: "articleViewTime", allowHtml: true, classes: "articleTime"},
				{name: "articleViewTitle", allowHtml: true, classes: "articleTitle"},
				{name: "articleViewContent", allowHtml: true, fit: true, classes: "articleContent"}
			]},
			{kind: "onyx.Toolbar", classes: "onyx-toolbar-inline", components: [
				{kind: "onyx.Grabber"},
				{kind: "onyx.Button", content: "v", ontap: "increaseIndex"},
				{kind: "onyx.Button", content: "^", ontap: "decreaseIndex"},
			]},
		]}
	],
	rendered: function() {
		this.size();
		this.inherited(arguments);

	},
	resizeHandler: function() {
		this.size();
		this.$.grabber.setShowing(window.innerWidth < 800);
		this.inherited(arguments);
	},
	size: function() {
		var b = this.$.left.getBounds();
		this.$.body.applyStyle("width", (this.getBounds().width - b.width) + "px")
	},
	refreshSettings: function(){
		this.$.list.refresh();
	},

	loadArticles: function(sub, articles){

		var obj = _.groupBy(articles, function(item){ return reader.isRead(item) });
    	this.unreadArticles = obj.false || [], this.readArticles = obj.true || [];
    	this.sub = sub;

    	this.orderAndShowArticles();
	},
	orderAndShowArticles: function(){
		var toSort = AppPrefs.get("includeRead") ? this.unreadArticles.concat(this.readArticles) : this.unreadArticles;
    	this.articles = _(toSort).sortBy(function(article){
			return (1 - article.updated);
		});

		this.$.list.setCount(this.articles.length);
		this.$.list.reset();
	},
	setupItem: function(inSender, inEvent) {
		// this is the row we're setting up
		var i = inEvent.index;
		var item = this.articles[i];
		if(item){
			// apply selection style if inSender (the list) indicates that this row is selected.
			this.$.item.addRemoveClass("article-selected", inSender.isSelected(i));//(this.articleIndex === i));
			this.$.item.setClasses("item enyo-border-box " + AppPrefs.get("articleFontSize"));

			this.$.articleTitle.setContent(item.title);
			this.$.unreadIndicator.setShowing(!reader.isRead(item));
			this.$.articleTime.setContent(moment.unix(item.updated).format("h:mm a"));

			this.$.articleSubtitle.setContent("<b>" + item.feed.title + "</b>" + ((item.preview && item.preview.length > 0) ? " - " + item.preview : ""));

			if (!this.hideDivider) {
				var date = moment.unix(item.updated).format("MMM Do");
				var prev = this.articles[i-1];
				this.$.divider.setContent(date);
				this.$.divider.canGenerate = date != (prev &&  moment.unix(prev.updated).format("MMM Do"));
			}
		}

	},
	viewArticle: function(inSender, inEvent){
		this.articleIndex = inEvent.index;
		this.showCurrentArticle();
		this.next();
	},

	showCurrentArticle: function(){
		var item = this.articles[this.articleIndex];

		this.$.articleViewTitle.setContent(item.title);
		this.$.articleViewContent.setContent(item.content);		
		this.$.articleViewTime.setContent(moment.unix(item.updated).format("h:mm a"));

		if(AppUtils.stringToBool(item.read) === false){

			AppUtils.testInternetConnection(function(hasInternet){
				if(hasInternet){
					item.read = true;
	
					reader.background.markRead(item, function(){
						publish("refreshGrid");
					});
				} else {
					console.log("QUEUEING");
				}
			
			});

			/*reader.setItemTag(item.feed.id, item.id, "read", true, enyo.bind(this, function(){
				console.log("marked read", item);

				databaseHelper.markArticlesRead([item], enyo.bind(this, function(){
					console.log("read articles saved methinks");

					reader.decrementUnreadCount(item.feed.id, 1);

					databaseHelper.saveSubs(reader.getFeeds());

				}));

			}));*/
		} 

		this.$.list.select(this.articleIndex, item);

	},
	clearCurrentArticle: function () {
		this.$.articleViewTitle.setContent("");
		this.$.articleViewContent.setContent("");		
		this.$.articleViewTime.setContent("");	
	},

	increaseIndex: function(){
		if(this.articles[this.articleIndex + 1]){
			this.articleIndex++;
		}
		this.showCurrentArticle();
	},
	decreaseIndex: function(){
		if(this.articles[this.articleIndex - 1]){
			this.articleIndex--;
		}
		this.showCurrentArticle();
	},

	markAllRead: function () {
		AppUtils.testInternetConnection(enyo.bind(this, function(hasInternet){
			if(hasInternet){
				reader.markAllAsRead(this.sub.id, enyo.bind(this, function(){
			
					_(this.articles).each(function(item){
						item.read = true;
					});

					databaseHelper.markArticlesRead(this.unreadArticles, enyo.bind(this, function(){
						console.log("read articles saved methinks");

						_.each(this.unreadArticles, function(article){
							reader.decrementUnreadCount(article.feed.id, 1);
						});

						databaseHelper.saveSubs(reader.getFeeds());

					}));

					this.$.list.refresh();

				}));	

			} else {
				console.log("QUEUEING");
			}
			

		}));
		
	},
});
