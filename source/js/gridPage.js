enyo.kind({
	name: "gridPage",
	kind: "Page",
	fit: true,
	layoutKind: "FittableRowsLayout",
	handler: {
		onViewArticles: "",
		onShowSettingsPage: "",
		onShowAddFeedPage: ""
	},
	components:[
		{kind: "enyo.Scroller", fit: true, horizontal: false, classes: "grid", components: [
			{name: "grid", kind: enyo.Repeater, fit: true, count: 0, onSetupItem: "setupGridItem", components: [
			    {kind: "gridItem", ontap: "loadGridItem"}
			]},
		]},

		{kind: "onyx.Toolbar", classes: "onyx-toolbar-inline", components: [
			{content: "NomNomNomXP", classes: "truncating-text"},
			{kind: "onyx.IconButton", classes: "floatRight", src: getImagePath("menu-icon-settings.png"), ontap: "bubbleEvent", eventToBubble: "onShowSettingsPage"},
			{kind: "onyx.IconButton", classes: "floatRight", src: getImagePath("menu-icon-refresh.png"), ontap: "loadFeedsFromOnline"},
			{kind: "onyx.IconButton", classes: "floatRight", src: getImagePath("menu-icon-new.png"), ontap: "bubbleEvent", eventToBubble: "onShowAddFeedPage"}
		]},
		
	],

	create: function () {
		this.inherited(arguments);
	},

	showingChanged: function(previousValue) {
		this.inherited(arguments);

		if(this.getShowing() && previousValue !== undefined){
			this.activate();
		}
	},

	activate: function(){
		console.log("gridPage activated");

		//some bugs with fit:true?
		this.resized();

		//load the grid
		this.loadGrid();

	},

	bubbleEvent: function (inSender, inEvent) {
		this.bubble(inSender.eventToBubble);
	},

	gridItems: [],
	loadGrid: function(){
		databaseHelper.loadSubs(enyo.bind(this, function(subs){
			console.log("SUBS LOADED FROM DB")
			this.buildGrid(subs);
		}));

		//this.loadFeedsFromOnline();

		/*//get our array
		this.gridItems = [
			{dog: "fido"},{dog: "bob"},{dog: "gary"},{dog: "spencer"},{dog: "carl"},{dog: "cary"},{dog: "peter"},{dog: "jerry"},
			{dog: "fido"},{dog: "bob"},{dog: "gary"},{dog: "spencer"},{dog: "carl"},{dog: "cary"},{dog: "peter"},{dog: "jerry"},
			{dog: "fido"},{dog: "bob"},{dog: "gary"},{dog: "spencer"},{dog: "carl"},{dog: "cary"},{dog: "peter"},{dog: "jerry"},
		];*/

	}, 
	buildGrid: function(items){
		this.gridItems = items;
		this.$.grid.setCount(this.gridItems.length);
		this.$.grid.build();			

	},
	loadFeedsFromOnline: function(){
		reader.loadFeeds(enyo.bind(this, function (subs){
			console.log("New Subs loaded from online");

			reader.getItems(subs[0].id, enyo.bind(this, 
				function(unreadArticles){

					reader.getItems(reader.TAGS['read'], enyo.bind(this, 
						function(readArticles){

							databaseHelper.saveArticles(unreadArticles, readArticles, enyo.bind(this, function(){
								console.log("articles saved! time to move on");

								if(!_.isEqual(subs, this.gridItems)){
									databaseHelper.saveSubs(subs);
									this.buildGrid(subs)	
								} else {
									console.log("Subs are the same");
								}
							}));

						}), {n: 50, ot: moment().subtract("days", 3).unix()}
					);
				}), {n: subs[0].count, xt: reader.TAGS['read']}
			);


			
		}));
	},

	setupGridItem: function (inSender, inEvent) {
		if(this.gridItems[inEvent.index]){
			inEvent.item.$.gridItem.setItem(this.gridItems[inEvent.index]);
	    	return true;
    	} 
	},

	loadGridItem: function (inSender, inEnvent) {
		console.log("loading this sub", inSender.getItem());
		var opts = {};
		if(inSender.getItem().isFeed){
			opts.feed = inSender.getItem().id;
		} else if (inSender.getItem().isLabel) {
			opts.feed = [];
			_.each(inSender.getItem().feeds, function(feed){
				opts.feed.push(feed.id);
			});
		} else if (inSender.getItem().isAll){
			//do nothing
		}
		//console.log("opts", opts);
		databaseHelper.loadArticles(opts, enyo.bind(this, function(articles){
			if(articles.length < inSender.getItem().count){
				console.log("Uh oh, cache failed", articles);
				reader.getItems(inSender.getItem().id, enyo.bind(this, function(loadedArticles){
					this.bubble("onViewArticles", {articles: loadedArticles});
				}), {n: inSender.getItem().count, xt: reader.TAGS['read']});
			} else {
				console.log("Articles loaded from cache", articles.length);
				this.bubble("onViewArticles", {sub: inSender.getItem(), articles: buildArticlesArray(articles)});
			}
		}));

		/*var fakeArticlesArray = [];
		
		for (var i = 0; i < 80; i++) {
			fakeArticlesArray.push({title: inSender.getItem().dog + Math.round(Math.random()*200), date: "4/" + Math.round(i/2) + "/12"});
		};
		this.bubble("onViewArticles", {articles: fakeArticlesArray});*/
	},

	
});


enyo.kind({
	name: "gridItem",
	kind: "Control",
	classes: "grid-item",
	published: {
		item: {}
	},
	components: [
		{kind: "enyo.Image", src: ""},
		{kind: "enyo.Control", classes: "title", allowHtml: true},
		{name: "icon", kind: "Image", classes: "icon"},
		{name: "unread", classes: "unread"}
	],
	itemChanged: function(inSender, inOldItem) {
		var img;
		if(this.getItem().isAll) {
			img = "all";
		} else if (this.getItem().isSpecial){
			img = this.getItem().title.toLowerCase(); //shared or starred
			
		} else if (this.getItem().isLabel){
			img = "folder";
		} else {
			img = "feed";
			this.$.icon.setSrc(reader.getIconForFeed(this.getItem().id.replace(/feed\//, "")));
		}
		this.$.image.setSrc(getImagePath("grid-icon-" + img + ".png"));
		this.$.control.setContent(this.getItem().title);
		this.$.unread.setContent((this.getItem().count >= 1000) ? "1000+" : this.getItem().count);
	}

});