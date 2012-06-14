enyo.kind({
	name: "addFeedPage",
	fit: true,
	layoutKind: "FittableRowsLayout",
	handlers: {
		onShowGridPage: ""
	},
	components:[
		{kind: "onyx.Toolbar", classes: "onyx-toolbar-inline", components: [
			{kind: "onyx.Button", content: "Back", ontap: "bubbleEvent", eventToBubble: "onShowGridPage", classes: "abs"},
			{content: "Add a New Subscription", classes: "center"}
		]},
		{classes: "fixedWidthList", fit: true, layoutKind: "FittableRowsLayout", components: [
			{kind: "onyx.Groupbox", components: [
				{kind: "onyx.GroupboxHeader", content: "New Subscription"},
				{kind: "onyx.InputDecorator", components: [
					{name: "feed", kind: "onyx.Input", style: "width: 70%", placeholder: "URL/Search Term"},
				]},
			]},
			{kind: "onyx.Button", content: "Go", ontap: "processInput", classes: "full"},
			{kind: "enyo.Scroller", fit: true, horizontal: "hidden", components: [
				{name: "resultsList", kind: enyo.Repeater, fit: true, count: 0, onSetupItem: "setupResultItem", components: [
				    {classes: "groupItem", content: "", ontap: "subscribeTap", components: [
				    	{name: "button", kind: "onyx.Button", classes: "onyx-affirmative floatRight", style: "margin-left: 5px", ontap: "addFeed", content: "Subscribe"},
						{name: "title", classes: "resultTitle", allowHtml: true},
				    	{name: "url", classes: "resultUrl truncating-text"},
				    	{name: "snippet", classes: "resultSnippet", allowHtml: true}				    	
				    ]}
				]}
			]}		
		]},
	],
	
	bubbleEvent: function(inSender, inEvent) {
		this.bubble(inSender.eventToBubble);
	},
	create: function() {
		this.inherited(arguments);
	},
	showingChanged: function(previousValue) {
		this.inherited(arguments);

		if(this.getShowing() && previousValue !== undefined){
			this.activate();
		}
	},
	activate: function () {
		this.$.feed.setValue("");
		this.$.resultsList.setCount(0);
		this.resultList = [];
	},

	processInput: function(inSender, inEvent) {
		this.resultList = [];
		this.$.resultsList.setCount(0);
		var input = this.$.feed.getValue();

		if(input.length > 0){
			reader.processFeedInput(input, enyo.bind(this, function (response) {
				if (response.isFeed) {
					humane.log("Adding Feed");
					this.subscribeToUrl(input, title)
				} else if (response.results) {
					this.resultList = response.results;
					this.$.resultsList.setCount(this.resultList.length);
				}
			}), function (error) {
				humane.log(error);
			});
		}
	},
	resultList: [],
	setupResultItem: function (inSender, inEvent) {
		if(this.resultList[inEvent.index]){
			inEvent.item.$.title.setContent(this.resultList[inEvent.index].title);
			inEvent.item.$.url.setContent(this.resultList[inEvent.index].url);
			inEvent.item.$.snippet.setContent(this.resultList[inEvent.index].contentSnippet);
	    	return true;
    	} 
	},
	subscribeTap: function(inSender, inEvent) {
		this.subscribeToUrl(this.resultList[inEvent.index].url, htmlToText(this.resultList[inEvent.index].title));
	},
	subscribeToUrl: function (url, title) {
		AppUtils.wrapWithInternetTest(function () {
			reader.subscribeFeed(url, function () {
				publish("refreshGrid");
				humane.log("Subscribed");
			}, title);
		});
	}
	
});
