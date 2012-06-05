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
			    {kind: "gridItem", ontap: "loadGridItem", onLoadFeed: "loadFeedItem"}
			]},
		]},

		{name: "normalToolbar", kind: "onyx.Toolbar", classes: "onyx-toolbar-inline", components: [
			{name: "titleBar", content: "NomNomNomXP", classes: "truncating-text"},
			{kind: "onyx.IconButton", classes: "floatRight", src: AppUtils.getImagePath("menu-icon-settings.png"), ontap: "bubbleEvent", eventToBubble: "onShowSettingsPage"},
			{kind: "onyx.IconButton", classes: "floatRight", src: AppUtils.getImagePath("menu-icon-edit-outline.png"), ontap: "enterEditMode"},
			{kind: "onyx.IconButton", classes: "floatRight", src: AppUtils.getImagePath("menu-icon-refresh.png"), ontap: "loadFeedsFromOnline"},
			{kind: "onyx.IconButton", classes: "floatRight", src: AppUtils.getImagePath("menu-icon-new.png"), ontap: "bubbleEvent", eventToBubble: "onShowAddFeedPage"}
		]},
		{name: "editToolbar", kind: "onyx.Toolbar", showing: false, classes: "onyx-toolbar-inline", components: [
			{content: "Edit Mode", classes: "truncating-text"},
			{kind: "onyx.Button", content: "Exit", classes: "floatRight", ontap: "exitEditMode"},
			{name: "editPopup", kind: "editPopup"}
		]},
		
	],

	create: function () {
		this.inherited(arguments);

		subscribe("refreshGrid", enyo.bind(this, function(arg){
        	this.loadGrid();
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
	buildGrid: function(subs){

		if(this.inEditMode){

			this.gridItems = _.reject(reader.getFeeds(), function(sub){
				return (sub.isSpecial);
			}); 

		} else {

			this.gridItems = (AppPrefs.get("hideRead")) ? _.reject(subs, function(sub){
				return (!sub.count && !sub.isSpecial);
			})  : subs;

			reader.setFeeds(this.gridItems);
		}
		
		this.$.grid.setCount(this.gridItems.length);
		this.$.grid.build();			

	},
	loadFeedsFromOnline: function(){
		AppUtils.wrapWithInternetTest(enyo.bind(this, function(){

			humane.log("Loading Subscriptions...", {timeout: 50000});

			//console.log("LOADING FEEDS FROM ONLINE");

			reader.loadFeeds(enyo.bind(this, function (subs){
				//console.log("New Subs loaded from online");
				
				humane.remove();
				humane.log("Loading Articles...", {timeout: 5000000});
				
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
											humane.remove();

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
				console.log("EDIT THIS FEEDDDDD");
				this.$.editPopup.showEditOptions(inSender.getItem());
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

		var items = _.reject(reader.getFeeds(), function(sub){
			return (sub.isSpecial);
		}); 

		this.$.grid.setCount(items.length);
		this.gridItems = items;
		this.$.grid.build();

		this.$.normalToolbar.hide();
		this.$.editToolbar.show();
	},
	exitEditMode: function (){
		this.inEditMode = false;
		
		this.loadGrid();

		this.$.editToolbar.hide();
		this.$.normalToolbar.show();
	}

	
});


enyo.kind({
	name: "gridItem",
	kind: "Control",
	classes: "grid-item",
	published: {
		item: {}
	},
	handler: {
		onLoadFeed: ""
	},
	components: [
		{kind: "enyo.Image", src: ""},
		{kind: "enyo.Control", classes: "title", allowHtml: true},
		{name: "icon", kind: "Image", classes: "icon"},
		{name: "unread", classes: "unread"},
		{kind: "onyx.MenuDecorator", components: [
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
		}
	},
	openFolder: function(){
		console.log(this.$.allAtriclesItem, this.owner);

		if (this.$.allAtriclesItem) {
			//this is bad practices, but it's not worth the effort to change.
			this.$.allAtriclesItem.setContent(this.owner.owner.owner.inEditMode ? "Edit Folder" : "View All Articles");
		}
		this.$.menu.requestMenuShow();
	},
	loadGridItem: function(inSender, inEvent){
		this.$.menu.hide();

		this.bubble("onLoadFeed", inSender);

		return true;
	},

});



enyo.kind({
	name: "editPopup", 
	kind: "onyx.Popup", 
	classes: "editPopup", 
	centered: true, 
	floating: true, 
	components: [
		{content: "Edit", classes: "popupTitle"},
		{kind: "onyx.InputDecorator", layoutKind: "FittableColumnsLayout", style: "margin: 0; width: 382px; background-color: inherit;", onblur: "inputBlur", components: [
			{content: "Name: ", classes: "floatLeft padRight inputPrompt"}, 
			{name: "title", kind: "onyx.Input", fit: true},
		]},
		{name: "labelsList", kind: "onyx.Groupbox"},
		{name: "unsubscribeButton", kind: "onyx.Button", classes: "onyx-negative full", content: "Unsubscribe", ontap: "unsubscribe"}
	],
	showEditOptions: function(_sub){
		var sub = _(_sub).clone();
		var components = [];
		this.$.title.setValue(sub.title);
		if(sub.isLabel){
			this.$.unsubscribeButton.hide();
			this.$.labelsList.hide();
			
		} else if (sub.isFeed){
			this.$.unsubscribeButton.show();
			this.$.labelsList.show();

			var items = [{kind: "onyx.GroupboxHeader", content: "Labels"}];
			
			_.each(reader.getLabels(), function(label){
				var hasLabel = (!!_.find(sub.categories, function(category){
					return category.id === label.id;
				}));
				console.log("hasLabel", hasLabel);

				items.push({classes: "groupItem", components: [{name: label.id + "Check", labelId: label.id, feedId: sub.id, kind:"onyx.Checkbox", classes: "floatRight", checked: hasLabel, onchange: "toggleLabel"}, {content: label.title, id: label.id}]});
			});

			items.push({kind: "onyx.InputDecorator", components: [
				{kind: "onyx.IconButton", src: AppUtils.getImagePath("menu-icon-new.png"), ontap: "addLabel", classes: "floatRight"},
				{name:  "newLabelInput", placeholder: "New Label...", kind:"onyx.Input"}
			]});
			//items.push({classes: "groupItem", components: [{content: label.title, id: label.id}]});
			this.$.labelsList.destroyClientControls();
			this.$.labelsList.createComponents(items, {owner: this});
			this.$.labelsList.render();
		}
		this.sub = sub;
		this.show();
		onyx.scrim.show();
	},
	hide: function () {
		this.inherited(arguments);

		this.updateTitle(function(){
			publish("refreshGrid");
			onyx.scrim.hide();
		});

	},
	toggleLabel: function (inSender, inEvent) {
		//QUEUE :'(
		reader.background.editFeedLabel(inSender.feedId, inSender.labelId, inSender.checked, function () {
			console.log("success suckers");
		});
	
		console.log("CHECKED", inSender.checked);
	},
	inputBlur: function () {
		if(this.$.title.getValue().length === 0){
			this.$.title.setValue(this.sub.title);	
		} 
	},
	updateTitle: function (callback) {
		if(this.$.title.getValue().length > 0 && this.$.title.getValue() !== this.sub.title){
			reader.background.editFeedTitle(this.sub.id, this.$.title.getValue(), function () {
				console.log("success suckers");
				callback();
			});
		} else {
			callback();
		}
	},

	addLabel: function (inSender, inEvent) {
		if(this.$.newLabelInput.getValue().length > 0){

			reader.background.editFeedLabel(this.sub.id, reader.TAGS["label"] + this.$.newLabelInput.getValue(), true, enyo.bind(this, function () {
				console.log("success suckers");

				this.showEditOptions(this.sub);
			}));
		}
	},
});