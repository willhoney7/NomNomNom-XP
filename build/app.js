
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

// Selection.js

enyo.kind({
name: "enyo.Selection",
kind: enyo.Component,
published: {
multi: !1
},
events: {
onSelect: "",
onDeselect: "",
onChange: ""
},
create: function() {
this.clear(), this.inherited(arguments);
},
multiChanged: function() {
this.multi || this.clear(), this.doChange();
},
highlander: function(a) {
this.multi || this.deselect(this.lastSelected);
},
clear: function() {
this.selected = [];
},
isSelected: function(a) {
return this.selected[a];
},
setByKey: function(a, b, c) {
if (b) this.selected[a] = c || !0, this.lastSelected = a, this.doSelect({
key: a,
data: this.selected[a]
}); else {
var d = this.isSelected(a);
delete this.selected[a], this.doDeselect({
key: a,
data: d
});
}
this.doChange();
},
deselect: function(a) {
this.isSelected(a) && this.setByKey(a, !1);
},
select: function(a, b) {
this.multi ? this.setByKey(a, !this.isSelected(a), b) : this.isSelected(a) || (this.highlander(), this.setByKey(a, !0, b));
},
toggle: function(a, b) {
!this.multi && this.lastSelected != a && this.deselect(this.lastSelected), this.setByKey(a, !this.isSelected(a), b);
},
getSelected: function() {
return this.selected;
}
});

// FlyweightRepeater.js

enyo.kind({
name: "enyo.FlyweightRepeater",
published: {
rows: 0,
multiSelect: !1,
toggleSelected: !1
},
events: {
onSetupRow: ""
},
components: [ {
kind: "Selection",
onSelect: "selectDeselect",
onDeselect: "selectDeselect"
}, {
name: "client"
} ],
rowOffset: 0,
bottomUp: !1,
create: function() {
this.inherited(arguments), this.multiSelectChanged();
},
multiSelectChanged: function() {
this.$.selection.setMulti(this.multiSelect);
},
setupRow: function(a) {
this.doSetupRow({
index: a,
selected: this.isSelected(a)
});
},
generateChildHtml: function() {
var a = "";
for (var b = 0, c = 0; b < this.rows; b++) c = this.rowOffset + (this.bottomUp ? this.rows - b - 1 : b), this.setupRow(c), this.$.client.setAttribute("index", c), a += this.inherited(arguments), this.$.client.teardownRender();
return a;
},
previewDomEvent: function(a) {
a.rowIndex = a.index = this.rowForEvent(a), a.repeater = this;
},
tap: function(a, b) {
this.toggleSelected ? this.$.selection.toggle(b.index) : this.$.selection.select(b.index);
},
selectDeselect: function(a, b) {
this.renderRow(b.key);
},
getSelection: function() {
return this.$.selection;
},
isSelected: function(a) {
return this.getSelection().isSelected(a);
},
renderRow: function(a) {
var b = this.fetchRowNode(a);
b && (this.setupRow(a), b.innerHTML = this.$.client.generateChildHtml(), this.$.client.teardownChildren());
},
fetchRowNode: function(a) {
if (this.hasNode()) {
var b = this.node.querySelectorAll('[index="' + a + '"]');
return b && b[0];
}
},
rowForEvent: function(a) {
var b = a.target, c = this.hasNode().id;
while (b && b.parentNode && b.id != c) {
var d = b.getAttribute && b.getAttribute("index");
if (d !== null) return Number(d);
b = b.parentNode;
}
return -1;
},
prepareRow: function(a) {
var b = this.fetchRowNode(a);
enyo.FlyweightRepeater.claimNode(this.$.client, b);
},
lockRow: function() {
this.$.client.teardownChildren();
},
performOnRow: function(a, b, c) {
b && (this.prepareRow(a), enyo.call(c || null, b), this.lockRow());
},
statics: {
claimNode: function(a, b) {
var c = b && b.querySelectorAll("#" + a.id);
c = c && c[0], a.generated = Boolean(c || !a.tag), a.node = c, a.node && a.rendered();
for (var d = 0, e = a.children, f; f = e[d]; d++) this.claimNode(f, b);
}
}
});

// List.js

enyo.kind({
name: "enyo.List",
kind: "Scroller",
classes: "enyo-list",
published: {
rows: 0,
rowsPerPage: 50,
bottomUp: !1,
multiSelect: !1,
toggleSelected: !1
},
events: {
onSetupRow: ""
},
handlers: {
onAnimateFinish: "animateFinish"
},
rowHeight: 0,
fixedHeight: !1,
listTools: [ {
name: "port",
classes: "enyo-list-port enyo-border-box",
components: [ {
name: "generator",
kind: "FlyweightRepeater",
canGenerate: !1,
components: [ {
tag: null,
name: "client"
} ]
}, {
name: "page0",
allowHtml: !0,
classes: "enyo-list-page"
}, {
name: "page1",
allowHtml: !0,
classes: "enyo-list-page"
} ]
} ],
create: function() {
this.pageHeights = [], this.inherited(arguments), this.getStrategy().translateOptimized = !0, this.bottomUpChanged(), this.multiSelectChanged(), this.toggleSelectedChanged();
},
createStrategy: function() {
this.controlParentName = "strategy", this.inherited(arguments), this.createChrome(this.listTools), this.controlParentName = "client", this.discoverControlParent();
},
rendered: function() {
this.inherited(arguments), this.$.generator.node = this.$.port.hasNode(), this.$.generator.generated = !0, this.reset();
},
resizeHandler: function() {
this.inherited(arguments), this.adjustPortSize();
},
bottomUpChanged: function() {
this.$.generator.bottomUp = this.bottomUp, this.$.page0.applyStyle(this.pageBound, null), this.$.page1.applyStyle(this.pageBound, null), this.pageBound = this.bottomUp ? "bottom" : "top", this.hasNode() && this.reset();
},
multiSelectChanged: function() {
this.$.generator.setMultiSelect(this.multiSelect);
},
toggleSelectedChanged: function() {
this.$.generator.setToggleSelected(this.toggleSelected);
},
rowsChanged: function() {
this.hasNode() && this.updateMetrics();
},
updateMetrics: function() {
this.defaultPageHeight = this.rowsPerPage * (this.rowHeight || 100), this.pageCount = Math.ceil(this.rows / this.rowsPerPage), this.portSize = 0;
for (var a = 0; a < this.pageCount; a++) this.portSize += this.getPageHeight(a);
this.adjustPortSize();
},
generatePage: function(a, b) {
this.page = a;
var c = this.$.generator.rowOffset = this.rowsPerPage * this.page, d = this.$.generator.rows = Math.min(this.rows - c, this.rowsPerPage), e = this.$.generator.generateChildHtml();
b.setContent(e), this.rowHeight || (this.rowHeight = Math.floor(b.getBounds().height / d), this.updateMetrics());
if (!this.fixedHeight) {
var f = this.getPageHeight(a), g = this.pageHeights[a] = b.getBounds().height;
f != g && (this.portSize += g - f);
}
},
update: function(a) {
var b = !1, c = this.positionToPageInfo(a), d = c.pos + this.scrollerHeight / 2, e = Math.floor(d / c.height + .5) + c.no, f = e % 2 == 0 ? e : e - 1;
this.p0 != f && this.isPageInRange(f) && (this.generatePage(f, this.$.page0), this.positionPage(f, this.$.page0), this.p0 = f, b = !0), f = e % 2 == 0 ? Math.max(1, e - 1) : e, this.p1 != f && this.isPageInRange(f) && (this.generatePage(f, this.$.page1), this.positionPage(f, this.$.page1), this.p1 = f, b = !0), b && !this.fixedHeight && (this.adjustBottomPage(), this.adjustPortSize());
},
updateForPosition: function(a) {
this.update(this.calcPos(a));
},
calcPos: function(a) {
return this.bottomUp ? this.portSize - this.scrollerHeight - a : a;
},
adjustBottomPage: function() {
var a = this.p0 >= this.p1 ? this.$.page0 : this.$.page1;
this.positionPage(a.pageNo, a);
},
adjustPortSize: function() {
this.scrollerHeight = this.getBounds().height;
var a = Math.max(this.scrollerHeight, this.portSize);
this.$.port.applyStyle("height", a + "px");
},
positionPage: function(a, b) {
b.pageNo = a;
var c = this.pageToPosition(a);
b.applyStyle(this.pageBound, c + "px");
},
pageToPosition: function(a) {
var b = 0, c = a;
while (c > 0) c--, b += this.getPageHeight(c);
return b;
},
positionToPageInfo: function(a) {
var b = -1, c = this.calcPos(a), d = this.defaultPageHeight;
while (c >= 0) b++, d = this.getPageHeight(b), c -= d;
return {
no: b,
height: d,
pos: c + d
};
},
isPageInRange: function(a) {
return a == Math.max(0, Math.min(this.pageCount - 1, a));
},
getPageHeight: function(a) {
return this.pageHeights[a] || this.defaultPageHeight;
},
invalidatePages: function() {
this.p0 = this.p1 = null, this.$.page0.setContent(""), this.$.page1.setContent("");
},
invalidateMetrics: function() {
this.pageHeights = [], this.rowHeight = 0, this.updateMetrics();
},
scroll: function(a, b) {
var c = this.inherited(arguments);
return this.update(this.getScrollTop()), c;
},
scrollToBottom: function() {
this.update(this.getScrollBounds().maxTop), this.inherited(arguments);
},
setScrollTop: function(a) {
this.update(a), this.inherited(arguments), this.twiddle();
},
getScrollPosition: function() {
return this.calcPos(this.getScrollTop());
},
setScrollPosition: function(a) {
this.setScrollTop(this.calcPos(a));
},
scrollToRow: function(a) {
var b = Math.floor(a / this.rowsPerPage), c = a % this.rowsPerPage, d = this.pageToPosition(b);
this.updateForPosition(d), d = this.pageToPosition(b), this.setScrollPosition(d);
if (b == this.p0 || b == this.p1) {
var e = this.$.generator.fetchRowNode(a);
if (e) {
var f = e.offsetTop;
this.bottomUp && (f = this.getPageHeight(b) - e.offsetHeight - f);
var g = this.getScrollPosition() + f;
this.setScrollPosition(g);
}
}
},
scrollToStart: function() {
this[this.bottomUp ? "scrollToBottom" : "scrollToTop"]();
},
scrollToEnd: function() {
this[this.bottomUp ? "scrollToTop" : "scrollToBottom"]();
},
refresh: function() {
this.invalidatePages(), this.update(this.getScrollTop()), this.stabilize();
},
reset: function() {
this.getSelection().clear(), this.invalidateMetrics(), this.invalidatePages(), this.stabilize(), this.scrollToStart();
},
getSelection: function() {
return this.$.generator.getSelection();
},
select: function(a, b) {
return this.getSelection().select(a, b);
},
isSelected: function(a) {
return this.$.generator.isSelected(a);
},
renderRow: function(a) {
this.$.generator.renderRow(a);
},
prepareRow: function(a) {
this.$.generator.prepareRow(a);
},
lockRow: function() {
this.$.generator.lockRow();
},
performOnRow: function(a, b, c) {
this.$.generator.performOnRow(a, b, c);
},
animateFinish: function(a) {
return this.twiddle(), !0;
},
twiddle: function() {
var a = this.getStrategy();
enyo.call(a, "twiddle");
}
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
slade: 500,
pop: 500
},
transitioning: !1,
movementing: !1,
direction: "next",
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
this.pane < a ? this.direction = "next" : this.direction = "back", this.pane !== a && (this.movementing ? this.cue && this._cue({
action: "pageNumber",
arguments: a
}) : (this.movementing = !0, this._hidePane(this.pane), this._showPane(a)));
},
pageName: function(a) {
this.pane < this._getPageNumber(a) ? this.direction = "next" : this.direction = "back", this.movementing ? this.cue && this._cue.push({
action: "pageName",
arguments: a
}) : (this.movementing = !0, this._paneIsLazy(a) ? (this._hidePane(this.pane), this.createComponent(this._getLazyPane(a), {
owner: this.owner
}), this.getControls()[this._getPageNumber(a)].render(), this._showPane(this._getPageNumber(a)), this._deleteLazyPane(a)) : this.pane !== this._getPageNumber(a) ? (this._hidePane(this.pane), this._showPane(this._getPageNumber(a))) : this._end());
},
back: function() {
this.direction = "back";
if (this.movementing) this.cue && this._cue.push({
action: "back",
arguments: ""
}); else {
if (!this.history[this.historyPane - 1]) return !1;
this._hidePane(this.pane), this._showPane(this.history[this.historyPane - 1], !0, this.historyPane - 1);
}
},
next: function() {
this.direction = "next";
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
d.show(), this.transition != "slade" ? d.addClass("enyo-book-" + this.transition + "-in") : this.direction == "next" ? d.addClass("enyo-book-sladenext-in") : d.addClass("enyo-book-sladeback-in"), this.pane = a, b !== !0 ? (this.history.push(this.pane), this.historyPane = this.history.length - 1) : this.historyPane = c, window.setTimeout(enyo.bind(this, function() {
d.show(), this.transition != "slade" ? d.removeClass("enyo-book-" + this.transition + "-in") : this.direction == "next" ? d.removeClass("enyo-book-sladenext-in") : d.removeClass("enyo-book-sladeback-in"), this._end();
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
this.transition != "slade" ? b.addClass("enyo-book-" + this.transition + "-out") : this.direction == "next" ? b.addClass("enyo-book-sladenext-out") : b.addClass("enyo-book-sladeback-out"), window.setTimeout(enyo.bind(this, function() {
b.hide(), this.transition != "slade" ? b.removeClass("enyo-book-" + this.transition + "-out") : this.direction == "next" ? b.removeClass("enyo-book-sladenext-out") : b.removeClass("enyo-book-sladeback-out"), this._end();
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
classes: "enyo-page enyo-fit"
});

// js/utils.js

function getImagePath(a) {
return "assets/" + a;
}

function getPlatform() {
var a = navigator.appVersion;
return navigator.appVersion.indexOf("iPhone") !== -1 ? "iPhone" : navigator.appVersion.indexOf("iPad") !== -1 ? "iPad" : navigator.appVersion.indexOf("Chrome") !== -1 ? "Chrome" : navigator.appVersion.indexOf("Safari") !== -1 ? "Safari" : "Browser";
}

// js/loginPage.js

enyo.kind({
name: "loginPage",
kind: "Page",
fit: !0,
handlers: {
onLogin: ""
},
components: [ {
classes: "centered loginGroup",
components: [ {
kind: "onyx.Groupbox",
components: [ {
kind: "onyx.GroupboxHeader",
content: "Log into Google Reader"
}, {
kind: "onyx.InputDecorator",
components: [ {
name: "username",
kind: "onyx.Input",
placeholder: "Email Address"
} ]
}, {
kind: "onyx.InputDecorator",
components: [ {
name: "password",
kind: "onyx.Input",
type: "password",
placeholder: "Password"
} ]
} ]
}, {
kind: "enyo.GroupItem",
components: [ {
name: "errorMessage",
classes: "errorMessage",
content: ""
}, {
kind: "onyx.Button",
content: "Log in",
ontap: "attemptLogin"
} ]
}, {
name: "popup",
kind: "onyx.Popup",
centered: !0,
modal: !0,
floating: !0,
components: [ {
name: "popupText",
content: "Would you like to view the tour? We highly recommend it."
}, {
kind: "onyx.Button",
content: "Yes!",
ontap: "showFeeds",
name: "showTour"
}, {
kind: "onyx.Button",
content: "No, I'm silly.",
ontap: "showFeeds"
} ]
} ]
} ],
create: function() {
this.inherited(arguments);
},
showingChanged: function(a) {
this.inherited(arguments), this.getShowing() && a !== undefined && (console.log("loginPage activated"), this.resized());
},
attemptLogin: function() {
this.loggedIn();
},
loggedIn: function() {
this.$.popup.show();
},
showFeeds: function(a, b) {
this.$.popup.hide();
var c = a.name && a.name === "showTour" ? {
showTour: !0
} : null;
this.bubble("onLogin", c);
}
});

// js/gridPage.js

enyo.kind({
name: "gridPage",
kind: "Page",
fit: !0,
layoutKind: "FittableRowsLayout",
handler: {
onViewArticles: "",
onShowSettingsPage: "",
onShowAddFeedPage: ""
},
components: [ {
kind: "enyo.Scroller",
fit: !0,
components: [ {
name: "grid",
kind: enyo.Repeater,
fit: !0,
count: 0,
classes: "grid",
onSetupItem: "setupGridItem",
components: [ {
kind: "gridItem",
ontap: "loadGridItem"
} ]
} ]
}, {
kind: "onyx.Toolbar",
classes: "onyx-toolbar-inline",
components: [ {
content: "NomNomNomXP",
classes: "truncating-text"
}, {
kind: "onyx.IconButton",
classes: "floatRight",
src: getImagePath("menu-icon-settings.png"),
ontap: "bubbleEvent",
eventToBubble: "onShowSettingsPage"
}, {
kind: "onyx.IconButton",
classes: "floatRight",
src: getImagePath("menu-icon-refresh.png")
}, {
kind: "onyx.IconButton",
classes: "floatRight",
src: getImagePath("menu-icon-new.png"),
ontap: "bubbleEvent",
eventToBubble: "onShowAddFeedPage"
} ]
} ],
create: function() {
this.inherited(arguments);
},
showingChanged: function(a) {
this.inherited(arguments), this.getShowing() && a !== undefined && this.activate();
},
activate: function() {
console.log("gridPage activated"), this.resized(), this.loadGrid();
},
bubbleEvent: function(a, b) {
this.bubble(a.eventToBubble);
},
gridItems: [],
loadGrid: function() {
this.gridItems = [ {
dog: "fido"
}, {
dog: "bob"
}, {
dog: "gary"
}, {
dog: "spencer"
}, {
dog: "carl"
}, {
dog: "cary"
}, {
dog: "peter"
}, {
dog: "jerry"
}, {
dog: "fido"
}, {
dog: "bob"
}, {
dog: "gary"
}, {
dog: "spencer"
}, {
dog: "carl"
}, {
dog: "cary"
}, {
dog: "peter"
}, {
dog: "jerry"
}, {
dog: "fido"
}, {
dog: "bob"
}, {
dog: "gary"
}, {
dog: "spencer"
}, {
dog: "carl"
}, {
dog: "cary"
}, {
dog: "peter"
}, {
dog: "jerry"
} ], this.$.grid.setCount(this.gridItems.length), this.$.grid.build();
},
setupGridItem: function(a, b) {
if (this.gridItems[b.index]) return b.item.$.gridItem.setItem(this.gridItems[b.index]), !0;
},
loadGridItem: function(a, b) {
console.log(a.getItem());
var c = [];
for (var d = 0; d < 80; d++) c.push({
title: a.getItem().dog + Math.round(Math.random() * 200),
date: "4/" + Math.round(d / 2) + "/12"
});
this.bubble("onViewArticles", {
articles: c
});
}
}), enyo.kind({
name: "gridItem",
kind: "Control",
classes: "grid-item",
published: {
item: {}
},
components: [ {
kind: "enyo.Image",
src: getImagePath("grid-icon-feed.png")
}, {
kind: "enyo.Control",
classes: "title"
}, {
name: "unread",
classes: "unread"
}, {
name: "icon",
kind: "Image",
classes: "icon"
} ],
itemChanged: function(a, b) {
this.$.control.setContent(this.getItem().dog + this.getItem().dog + this.getItem().dog), this.$.unread.setContent(Math.round(Math.random() * 11)), this.$.icon.setSrc(getImagePath("favicon.ico"));
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
handlers: {
onShowGridPage: ""
},
components: [ {
kind: "onyx.Toolbar",
classes: "onyx-toolbar-inline",
components: [ {
kind: "onyx.Button",
content: "Back",
ontap: "bubbleEvent",
eventToBubble: "onShowGridPage",
classes: "abs"
}, {
content: "hai",
classes: "center",
style: "text-align: center"
} ]
}, {
name: "list",
kind: "List",
rows: 0,
multiSelect: !1,
classes: "enyo-fit list",
onSetupRow: "setupRow",
components: [ {
name: "divider",
classes: "divider"
}, {
name: "item",
classes: "item enyo-border-box",
components: [ {
classes: "unreadIndicator"
}, {
name: "name"
} ]
} ]
} ],
create: function() {
this.inherited(arguments);
},
bubbleEvent: function(a, b) {
this.bubble(a.eventToBubble);
},
articlesChanged: function() {
console.log("LOAD DEM ARTICLES", this.getArticles()), this.$.list.setRows(this.getArticles().length), this.$.list.reset();
},
setupRow: function(a, b) {
var c = b.index, d = this.getArticles()[c];
if (d) {
var e = "";
for (var c = 0; c < Math.round(Math.random() * 150); c++) e += d.title + " ";
this.$.name.setContent(e);
if (!this.hideDivider) {
var f = this.getArticles()[c - 1];
this.$.divider.setContent(d.date), this.$.divider.canGenerate = d.date != (f && f.date);
}
}
}
});

// js/settingsPage.js

enyo.kind({
name: "settingsPage",
kind: "Page",
fit: !0,
layoutKind: "FittableRowsLayout",
handlers: {
onShowGridPage: ""
},
components: [ {
kind: "onyx.Toolbar",
classes: "onyx-toolbar-inline",
components: [ {
kind: "onyx.Button",
content: "Back",
ontap: "bubbleEvent",
eventToBubble: "onShowGridPage",
classes: "abs"
}, {
content: "Settings",
classes: "center",
style: "text-align: center"
} ]
}, {
content: "this is the settings page"
} ],
create: function() {
this.inherited(arguments);
},
bubbleEvent: function(a, b) {
this.bubble(a.eventToBubble);
}
});

// js/addFeedPage.js

enyo.kind({
name: "addFeedPage",
kind: "Page",
fit: !0,
layoutKind: "FittableRowsLayout",
handlers: {
onShowGridPage: ""
},
components: [ {
kind: "onyx.Toolbar",
classes: "onyx-toolbar-inline",
components: [ {
kind: "onyx.Button",
content: "Back",
ontap: "bubbleEvent",
eventToBubble: "onShowGridPage",
classes: "abs"
}, {
content: "Add Feed",
classes: "center",
style: "text-align: center"
} ]
}, {
content: "this is the add feed page"
} ],
bubbleEvent: function(a, b) {
this.bubble(a.eventToBubble);
},
create: function() {
this.inherited(arguments);
}
});

// js/tourPage.js

enyo.kind({
name: "tourPage",
kind: "Page",
fit: !0,
layoutKind: "FittableRowsLayout",
handlers: {
onShowGridPage: ""
},
components: [ {
kind: "onyx.Toolbar",
classes: "onyx-toolbar-inline",
components: [ {
kind: "onyx.Button",
content: "Exit",
ontap: "bubbleEvent",
eventToBubble: "onShowGridPage",
classes: "abs"
}, {
content: "Tour",
classes: "center",
style: "text-align: center"
} ]
}, {
content: "this is the tour page"
} ],
create: function() {
this.inherited(arguments);
},
bubbleEvent: function(a, b) {
this.bubble(a.eventToBubble);
}
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
onViewArticles: "showArticlePage",
onShowSettingsPage: "showSettingsPage",
onShowAddFeedPage: "showAddFeedPage"
}, {
kind: "articlePage",
onShowGridPage: "showGridPage"
}, {
name: "tourPage",
kind: "tourPage",
lazy: !0,
onShowGridPage: "showGridPage"
}, {
name: "addFeedPage",
kind: "addFeedPage",
lazy: !0,
onShowGridPage: "showGridPage"
}, {
name: "settingsPage",
kind: "settingsPage",
lazy: !0,
onShowGridPage: "showGridPage"
} ]
} ],
create: function() {
this.inherited(arguments), window.document.getElementsByTagName("body")[0].className += " " + getPlatform();
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
},
showSettingsPage: function() {
this.$.book.pageName("settingsPage");
},
showAddFeedPage: function() {
this.$.book.pageName("addFeedPage");
}
});
