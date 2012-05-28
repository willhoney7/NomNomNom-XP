enyo.kind({
	name: "articleViewPage",
	kind: "Page",
	fit: true,
	layoutKind: "FittableRowsLayout",
	classes: "articleViewPage",
	handlers: {
		onShowArticlePage: ""
	},
	components:[
		{kind: "onyx.Toolbar", classes: "onyx-toolbar-inline", components: [
			{kind: "onyx.Button", content: "Back", ontap: "bubbleEvent", eventToBubble: "onShowArticlePage"},
		]},
		{kind: "enyo.Scroller", fit: true, components: [
			{name: "articleTime", allowHtml: true, classes: "articleTime"},
			{name: "articleTitle", allowHtml: true, classes: "articleTitle"},
			{name: "articleContent", allowHtml: true, fit: true, classes: "articleContent"}
		]},
		{kind: "onyx.Toolbar", classes: "onyx-toolbar-inline", components: [
			{kind: "onyx.Grabber"},
			{kind: "onyx.Button", content: "v", ontap: "increaseIndex"},
			{kind: "onyx.Button", content: "^", ontap: "decreaseIndex"},
		]},
	],
		
	create: function(){
		this.inherited(arguments);	
	},

	showingChanged: function(previousValue) {
		this.inherited(arguments);

		if(this.getShowing() && previousValue !== undefined){
			//this.activate();
			this.resized();
		}
	},

	resizeHandler: function() {
		this.inherited(arguments);
		this.$.grabber.setShowing((window.width < 800));
	},

	bubbleEvent: function(inSender, inEvent){
		this.bubble(inSender.eventToBubble);
	},

	index: 0,
	articles: [],
	viewArticles: function(articles, index){

		this.articles = articles;
		this.index = index;

		this.showCurrentArticle();

	},
	showCurrentArticle: function(){
		this.$.articleTitle.setContent(this.articles[this.index].title);
		this.$.articleContent.setContent(this.articles[this.index].content);		
		this.$.articleTime.setContent(moment.unix(this.articles[this.index].updated).format("h:mm a"));
	},

	increaseIndex: function(){
		if(this.articles[this.index + 1]){
			this.index++;
		}
		this.showCurrentArticle();
	},
	decreaseIndex: function(){
		if(this.articles[this.index - 1]){
			this.index--;
		}
		this.showCurrentArticle();
	}


	
});
