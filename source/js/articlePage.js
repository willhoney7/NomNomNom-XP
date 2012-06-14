enyo.kind({
	name: "articlePage",
	fit: true,
	handlers: {
		onShowGridPage: "",
		onViewArticle: ""
	},
	components:[
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
    	this.$.articlePanel.loadArticles(sub, articles);

	}


});

enyo.kind({
	name: "ArticlePanel",
	kind: "Panels",
	fit: true,
	classes: "articlePanel enyo-unselectable",
	arrangerKind: "CarouselArranger",
	handlers: {
		onSetupItem: "",
		onShowGridPage: ""
	},
	components: [
		{name: "left", classes: "articleList", layoutKind: "FittableRowsLayout", components: [
			{kind: "onyx.Toolbar", classes: "onyx-toolbar-inline", components: [
				{kind: "onyx.IconButton", src:AppUtils.getImagePath("menu-icon-home.png"), ontap: "bubbleEvent", eventToBubble: "onShowGridPage", opts: {refresh: true}, classes: "abs", style: "left: 10px; margin: auto;"},
				{name: "subTitle", content: "", classes: "subTitle center", style: "text-align: center"},
			]},
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
				{kind: "onyx.IconButton", src: AppUtils.getImagePath("menu-icon-mark-read.png"), ontap: "markAllRead"},
				{name: "includeReadButton", kind: "onyx.Button", content: "Include Read", ontap: "toggleIncludeUnread", classes: "abs", style: "right: 10px;"}

			]},		
		]},
		{name: "body", Xfit: true, style: "Xwidth: 100%;", layoutKind: "FittableRowsLayout", classes: "articleView", components: [
			{kind: "enyo.Scroller", fit: true, components: [
				{name: "articleViewTime", allowHtml: true, classes: "articleTime"},
				{name: "articleViewTitle", allowHtml: true, classes: "articleTitle"},
				{name: "articleViewContent", allowHtml: true, fit: true, classes: "articleContent"}
			]},
			{kind: "onyx.Toolbar", classes: "onyx-menu-toolbar", components: [
				{kind: "onyx.Grabber", style: "position: absolute;"},
				{classes: "center", style: "margin: inherit", components: [
					{kind: "onyx.IconButton", src: AppUtils.getImagePath("menu-icon-mark-read.png"), ontap: ""},
					{name: "starredIcon", kind: "onyx.IconButton", src: AppUtils.getImagePath("menu-icon-starred-outline.png"), ontap: "toggleStarred"},
					{kind: "onyx.IconButton", src: AppUtils.getImagePath("menu-icon-down.png"), ontap: "increaseIndex"},
					{kind: "onyx.IconButton", src: AppUtils.getImagePath("menu-icon-up.png"), ontap: "decreaseIndex"},
					{kind: "onyx.MenuDecorator", classes: "onyx-icon", components: [
						{kind: "onyx.IconButton", src: AppUtils.getImagePath("menu-icon-share.png")},
						{kind: "onyx.Menu", classes: "opensUp", components: [
							{content: "Send to Pocket", ontap: "sendTo", service: "readitlater"},
							{content: "Send to Instapaper", ontap: "sendTo", service: "instapaper"},
							{content: "Send to Delicious", ontap: "sendTo", service: "delicious"},
							{content: "Send to Pinboard", ontap: "sendTo", service: "pinboard"},
						]}
					]}
				]}
				
			]},
		]}
	],
	rendered: function() {
		this.size();
		this.inherited(arguments);

		var newHumane = humane.create();
			newHumane.log(window.innerWidth + " " + AppUtils.getPixelRatio());

	},
	resizeHandler: function() {
		this.size();

		this.$.grabber.setShowing(parseInt(window.innerWidth) < 800);
		this.inherited(arguments);
	},
	size: function() {
		var b = this.$.left.getBounds();
		this.$.body.applyStyle("width", (this.getBounds().width - b.width) + "px")
	},
	bubbleEvent: function(inSender, inEvent){
		this.bubble(inSender.eventToBubble, inSender.opts);
	},
	refreshSettings: function(){
		this.$.list.refresh();
	},

	loadArticles: function(sub, articles){

    	this.$.includeReadButton.addRemoveClass("active", AppPrefs.get("includeRead"));

		var obj = _.groupBy(articles, function(item){ return reader.isRead(item) });
    	this.unreadArticles = obj.false || [], this.readArticles = obj.true || [];
    	this.sub = sub;

    	this.orderAndShowArticles();

    	this.previous();

    	this.$.subTitle.setContent(sub.title);

	},
	orderAndShowArticles: function(){
		var toSort = AppPrefs.get("includeRead") ? this.unreadArticles.concat(this.readArticles) : this.unreadArticles;
    	this.articles = _(toSort).sortBy(function(article){
    		if(AppPrefs.get("articleSort") === "Recent First"){
				return (1 - article.updated);
    		} else {
    			return article.updated;
    		}
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
		this.$.articleViewContent.setContent(mobilizeText(item.content));	
		this.$.articleViewTime.setContent(moment.unix(item.updated).format("h:mm a"));
		this.$.starredIcon.setSrc(reader.isStarred(item) ? AppUtils.getImagePath("menu-icon-starred.png") : AppUtils.getImagePath("menu-icon-starred-outline.png"));

		if(AppUtils.stringToBool(item.read) === false){

			item.read = true;

			reader.background.markRead(item, function(){
				publish("reloadGrid");
			});

		} 

		if (!document.querySelector) {
			console.error("OH NOES NO QUERY SELECTOR");
		} else {
			document.querySelector(".articleContent img").className = "firstImage";
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

	toggleStarred: function () {
		var item = this.articles[this.articleIndex]
		console.log("isStarred", reader.isStarred(item));

		item.starred = !reader.isStarred(item);
		reader.background.markStarred(item);

		this.$.starredIcon.setSrc(reader.isStarred(item) ? AppUtils.getImagePath("menu-icon-starred.png") : AppUtils.getImagePath("menu-icon-starred-outline.png"));

	},

	markAllRead: function () {
		console.log(_.reject(this.articles, function(article) { return reader.isRead(article) }));
		reader.background.markAllRead(this.sub, _.reject(this.articles, function(article) { return reader.isRead(article) }), enyo.bind(this, function(){
			this.$.list.refresh();
		}));
		
	},

	toggleIncludeUnread: function (inSender){
		AppPrefs.set("includeRead", !AppPrefs.get("includeRead"));
		inSender.addRemoveClass("active", AppPrefs.get("includeRead"));
		this.orderAndShowArticles();
	},

	sendTo: function (inSender) {
		var item = this.articles[this.articleIndex];
		if(!item)
			return;

		this.$.menu.hide();

		var service = new serviceWrapper(inSender.service);

		if(AppPrefs.get(inSender.service + "Authenticated")){
			service.add({title: item.title, url: item.url}, enyo.bind(this, function (response) {
				console.log(response);
				humane.log("Sent!");
			}));
		} else {
			humane.log("You need to log in first!");
			//@TODO: go to preferences
		}

	}
});
