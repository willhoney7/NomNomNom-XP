enyo.kind({
	name: "gridPage",
	fit: true,
	layoutKind: "FittableRowsLayout",
	handler: {
		onViewArticles: "",
		onShowSettingsPage: "",
		onShowAddFeedPage: "",
		onShowEditSubPage: ""
	},
	components:[
		{kind: "enyo.Scroller", fit: true, horizontal: "hidden", classes: "grid", components: [
			{name: "grid", kind: enyo.Repeater, fit: true, count: 0, onSetupItem: "setupGridItem", components: [
			    {kind: "gridItem", ontap: "loadGridItem", onLoadFeed: "loadFeedItem"}
			]},
		]},

		{name: "normalToolbar", kind: "onyx.Toolbar", classes: "onyx-toolbar-inline", components: [
			{name: "titleBar", content: "NomNomNom XP", classes: "titleBarText truncating-text"},
			
			{kind: "onyx.IconButton", classes: "floatRight", src: AppUtils.getImagePath("menu-icon-settings.png"), ontap: "bubbleEvent", eventToBubble: "onShowSettingsPage"},
			{kind: "onyx.IconButton", classes: "floatRight", src: AppUtils.getImagePath("menu-icon-edit-outline.png"), ontap: "enterEditMode"},
			{kind: "onyx.IconButton", classes: "floatRight", src: AppUtils.getImagePath("menu-icon-refresh.png"), ontap: "loadFeedsFromOnline"},
			{kind: "onyx.IconButton", classes: "floatRight", src: AppUtils.getImagePath("menu-icon-new.png"), ontap: "bubbleEvent", eventToBubble: "onShowAddFeedPage"}
		]},
		{name: "editToolbar", kind: "onyx.Toolbar", showing: false, classes: "onyx-toolbar-inline", components: [
			{content: "Edit Mode", classes: "titleBarText truncating-text"},
			{kind: "onyx.Button", content: "Exit", classes: "floatRight", ontap: "exitEditMode"},
		]},
		
	],

	create: function () {
		this.inherited(arguments);

		subscribe("reloadGrid", enyo.bind(this, function(arg){
        	this.loadGrid();
    	}));

    	subscribe("refreshGrid", enyo.bind(this, function(arg){
    		this.loadFeedsFromOnline();
    	}));

    	subscribe("updateTitle", enyo.bind(this, function(arg){
    		this.$.titleBar.setContent(arg);
    	}));

	},
	rendered: function () {
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
	loadGridFromOnline: function(){
		console.log("LOADING GRIDS FROM ONLINE");
		
		AppUtils.wrapWithInternetTest(enyo.bind(this, function(){

			reader.loadFeeds(enyo.bind(this, function (subs){
				if(!_.isEqual(subs, this.gridItems)){
					databaseHelper.saveSubs(subs);
					this.buildGrid(subs)	
				} else {
					console.log("Subs are the same");
				}
			}));

		}))
	},

	loadGrid: function(){
		databaseHelper.loadSubs(enyo.bind(this, function(subs){
			console.log("SUBS LOADED FROM DB");
			this.buildGrid(subs);
		}));

		//this.loadFeedsFromOnline();
	}, 
	buildGrid: function(subs, opts){

		this.gridItems = (AppPrefs.get("hideRead") && !this.inEditMode) ? _.reject(subs, function(sub){
			return (!sub.count && !sub.isSpecial);
		})  : subs;

		if(reader.getFeeds().length === 0){
			reader.setFeeds(subs);
		}
		
		this.$.grid.setCount(this.gridItems.length);

		if(!opts || !opts.noWaterfall)
			this.$.grid.waterfallDown("onChangeOpacity", {inEditMode: (opts && opts.waterfallOpposite) ? !this.inEditMode : this.inEditMode, noTransition: true});
		
		//this.$.grid.build();			

	},
	loadFeedsFromOnline: function(){
		AppUtils.wrapWithInternetTest(enyo.bind(this, function(){

			//humane.remove();humane.remove();humane.remove();
			publish("updateTitle", ["Loading Subscriptions..."]);
			//humane.log("Loading Subscriptions...", {timeout: 50000});

			//console.log("LOADING FEEDS FROM ONLINE");

			reader.loadFeeds(enyo.bind(this, function (subs){
				//console.log("New Subs loaded from online");
				
				//humane.remove();humane.remove();humane.remove();
				
				//humane.log("Loading Articles...", {timeout: 5000000});
				publish("updateTitle", ["Loading Articles..."]);
	
				reader.getItems(subs[0].id, enyo.bind(this, 
					function(unreadArticles){
						//console.log("GOT ITEMS");
						reader.getItems(reader.TAGS['read'], enyo.bind(this, 
							function(readArticles){
								//console.log("GOT MORE ITEMS");
								reader.getItems(reader.TAGS['star'], enyo.bind(this, 
									function(starredArticles){
										//console.log(starredArticles);
										databaseHelper.saveArticles({unread: unreadArticles, read: readArticles, starred: starredArticles}, enyo.bind(this, function(){
											//console.log("articles saved! time to move on");
											publish("updateTitle", ["NomNomNomXP"]);
											//humane.remove();humane.remove();humane.remove();

											if(!_.isEqual(subs, this.gridItems)){
												databaseHelper.saveSubs(subs);
												this.buildGrid(subs)	
											} else {
												console.log("Subs are the same");
											}
										}));								

									}), undefined
								);
							}), {n: 50, ot: moment().subtract("days", 10).unix(), xt: reader.TAGS["star"]}
						);
					}), {n: subs[0].count, xt: reader.TAGS['read']}
				);
			}));

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
		if(!inSender.getItem().isLabel || (AppPrefs.get("folderTap") === "Show Articles" && !this.inEditMode) || inSender.getItem().forceArticles){

			if(inSender.getItem().isFeed){
				opts.feed = inSender.getItem().id;
			} else if (inSender.getItem().isLabel) {
				opts.feed = [];
				_.each(inSender.getItem().feeds, function(feed){
					opts.feed.push(feed.id);
				});
			} else if (inSender.getItem().isAll){
				//do nothing
			} else if(inSender.getItem().isSpecial && !inSender.getItem().isAll){
				//only special feed we have now is starred
				opts.starred = true;
			} 
			//console.log("opts", opts);
			if(this.inEditMode === false) {

				databaseHelper.loadArticles(opts, enyo.bind(this, function(articles){
					if(articles.length === 0){
						humane.log("No Articles to Show", {timeout: 1500});
						return;
					}
					if(articles.length < inSender.getItem().count){
						console.log("Uh oh, cache failed", articles);

						AppUtils.wrapWithInternetTest(enyo.bind(this, function(){

							reader.getItems(inSender.getItem().id, enyo.bind(this, function(loadedArticles){
								this.bubble("onViewArticles", {articles: loadedArticles, sub: inSender.getItem()});
							}), {n: inSender.getItem().count, xt: reader.TAGS['read']});

						}));
					} else {
						console.log("Articles loaded from cache", articles.length);
						this.bubble("onViewArticles", {sub: inSender.getItem(), articles: AppUtils.buildArticlesArray(articles)});
					}
				}));

			} else {
				if(!inSender.getItem().isSpecial){
					console.log("EDIT THIS FEEDDDDD");
					this.bubble("onShowEditSubPage", {sub: inSender.getItem()});
				}
			}
		} else {
			//this is a folder.
			inSender.openFolder();
		}

	},
	//this is for feeds in folders
	loadFeedItem: function(inSender, obj) {
		this.loadGridItem({getItem: function() {
			return obj;
		}});
	},

	inEditMode: false, 
	enterEditMode: function (){
		this.inEditMode = true;

		this.buildGrid(reader.getFeeds(), {noWaterfall: true});

		this.$.grid.waterfallDown("onChangeOpacity", {inEditMode: this.inEditMode});

		this.$.normalToolbar.hide();
		this.$.editToolbar.show();
	},
	exitEditMode: function (){

		this.inEditMode = false;

		this.buildGrid(reader.getFeeds(), {waterfallOpposite: true});

		setTimeout(enyo.bind(this, function () {
			this.$.grid.waterfallDown("onChangeOpacity", {inEditMode: this.inEditMode});
		}), 0);

		this.$.editToolbar.hide();
		this.$.normalToolbar.show();
	}

	
});


enyo.kind({
	name: "gridItem",
	kind: "Control",
	classes: "grid-item",
	published: {
		item: {},
		disabled: false
	},
	handlers: {
		onLoadFeed: "",
		onChangeOpacity: "changeOpacity"
	},
	components: [
		{kind: "enyo.Image", src: ""},
		{kind: "enyo.Control", classes: "title", allowHtml: true},
		{name: "icon", kind: "Image", classes: "icon"},
		{name: "unread", classes: "unread", allowHtml: true},
		{kind: "onyx.MenuDecorator", style: "", components: [
			{kind: "onyx.Menu", name: "menu", modal: false, classes: "folderMenu", style: "", components: []}
		]}
	],
	itemChanged: function(inSender, inOldItem) {

		var img;
		if(this.getItem().isAll) {
			img = "all";
		} else if (this.getItem().isSpecial){
			img = this.getItem().title.toLowerCase(); //shared or starred
			
		} else if (this.getItem().isLabel){
			img = "folder";
			var feeds = [];
			if(this.getItem().feeds.length > 0){
				var item = _(this.getItem()).clone();
					item.content = "All Articles";
					item.ontap = "loadGridItem";
					item.forceArticles = true;
					item.name = "allAtriclesItem"

				feeds.push(item);
			}
			_.each(this.getItem().feeds, function(feed){
				var kind = _(feed).clone();
					kind.ontap = "loadGridItem";
					kind.components = [
						{kind: enyo.Image, classes: "folderFeedIcon floatLeft abs", src: reader.getIconForFeed(feed.id.replace(/feed\//, ""))},
						{content: feed.count ? "(" + feed.count + ")" : "", classes: "folderFeedTitle unreadCount floatRight"},
						{content: feed.title, classes: "folderFeedTitle"}
					];
				feeds.push(kind);
			});
			this.$.menu.destroyComponents();
			this.$.menu.createComponents(feeds, {owner: this});
			this.render();
			
		} else {
			img = "feed";
			this.$.icon.setSrc(reader.getIconForFeed(this.getItem().id.replace(/feed\//, "")));
		}
		this.$.image.setSrc(AppUtils.getImagePath("grid-icon-" + img + ".png"));
		this.$.control.setContent(this.getItem().title);
		if(this.getItem().count){
			this.$.unread.setContent((this.getItem().count >= 1000) ? "1000+" : this.getItem().count);
		} else {
			this.$.unread.setContent("&nbsp;");
		}

	},
	changeOpacity: function (inSender, inEvent) {

		this.addRemoveClass("opacity-transition", !inEvent.noTransition);

		this.applyStyle("opacity", ((inEvent.inEditMode && this.getItem().isSpecial) ? .3 : 1));
		setTimeout(enyo.bind(this, function () {
			this.applyStyle("opacity", ((inEvent.inEditMode && this.getItem().isSpecial) ? .3 : 1));
		}), 0);

		//this.addRemoveClass("disabled", this.getDisabled());
	},
	openFolder: function(){

		if (this.$.allAtriclesItem) {
			//this is bad practices, but it's not worth the effort to change.
			this.$.allAtriclesItem.setContent(this.owner.owner.owner.inEditMode ? "Edit Folder" : "View All Articles");
		}
		this.$.menu.requestMenuShow();

		if(this.$.menu.hasNode()){

			this.$.menu.applyStyle("left", null);
	    	this.$.menu.applyStyle("right", null);
			
			var pos = AppUtils.getPos(this.$.menu.node);

	    	if(pos.x < 0) {
	    		this.$.menu.applyStyle("left", "0px");
	    	} else if(window.innerWidth - pos.x < 200) {
	    		this.$.menu.applyStyle("right", "110px");	    		
	    	}
	    }
   
	},
	loadGridItem: function(inSender, inEvent){
		this.$.menu.hide();

		this.bubble("onLoadFeed", inSender);

		return true;
	},

});
