
// minifier: path aliases

enyo.path.addPaths({onyx: "/Users/Will/Development/Cross Platform/Apps/NomNomNom XP/src/enyo/tools/../../lib/onyx/", onyx: "/Users/Will/Development/Cross Platform/Apps/NomNomNom XP/src/enyo/tools/../../lib/onyx/source/"});

// Icon.js

enyo.kind({
name: "onyx.Icon",
published: {
src: ""
},
classes: "onyx-icon",
create: function() {
this.inherited(arguments), this.src && this.srcChanged();
},
srcChanged: function() {
this.applyStyle("background-image", "url(" + enyo.path.rewrite(this.src) + ")");
}
});

// Button.js

enyo.kind({
name: "onyx.Button",
kind: "enyo.Button",
classes: "onyx-button enyo-unselectable"
});

// IconButton.js

enyo.kind({
name: "onyx.IconButton",
kind: "onyx.Icon",
published: {
active: !1
},
classes: "onyx-icon-button",
rendered: function() {
this.inherited(arguments), this.activeChanged();
},
tap: function() {
this.setActive(!0);
},
activeChanged: function() {
this.bubble("onActivate");
}
});

// Checkbox.js

enyo.kind({
name: "onyx.Checkbox",
classes: "onyx-checkbox",
kind: enyo.Checkbox,
tag: "div",
handlers: {
ondown: "downHandler",
onclick: ""
},
downHandler: function(a, b) {
return this.disabled || (this.setChecked(!this.getChecked()), this.bubble("onchange")), !0;
},
tap: function(a, b) {
return !this.disabled;
}
});

// Grabber.js

enyo.kind({
name: "onyx.Grabber",
classes: "onyx-grabber"
});

// Groupbox.js

enyo.kind({
name: "onyx.Groupbox",
classes: "onyx-groupbox"
}), enyo.kind({
name: "onyx.GroupboxHeader",
classes: "onyx-groupbox-header"
});

// Input.js

enyo.kind({
name: "onyx.Input",
kind: "enyo.Input",
classes: "onyx-input"
});

// Popup.js

enyo.kind({
name: "onyx.Popup",
kind: "Popup",
classes: "onyx-popup"
});

// TextArea.js

enyo.kind({
name: "onyx.TextArea",
kind: "enyo.TextArea",
classes: "onyx-textarea"
});

// RichText.js

enyo.kind({
name: "onyx.RichText",
kind: "enyo.RichText",
classes: "onyx-richtext"
});

// InputDecorator.js

enyo.kind({
name: "onyx.InputDecorator",
kind: "enyo.ToolDecorator",
tag: "label",
classes: "onyx-input-decorator",
handlers: {
onDisabledChange: "disabledChange",
onfocus: "receiveFocus",
onblur: "receiveBlur"
},
receiveFocus: function() {
this.addClass("onyx-focused");
},
receiveBlur: function() {
this.removeClass("onyx-focused");
},
disabledChange: function(a, b) {
this.addRemoveClass("onyx-disabled", b.originator.disabled);
}
});

// RadioButton.js

enyo.kind({
name: "onyx.RadioButton",
kind: "Button",
classes: "onyx-radiobutton"
});

// RadioGroup.js

enyo.kind({
name: "onyx.RadioGroup",
kind: "Group",
highlander: !0,
defaultKind: "onyx.RadioButton"
});

// ToggleButton.js

enyo.kind({
name: "onyx.ToggleButton",
classes: "onyx-toggle-button",
published: {
active: !1,
value: !1,
onContent: "On",
offContent: "Off",
disabled: !1
},
events: {
onChange: ""
},
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish"
},
components: [ {
name: "contentOn",
classes: "onyx-toggle-content on"
}, {
name: "contentOff",
classes: "onyx-toggle-content off"
}, {
classes: "onyx-toggle-button-knob"
} ],
create: function() {
this.inherited(arguments), this.value = Boolean(this.value || this.active), this.onContentChanged(), this.offContentChanged(), this.disabledChanged();
},
rendered: function() {
this.inherited(arguments), this.valueChanged();
},
valueChanged: function() {
this.addRemoveClass("off", !this.value), this.$.contentOn.setShowing(this.value), this.$.contentOff.setShowing(!this.value), this.setActive(this.value);
},
activeChanged: function() {
this.setValue(this.active), this.bubble("onActivate");
},
onContentChanged: function() {
this.$.contentOn.setContent(this.onContent || ""), this.$.contentOn.addRemoveClass("empty", !this.onContent);
},
offContentChanged: function() {
this.$.contentOff.setContent(this.offContent || ""), this.$.contentOff.addRemoveClass("empty", !this.onContent);
},
disabledChanged: function() {
this.addRemoveClass("disabled", this.disabled);
},
updateValue: function(a) {
this.disabled || (this.setValue(a), this.doChange({
value: this.value
}));
},
tap: function() {
this.updateValue(!this.value);
},
dragstart: function(a, b) {
if (b.horizontal) return b.preventDefault(), this.dragging = !0, this.dragged = !1, !0;
},
drag: function(a, b) {
if (this.dragging) {
var c = b.dx;
return Math.abs(c) > 10 && (this.updateValue(c > 0), this.dragged = !0), !0;
}
},
dragfinish: function(a, b) {
this.dragging = !1, this.dragged && b.preventTap();
}
});

// Toolbar.js

enyo.kind({
name: "onyx.Toolbar",
classes: "onyx onyx-toolbar onyx-toolbar-inline"
});

// ProgressBar.js

enyo.kind({
name: "onyx.ProgressBar",
classes: "onyx-progress-bar",
published: {
progress: 0,
min: 0,
max: 100,
barClasses: "",
showStripes: !0,
animateStripes: !0
},
events: {
onAnimateProgressFinish: ""
},
components: [ {
name: "progressAnimator",
kind: "Animator",
onStep: "progressAnimatorStep",
onEnd: "progressAnimatorComplete"
}, {
name: "bar",
classes: "onyx-progress-bar-bar"
} ],
create: function() {
this.inherited(arguments), this.progressChanged(), this.barClassesChanged(), this.showStripesChanged(), this.animateStripesChanged();
},
barClassesChanged: function(a) {
this.$.bar.removeClass(a), this.$.bar.addClass(this.barClasses);
},
showStripesChanged: function() {
this.$.bar.addRemoveClass("striped", this.showStripes);
},
animateStripesChanged: function() {
this.$.bar.addRemoveClass("animated", this.animateStripes);
},
progressChanged: function() {
this.progress = this.clampValue(this.min, this.max, this.progress);
var a = this.calcPercent(this.progress);
this.updateBarPosition(a);
},
clampValue: function(a, b, c) {
return Math.max(a, Math.min(c, b));
},
calcRatio: function(a) {
return (a - this.min) / (this.max - this.min);
},
calcPercent: function(a) {
return this.calcRatio(a) * 100;
},
updateBarPosition: function(a) {
this.$.bar.applyStyle("width", a + "%");
},
animateProgressTo: function(a) {
this.$.progressAnimator.play({
startValue: this.progress,
endValue: a,
node: this.hasNode()
});
},
progressAnimatorStep: function(a) {
return this.setProgress(a.value), !0;
},
progressAnimatorComplete: function(a) {
return this.doAnimateProgressFinish(a), !0;
}
});

// ProgressButton.js

enyo.kind({
name: "onyx.ProgressButton",
kind: "onyx.ProgressBar",
classes: "onyx-progress-button",
events: {
onCancel: ""
},
components: [ {
name: "progressAnimator",
kind: "Animator",
onStep: "progressAnimatorStep",
onEnd: "progressAnimatorComplete"
}, {
name: "bar",
classes: "onyx-progress-bar-bar onyx-progress-button-bar"
}, {
name: "client",
classes: "onyx-progress-button-client"
}, {
kind: "onyx.Icon",
src: "$lib/onyx/images/progress-button-cancel.png",
classes: "onyx-progress-button-icon",
ontap: "cancelTap"
} ],
cancelTap: function() {
this.doCancel();
}
});

// Slider.js

enyo.kind({
name: "onyx.Slider",
kind: "onyx.ProgressBar",
classes: "onyx-slider",
published: {
value: 0,
lockBar: !0,
tappable: !0
},
events: {
onChange: "",
onChanging: "",
onAnimateFinish: ""
},
showStripes: !1,
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish"
},
moreComponents: [ {
kind: "Animator",
onStep: "animatorStep",
onEnd: "animatorComplete"
}, {
classes: "onyx-slider-taparea"
}, {
name: "knob",
classes: "onyx-slider-knob"
} ],
create: function() {
this.inherited(arguments), this.createComponents(this.moreComponents), this.valueChanged();
},
valueChanged: function() {
this.value = this.clampValue(this.min, this.max, this.value);
var a = this.calcPercent(this.value);
this.updateKnobPosition(a), this.lockBar && this.setProgress(this.value);
},
updateKnobPosition: function(a) {
this.$.knob.applyStyle("left", a + "%");
},
calcKnobPosition: function(a) {
var b = a.clientX - this.hasNode().getBoundingClientRect().left;
return b / this.getBounds().width * (this.max - this.min) + this.min;
},
dragstart: function(a, b) {
if (b.horizontal) return b.preventDefault(), this.dragging = !0, !0;
},
drag: function(a, b) {
if (this.dragging) {
var c = this.calcKnobPosition(b);
return this.setValue(c), this.doChanging({
value: this.value
}), !0;
}
},
dragfinish: function(a, b) {
return this.dragging = !1, b.preventTap(), this.doChange({
value: this.value
}), !0;
},
tap: function(a, b) {
if (this.tappable) {
var c = this.calcKnobPosition(b);
return this.tapped = !0, this.animateTo(c), !0;
}
},
animateTo: function(a) {
this.$.animator.play({
startValue: this.value,
endValue: a,
node: this.hasNode()
});
},
animatorStep: function(a) {
return this.setValue(a.value), !0;
},
animatorComplete: function(a) {
return this.tapped && (this.tapped = !1, this.doChange({
value: this.value
})), this.doAnimateFinish(a), !0;
}
});

// FittableLayout.js

enyo.kind({
name: "enyo.FittableLayout",
kind: "Layout",
calcFitIndex: function() {
for (var a = 0, b = this.container.children, c; c = b[a]; a++) if (c.fit && c.showing) return a;
},
getFitControl: function() {
var a = this.container.children, b = a[this.fitIndex];
return b && b.fit && b.showing || (this.fitIndex = this.calcFitIndex(), b = a[this.fitIndex]), b;
},
getLastControl: function() {
var a = this.container.children, b = a.length - 1, c = a[b];
while ((c = a[b]) && !c.showing) b--;
return c;
},
_reflow: function(a, b, c, d) {
this.container.addRemoveClass("enyo-stretch", !this.container.noStretch);
var e = this.getFitControl();
if (!e) return;
var f = 0, g = 0, h = 0, i, j = this.container.hasNode();
j && (i = enyo.FittableLayout.calcPaddingExtents(j), f = j[b] - (i[c] + i[d]));
var k = e.getBounds();
g = k[c] - (i && i[c] || 0);
var l = this.getLastControl();
if (l) {
var m = enyo.FittableLayout.getComputedStyleValue(l.hasNode(), "margin-" + d) || 0;
if (l != e) {
var n = l.getBounds(), o = k[c] + k[a], p = n[c] + n[a] + m;
h = p - o;
} else h = m;
}
var q = f - (g + h);
e.applyStyle(a, q + "px");
},
reflow: function() {
this.orient == "h" ? this._reflow("width", "clientWidth", "left", "right") : this._reflow("height", "clientHeight", "top", "bottom");
},
statics: {
_ieCssToPixelValue: function(a, b) {
var c = b, d = a.style, e = d.left, f = a.runtimeStyle && a.runtimeStyle.left;
return f && (a.runtimeStyle.left = a.currentStyle.left), d.left = c, c = d.pixelLeft, d.left = e, f && (d.runtimeStyle.left = f), c;
},
_pxMatch: /px/i,
getComputedStyleValue: function(a, b, c) {
var d = c || enyo.dom.getComputedStyle(a);
if (d) return parseInt(d.getPropertyValue(b));
if (a && a.currentStyle) {
var e = a.currentStyle[b];
return e.match(this._pxMatch) || (e = this._ieCssToPixelValue(a, e)), parseInt(e);
}
return 0;
},
calcBoxExtents: function(a, b) {
var c = enyo.dom.getComputedStyle(a);
return {
top: this.getComputedStyleValue(a, b + "-top", c),
right: this.getComputedStyleValue(a, b + "-right", c),
bottom: this.getComputedStyleValue(a, b + "-bottom", c),
left: this.getComputedStyleValue(a, b + "-left", c)
};
},
calcPaddingExtents: function(a) {
return this.calcBoxExtents(a, "padding");
},
calcMarginExtents: function(a) {
return this.calcBoxExtents(a, "margin");
}
}
}), enyo.kind({
name: "enyo.FittableColumnsLayout",
kind: "FittableLayout",
orient: "h",
layoutClass: "enyo-fittable-columns-layout"
}), enyo.kind({
name: "enyo.FittableRowsLayout",
kind: "FittableLayout",
layoutClass: "enyo-fittable-rows-layout",
orient: "v"
});

// FittableRows.js

enyo.kind({
name: "enyo.FittableRows",
layoutKind: "FittableRowsLayout",
noStretch: !1
});

// FittableColumns.js

enyo.kind({
name: "enyo.FittableColumns",
layoutKind: "FittableColumnsLayout",
noStretch: !1
});

// book.js

enyo.kind({
name: "Book",
kind: "Control",
published: {
transition: "fade",
cue: !1,
absolute: !0
},
transitions: {
simple: 0,
fade: 500,
pop: 500
},
transitioning: !1,
movementing: !1,
defaultKind: "Page",
create: function() {
this.absolute === !1 && (this.defaultKind = "Control", this.transition = "simple"), this.setOwner = this.owner, this.pane = null, this.lazy = [], this.history = [], this.historyPane = null, this.inherited(arguments);
for (x in this.getControls()) this.getControls().hasOwnProperty(x) && this.getControls()[x].hide();
},
rendered: function() {
this.inherited(arguments), this._showPane(0, !0);
},
initComponents: function() {
var a = [];
for (x in this.components) this.components.hasOwnProperty(x) && (this.components[x].lazy && this.components[x].lazy == 1 ? this.lazy.push(this.components[x]) : a.push(this.components[x]), this.absolute === !1 && !(this.components[x].absolute = !1));
this.components = a, this.inherited(arguments);
},
pageNumber: function(a) {
this.pane !== a && (this.movementing ? this.cue && this._cue({
action: "pageNumber",
arguments: a
}) : (this.movementing = !0, this._hidePane(this.pane), this._showPane(a)));
},
pageName: function(a) {
this.movementing ? this.cue && this._cue.push({
action: "pageName",
arguments: a
}) : (this.movementing = !0, this._paneIsLazy(a) ? (this._hidePane(this.pane), this.createComponent(this._getLazyPane(a), {
owner: this.owner
}), this.getControls()[this._getPageNumber(a)].render(), this._showPane(this._getPageNumber(a)), this._deleteLazyPane(a)) : this.pane !== this._getPageNumber(a) ? (this._hidePane(this.pane), this._showPane(this._getPageNumber(a))) : this._end());
},
back: function() {
if (this.movementing) this.cue && this._cue.push({
action: "back",
arguments: ""
}); else {
if (!this.history[this.historyPane - 1]) return !1;
this._hidePane(this.pane), this._showPane(this.history[this.historyPane - 1], !0, this.historyPane - 1);
}
},
next: function() {
if (this.movementing) this.cue && this._cue.push({
action: "next",
arguments: ""
}); else {
if (!this.history[this.historyPane + 1]) return !1;
this._hidePane(this.pane), this._showPane(this.history[this.historyPane + 1], !0, this.historyPane + 1);
}
},
_paneIsLazy: function(a) {
var b = !1;
for (x in this.lazy) this.lazy.hasOwnProperty(x) && this.lazy[x].name === a && (b = !0);
return b;
},
_getLazyPane: function(a) {
var b = [];
for (x in this.lazy) this.lazy.hasOwnProperty(x) && this.lazy[x].name === a && (b = this.lazy[x]);
return b;
},
_deleteLazyPane: function(a) {
for (x in this.lazy) this.lazy.hasOwnProperty(x) && this.lazy[x].name === a && delete this.lazy[x];
return !0;
},
_getPageNumber: function(a) {
var b = null;
for (x in this.getControls()) this.getControls().hasOwnProperty(x) && this.getControls()[x].name === a && (b = x);
return b;
},
_cue: [],
_showPane: function(a, b, c) {
if (typeof a == "object") var c = a.index, b = a.history, a = a.number;
if (this.transitioning) this._cue.push({
action: "_showPane",
arguments: {
number: a,
history: b || "",
index: c || ""
}
}); else {
this.cue && (this.transitioning = !0);
var d = this.getControls()[a];
d.show(), d.addClass("enyo-book-" + this.transition + "-in"), this.pane = a, b !== !0 ? (this.history.push(this.pane), this.historyPane = this.history.length - 1) : this.historyPane = c, window.setTimeout(enyo.bind(this, function() {
d.show(), d.removeClass("enyo-book-" + this.transition + "-in"), this._end();
}), this.transitions[this.transition]);
}
},
_hidePane: function(a) {
if (this.transitioning) this._cue.push({
action: "_hidePane",
arguments: a
}); else {
this.cue && (this.transitioning = !0);
var b = this.getControls()[a];
b.addClass("enyo-book-" + this.transition + "-out"), window.setTimeout(enyo.bind(this, function() {
b.hide(), b.removeClass("enyo-book-" + this.transition + "-out"), this._end();
}), this.transitions[this.transition]);
}
},
_end: function() {
this.movementing = !1, this.transitioning = !1, this._startCue();
},
_startCue: function() {
if (this._cue.length >= 1) {
var a = this._cue[0].action, b = this._cue[0].arguments;
this._cue.splice(0, 1), this[a](b);
}
}
});

// page.js

enyo.kind({
name: "Page",
kind: "Control",
classes: "enyo-page"
});

// js/loginPage.js

enyo.kind({
name: "loginPage",
kind: "Page",
fit: !0,
handlers: {
onLogin: ""
},
components: [ {
name: "layout1",
kind: "FittableRows",
classes: "enyo-fit",
components: [ {
kind: "onyx.Toolbar",
components: [ {
content: "Header"
}, {
kind: "onyx.Button",
content: "Button"
}, {
kind: "onyx.InputDecorator",
components: [ {
kind: "onyx.Input"
} ]
} ]
}, {
kind: "FittableColumns",
fit: !0,
components: [ {
style: "width: 300px;"
}, {
kind: "FittableRows",
fit: !0,
style: "box-shadow: -6px 0px 6px rgba(0,0,0,0.3);",
components: [ {
style: "height: 300px; box-shadow: 6px 6px 6px rgba(0,0,0,0.3); position: relative; z-index: 1;"
}, {
fit: !0,
classes: "fitting-color"
} ]
} ]
} ]
} ],
create: function() {
this.inherited(arguments);
},
showingChanged: function(a) {
this.inherited(arguments), this.getShowing() && a !== undefined && console.log("loginPage activated");
},
attemptLogin: function() {},
loggedIn: function() {
this.bubble("onLogin");
}
});

// js/gridPage.js

enyo.kind({
name: "gridPage",
kind: "Page",
fit: !0,
handler: {
onViewArticles: ""
},
components: [ {
content: "this is the grid"
}, {} ],
showingChanged: function(a) {
this.inherited(arguments), this.getShowing() && a !== undefined && this.activate();
},
activate: function() {
console.log("gridPage activated");
}
});

// js/articlePage.js

enyo.kind({
name: "articlePage",
kind: "Page",
fit: !0,
published: {
articles: []
},
components: [ {
content: "this is the article list"
}, {
name: "articleList",
showing: !1,
content: "LALAL"
}, {
name: "articleCards",
showing: !1
} ],
create: function() {
this.inherited(arguments), this.$.articleList.show();
},
articlesChanged: function() {
console.log("LOAD DEM ARTICLES", this.getArticles());
}
});

// js/tourPage.js

enyo.kind({
name: "tourPage",
kind: "Page",
fit: !0,
components: [ {
content: "this is the tour page"
} ],
create: function() {
this.inherited(arguments);
}
});

// js/settingsPage.js

enyo.kind({
name: "settingsPage",
kind: "Page",
fit: !0,
components: [ {
content: "this is the settingsPage"
} ]
});

// js/App.js

enyo.kind({
name: "App",
fit: !0,
components: [ {
kind: "Book",
components: [ {
name: "loadingPage",
content: "loading"
}, {
name: "loginPage",
kind: "loginPage",
onLogin: "loggedIn"
}, {
kind: "gridPage",
onViewArticles: "showArticlePage"
}, {
kind: "articlePage"
}, {
name: "tourPage",
kind: "tourPage",
lazy: !0
}, {
name: "settingsPage",
kind: "settingsPage",
lazy: !0
} ]
} ],
create: function() {
this.inherited(arguments);
},
rendered: function() {
this.inherited(arguments), this.checkLogin();
},
checkLogin: function() {
this.showLoginPage();
},
loggedIn: function(a, b) {
console.log("Logged in"), b && b.showTour ? this.showTourPage() : this.showGridPage();
},
showLoginPage: function() {
this.$.book.pageName("loginPage");
},
showGridPage: function() {
this.$.book.pageName("gridPage");
},
showArticlePage: function(a, b) {
if (!b || !b.articles) {
console.error("Error Displaying Articles");
return;
}
this.$.book.pageName("articlePage"), this.$.articlePage.setArticles(b.articles);
},
showTourPage: function() {
this.$.book.pageName("tourPage");
}
});
