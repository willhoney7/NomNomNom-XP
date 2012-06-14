enyo.kind({
	name: "editSubPage",
	fit: true,
	layoutKind: "FittableRowsLayout",
	published: {
		item: ""
	},
	handlers: {
		onShowGridPage: ""
	},
	components: [
		{kind: "onyx.Toolbar", classes: "onyx-toolbar-inline", components: [
			{kind: "onyx.Button", content: "Done", ontap: "showGrid", classes: "abs"},
			{content: "Edit Subscription", classes: "center"}
		]},
		{kind: "enyo.Scroller", fit: true, horizontal: "hidden", components: [
			{classes: "fixedWidthList", components: [
				{kind: "onyx.Groupbox", components: [
					{kind: "onyx.GroupboxHeader", content: "Name"},
					{kind: "onyx.InputDecorator", layoutKind: "FittableColumnsLayout", onblur: "inputBlur", components: [
						{name: "title", kind: "onyx.Input", fit: true},
					]},
				]},
				{name: "labelsList", kind: "onyx.Groupbox"},
				{name: "unsubscribeButton", kind: "onyx.Button", classes: "onyx-negative full", content: "Unsubscribe", ontap: "unsubscribe"}
			]}
		]},
	],

	bubbleEvent: function(inSender, inEvent) {
		this.bubble(inSender.eventToBubble);
	},
	create: function(){
		this.inherited(arguments);
	},
	itemChanged: function () {

		//var item = _(_sub).clone();
		var components = [];
		this.$.title.setValue(this.item.title);
		if(this.item.isLabel){
			this.$.unsubscribeButton.hide();
			this.$.labelsList.hide();
			
		} else if (this.item.isFeed){
			this.$.unsubscribeButton.show();
			this.$.labelsList.show();

			this.buildLabelsList();
		}
		this.unsubscribed = false;

	},
	buildLabelsList: function () {
		var items = [{kind: "onyx.GroupboxHeader", content: "Labels"}];
			
		_.each(reader.getLabels(), enyo.bind(this, function(label){
			var hasLabel = (!!_.find(this.item.categories, function(category){
				return category.id === label.id;
			}));
			console.log("hasLabel", hasLabel);

			items.push({classes: "groupItem", components: [{name: label.id + "Check", labelId: label.id, feedId: this.item.id, kind:"onyx.Checkbox", classes: "floatRight", checked: hasLabel, onchange: "toggleLabel"}, {content: label.title, id: label.id}]});
		}));

		items.push({kind: "onyx.InputDecorator", components: [
			{kind: "onyx.IconButton", src: AppUtils.getImagePath("menu-icon-new.png"), ontap: "addLabel", classes: "floatRight"},
			{name:  "newLabelInput", placeholder: "New Label...", kind:"onyx.Input"}
		]});
		//items.push({classes: "groupItem", components: [{content: label.title, id: label.id}]});
		this.$.labelsList.destroyClientControls();
		this.$.labelsList.createComponents(items, {owner: this});
		this.$.labelsList.render();
	},
	unsubscribed: false,
	showGrid: function () {
		this.inherited(arguments);

		this.updateTitle(function(){
			publish("reloadGrid");
			//onyx.scrim.hide();
		});

		this.bubble("onShowGridPage");

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
			this.$.title.setValue(this.item.title);	
		} 
	},
	updateTitle: function (callback) {
		if(!this.unsubscribed && this.$.title.getValue().length > 0 && this.$.title.getValue() !== this.item.title){
			reader.background[this.item.isLabel ? "editLabelTitle" : "editFeedTitle"](this.item.id, this.$.title.getValue(), function () {
				console.log("success suckers");
				callback();
			});
		} else {
			callback();
		}
	},

	addLabel: function (inSender, inEvent) {
		if(this.$.newLabelInput.getValue().length > 0){

			reader.background.editFeedLabel(this.item.id, reader.TAGS["label"] + this.$.newLabelInput.getValue(), true, enyo.bind(this, function () {
				this.buildLabelsList();
			}));
		}
	},
	unsubscribe: function () {
		//@TODO: confirm
		reader.background.unsubscribeFeed(this.item.id, enyo.bind(this, function () {
			this.unsubscribed = true;
			this.bubble("onShowGridPage");
		}));
	},

	
	
});
