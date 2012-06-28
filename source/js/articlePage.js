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
			{kind: "enyo.Scroller", fit: true, classes: "contentBackground", horizontal: "hidden", components: [
				{name: "list", kind: "Repeater", count: 0, multiSelect: false, fit: true, classes: "list", onSetupItem: "setupItem", components: [
					{name: "divider", classes: "divider"},
					{kind: "articleItem", onSwipedRight: "viewArticle", ontap: "viewArticle"}

				]},
			]},
			{kind: "onyx.Toolbar", classes: "onyx-toolbar-inline", components: [
				{kind: "onyx.IconButton", src: AppUtils.getImagePath("menu-icon-mark-read.png"), ontap: "markAllRead"},
				{name: "includeReadButton", kind: "onyx.Button", content: "Include Read", ontap: "toggleIncludeUnread", classes: "abs", style: "right: 10px;"}

			]},		
		]},
		{name: "body", Xfit: true, style: "Xwidth: 100%;", layoutKind: "FittableRowsLayout", classes: "articleView", components: [
			{kind: "enyo.Scroller", fit: true, classes: "contentBackground", components: [
				{name: "articleViewTime", allowHtml: true, classes: "articleTime"},
				{name: "articleViewTitle", allowHtml: true, classes: "articleTitle"},
				{name: "articleViewContent", allowHtml: true, fit: true, classes: "articleContent"}
			]},
			{kind: "onyx.Toolbar", classes: "onyx-menu-toolbar", components: [
				{kind: "onyx.Grabber", style: "position: absolute;"},
				{classes: "center", components: [
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
		//this.$.list.refresh();
		//if(this.articles)
		this.$.list.build();
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
		//this.$.list.reset();
	},
	setupItem: function(inSender, inEvent) {
		// this is the row we're setting up
		//console.log(inEvent);

		var i = inEvent.index,
			item = this.articles[i],
			listItem = inEvent.item.$.articleItem, // this.$.articleItem
			divider = inEvent.item.$.divider; // this.$.articleItem

		if(item){
			listItem.setItem(item);
			// apply selection style if inSender (the list) indicates that this row is selected.
			//this.$.articleItem.setClasses("item enyo-border-box " + AppPrefs.get("articleFontSize"));
			//listItem.addRemoveClass("article-selected", inSender.isSelected(i));//(this.articleIndex === i));

			if (!this.hideDivider) {
				var date = moment.unix(item.updated).format("MMM Do");
				var prev = this.articles[i-1];
				divider.setContent(date);
				divider.canGenerate = date != (prev &&  moment.unix(prev.updated).format("MMM Do"));
			}
			return true;
		}

	},
	viewArticle: function(inSender, inEvent){
		console.log("CLICK EVENT", this.handlingDrag);

		if(!this.handlingDrag){
			this.articleIndex = inEvent.index;
			this.showCurrentArticle();
			this.next();
		} else {
			return true;
		}
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
			try {
				document.querySelector(".articleContent img").className = "firstImage";
			} catch (e) {};
		}

		//this.$.list.renderRow(this.articleIndex);
		setTimeout(enyo.bind(this, function () {
			_.find(this.$.list.getClientControls(), enyo.bind(this, function (control) {
				return (control.index === this.articleIndex);
			})).controls[1].animateToRead();
		}), 0);
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
		reader.background.markAllRead(_.reject(this.articles, function(article) { return reader.isRead(article) }), enyo.bind(this, function(){
			_.each(this.articles, function(article) {
				article.read = true;
			});
			this.refreshSettings();
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
			AppUtils.testInternetConnection(function(hasInternet){
				if (hasInternet) {
					service.add({title: item.title, url: item.url}, enyo.bind(this, function (response) {
						console.log(response);
						humane.log("Sent!");
					}));
				} else {
					console.log("QUEUE");

					databaseHelper.queue({action: "sendToService", data: {item: item, service: inSender.service}});
					humane.log("Queued!");
				}

			});
	
		} else {
			humane.log("You need to log in first!");
			//@TODO: go to preferences
		}

	}
});


enyo.kind({
	name: "articleItem",
	kind: "onyx.SwipeableItem",
	published: {
		item: {}
	},
	events: {
		onAnimateToRead: "animateToRead"
	},
	defaultContentClasses: "item onyx-swipeable-item-content",
	components: [
		{name: "client", kind: "SpecialSlideable", value: 0, min: 0, max: 50, unit: "px", ondragstart: "clientDragStart", ondragfinish: "clientDragFinish", onSwipedLeft: "toggleRead", components: [
			{name: "unreadIndicator", classes: "itemUnreadIndicator"},
			{name: "leftShadow", classes: "leftShadow"},
			{name: "articleTime", classes: "articleTime"},
			{name: "articleTitle", classes: "articleTitle", allowHtml: true},
			{name: "articleSubtitle", classes: "articleSubtitle", allowHtml: true},
		]},
		{name: "confirm", classes: "onyx-swipeable-item-confirm enyo-fit unreadIndicatorContainer", components: [
			{name: "secondUnreadIndicator", classes: "unreadIndicator"},
		]},


	],
	itemChanged: function () {
		this.$.articleTitle.setContent(this.getItem().title);
		this.$.unreadIndicator.applyStyle("opacity", reader.isRead(this.getItem()) ? 0 : 1)
		this.$.secondUnreadIndicator.applyStyle("opacity", reader.isRead(this.getItem()) ? 0 : 1)
		this.$.leftShadow.applyStyle("opacity", reader.isRead(this.getItem()) ? 0 : 1)
		//this.$.unreadIndicator.setShowing(!reader.isRead(this.getItem()));
		this.$.articleTime.setContent(moment.unix(this.getItem().updated).format("h:mm a"));

		this.$.articleSubtitle.setContent("<b>" + this.getItem().feed.title + "</b>" + ((this.getItem().preview && this.getItem().preview.length > 0) ? " - " + this.getItem().preview : ""));
	},
	toggleRead: function (inSender, inEvent) {
		console.log("TOGGLE READ AT ITEM", this.getItem());
		
		var item = this.getItem();

		console.log("toggleRead", item);

		item.read = !AppUtils.stringToBool(item.read);

		reader.background.markRead(item, function(){
			publish("reloadGrid");
		});

		console.log("Set to", item.read);

		this.$.unreadIndicator.applyStyle("opacity", reader.isRead(item) ? 0 : 1);
		this.$.secondUnreadIndicator.applyStyle("opacity", reader.isRead(item) ? 0 : 1);
		this.$.leftShadow.applyStyle("opacity", reader.isRead(item) ? 0 : 1);
		//this.$.unreadIndicator.setShowing(!reader.isRead(item));
		//this.$.secondUnreadIndicator.setShowing(!reader.isRead(item));
	},
	animateToRead: function (inSender, inItem) {

		var item = this.getItem();

		//if(inItem.id !== item.id)
		//	return;

		this.$.unreadIndicator.applyStyle("opacity", reader.isRead(item) ? 0 : 1);
		this.$.secondUnreadIndicator.applyStyle("opacity", reader.isRead(item) ? 0 : 1);
		this.$.leftShadow.applyStyle("opacity", reader.isRead(item) ? 0 : 1);	
	},
	clientDragStart: function(inSender, inEvent) {
		if (inSender.dragging) {
			var flyweight = inEvent.flyweight;
			if (flyweight) {
				flyweight.prepareRow(inEvent.index);
				// if needed, render confirm.
				// NOTE: position relative so can enyo-fit confirm; apply only when confirm needed
				// because it's a known rendering slowdown.
				this.applyStyle("position", "relative");
				this.$.confirm.setShowing(true);
				if (!this.$.confirm.hasNode()) {
					// NOTE: prepend so Slideable will be on top.
					this.$.confirm.prepend = true;
					this.$.confirm.render();
					this.$.confirm.prepend = false;
				}
				// note: can't teardown.
			} else {
				this.applyStyle("position", "relative");
				this.$.confirm.setShowing(true);
			}

			clearTimeout(this.dragFinishTimeout);
		}
	},
	clientDragFinish: function (inSender, inEvent) {
		this.dragFinishTimeout = setTimeout(enyo.bind(this, function () {
			this.applyStyle("position", null);
			this.$.confirm.setShowing(false);
		}), 500);

	}
});

enyo.kind({
	name: "SpecialSlideable",
	kind: "Slideable",
	handlers: {
		onSwipedLeft: "",
		onSwipedRight: ""
	},
	dragstart: function(inSender, inEvent) {

		if (this.shouldDrag(inEvent)) {

			if (inEvent.dx > 0) {
				this.swipedLeftFunc = _.once(enyo.bind(this, function() {
					this.bubble("onSwipedLeft", inEvent);
				}));

				inEvent.preventDefault();
				this.$.animator.stop();
				inEvent.dragInfo = {};
				this.dragging = true;
				this.drag0 = this.value;
				this.dragd0 = 0;
				return this.preventDragPropagation;
			} else {
				this.bubble("onSwipedRight", inEvent);
			}
		}
	},
	drag: function(inSender, inEvent) {
		if (this.dragging) {
			inEvent.preventDefault();
			var d = inEvent[this.dragMoveProp] * this.kDragScalar;
			var v = this.drag0 + d;
			var dd = d - this.dragd0;
			this.dragd0 = d;
			if (dd) {
				inEvent.dragInfo.minimizing = dd < 0;
			}
			if (v > 30) {
				this.swipedLeftFunc();
				v = 30;
			}
			this.setValue(v);
			return this.preventDragPropagation;
		}
	},
	dragfinish: function(inSender, inEvent) {
		if (this.dragging) {
			this.dragging = false;
			inEvent.preventTap();

			this.animateTo(0);

			return this.preventDragPropagation;
		}
	},
})