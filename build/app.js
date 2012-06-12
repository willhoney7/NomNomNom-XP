
// minifier: path aliases

enyo.path.addPaths({onyx: "/Users/Will/Development/Cross Platform/Apps/NomNomNom XP/src/enyo/tools/../../lib/onyx/", onyx: "/Users/Will/Development/Cross Platform/Apps/NomNomNom XP/src/enyo/tools/../../lib/onyx/source/", layout: "/Users/Will/Development/Cross Platform/Apps/NomNomNom XP/src/enyo/tools/../../lib/layout/", onyx: "/Users/Will/Development/Cross Platform/Apps/NomNomNom XP/src/enyo/tools/../../lib/onyx/source/"});

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
count: 0,
multiSelect: !1,
toggleSelected: !1
},
events: {
onSetupItem: ""
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
setupItem: function(a) {
this.doSetupItem({
index: a,
selected: this.isSelected(a)
});
},
generateChildHtml: function() {
var a = "";
this.index = null;
for (var b = 0, c = 0; b < this.count; b++) c = this.rowOffset + (this.bottomUp ? this.count - b - 1 : b), this.setupItem(c), this.$.client.setAttribute("index", c), a += this.inherited(arguments), this.$.client.teardownRender();
return a;
},
previewDomEvent: function(a) {
var b = this.index = this.rowForEvent(a);
a.rowIndex = a.index = b, a.flyweight = this;
},
decorateEvent: function(a, b, c) {
var d = b && b.index != null ? b.index : this.index;
b && d != null && (b.index = d, b.flyweight = this), this.inherited(arguments);
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
b && (this.setupItem(a), b.innerHTML = this.$.client.generateChildHtml(), this.$.client.teardownChildren());
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
count: 0,
rowsPerPage: 50,
bottomUp: !1,
multiSelect: !1,
toggleSelected: !1,
fixedHeight: !1
},
events: {
onSetupItem: ""
},
handlers: {
onAnimateFinish: "animateFinish"
},
rowHeight: 0,
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
this.inherited(arguments), this.refresh();
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
countChanged: function() {
this.hasNode() && this.updateMetrics();
},
updateMetrics: function() {
this.defaultPageHeight = this.rowsPerPage * (this.rowHeight || 100), this.pageCount = Math.ceil(this.count / this.rowsPerPage), this.portSize = 0;
for (var a = 0; a < this.pageCount; a++) this.portSize += this.getPageHeight(a);
this.adjustPortSize();
},
generatePage: function(a, b) {
this.page = a;
var c = this.$.generator.rowOffset = this.rowsPerPage * this.page, d = this.$.generator.count = Math.min(this.count - c, this.rowsPerPage), e = this.$.generator.generateChildHtml();
b.setContent(e), this.rowHeight || (this.rowHeight = Math.floor(b.getBounds().height / d), this.updateMetrics());
if (!this.fixedHeight) {
var f = this.getPageHeight(a), g = this.pageHeights[a] = b.getBounds().height;
f != g && (this.portSize += g - f);
}
},
update: function(a) {
var b = !1, c = this.positionToPageInfo(a), d = c.pos + this.scrollerHeight / 2, e = Math.floor(d / Math.max(c.height, this.scrollerHeight) + .5) + c.no, f = e % 2 == 0 ? e : e - 1;
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

// Slideable.js

enyo.kind({
name: "enyo.Slideable",
kind: "Control",
published: {
axis: "h",
value: 0,
unit: "px",
min: 0,
max: 0,
accelerated: "auto",
overMoving: !0,
draggable: !0
},
events: {
onAnimateFinish: "",
onChange: ""
},
preventDragPropagation: !1,
tools: [ {
kind: "Animator",
onStep: "animatorStep",
onEnd: "animatorComplete"
} ],
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish"
},
kDragScalar: 1,
dragEventProp: "dx",
create: function() {
this.inherited(arguments), this.acceleratedChanged(), this.axisChanged(), this.valueChanged(), this.addClass("enyo-slideable");
},
initComponents: function() {
this.createComponents(this.tools), this.inherited(arguments);
},
rendered: function() {
this.inherited(arguments), this.updateDragScalar();
},
resizeHandler: function() {
this.inherited(arguments), this.updateDragScalar();
},
updateDragScalar: function() {
if (this.unit == "%") {
var a = this.getBounds()[this.dimension];
this.kDragScalar = a ? 100 / a : 1;
}
},
acceleratedChanged: function() {
enyo.platform.android > 2 || enyo.dom.accelerate(this, this.accelerated);
},
axisChanged: function() {
var a = this.axis == "h";
this.dragMoveProp = a ? "dx" : "dy", this.shouldDragProp = a ? "horizontal" : "vertical", this.transform = a ? "translateX" : "translateY", this.dimension = a ? "width" : "height";
},
valueChanged: function(a) {
var b = this.value;
this.isOob(b) && !this.isAnimating() && (this.value = this.overMoving ? this.dampValue(b) : this.clampValue(b)), enyo.platform.android > 2 && (this.value ? (a == 0 || a == undefined) && enyo.dom.accelerate(this, this.accelerated) : enyo.dom.accelerate(this, !1)), enyo.dom.transformValue(this, this.transform, this.value + this.unit), this.doChange();
},
getAnimator: function() {
return this.$.animator;
},
isAtMin: function() {
return this.value <= this.calcMin();
},
isAtMax: function() {
return this.value >= this.calcMax();
},
calcMin: function() {
return this.min;
},
calcMax: function() {
return this.max;
},
clampValue: function(a) {
var b = this.calcMin(), c = this.calcMax();
return Math.max(b, Math.min(a, c));
},
dampValue: function(a) {
return this.dampBound(this.dampBound(a, this.min, 1), this.max, -1);
},
dampBound: function(a, b, c) {
var d = a;
return d * c < b * c && (d = b + (d - b) / 4), d;
},
shouldDrag: function(a) {
return this.draggable && a[this.shouldDragProp];
},
isOob: function(a) {
return a > this.calcMax() || a < this.calcMin();
},
dragstart: function(a, b) {
if (this.shouldDrag(b)) return b.preventDefault(), this.$.animator.stop(), b.dragInfo = {}, this.dragging = !0, this.drag0 = this.value, this.dragd0 = 0, this.preventDragPropagation;
},
drag: function(a, b) {
if (this.dragging) {
b.preventDefault();
var c = b[this.dragMoveProp] * this.kDragScalar, d = this.drag0 + c, e = c - this.dragd0;
return this.dragd0 = c, e && (b.dragInfo.minimizing = e < 0), this.setValue(d), this.preventDragPropagation;
}
},
dragfinish: function(a, b) {
if (this.dragging) return this.dragging = !1, this.completeDrag(b), b.preventTap(), this.preventDragPropagation;
},
completeDrag: function(a) {
this.value !== this.calcMax() && this.value != this.calcMin() && this.animateToMinMax(a.dragInfo.minimizing);
},
isAnimating: function() {
return this.$.animator.isAnimating();
},
play: function(a, b) {
this.$.animator.play({
startValue: a,
endValue: b,
node: this.hasNode()
});
},
animateTo: function(a) {
this.play(this.value, a);
},
animateToMin: function() {
this.animateTo(this.calcMin());
},
animateToMax: function() {
this.animateTo(this.calcMax());
},
animateToMinMax: function(a) {
a ? this.animateToMin() : this.animateToMax();
},
animatorStep: function(a) {
return this.setValue(a.value), !0;
},
animatorComplete: function(a) {
return this.doAnimateFinish(a), !0;
},
toggleMinMax: function() {
this.animateToMinMax(!this.isAtMin());
}
});

// Arranger.js

enyo.kind({
name: "enyo.Arranger",
kind: "Layout",
layoutClass: "enyo-arranger",
accelerated: "auto",
dragProp: "ddx",
dragDirectionProp: "xDirection",
canDragProp: "horizontal",
destroy: function() {
var a = this.container.children;
for (var b = 0, c; c = a[b]; b++) c._arranger = null;
this.inherited(arguments);
},
arrange: function(a, b) {},
size: function() {},
start: function() {
var a = this.container.fromIndex, b = this.container.toIndex, c = this.container.transitionPoints = [ a ];
if (this.incrementalPoints) {
var d = Math.abs(b - a) - 2, e = a;
while (d >= 0) e += b < a ? -1 : 1, c.push(e), d--;
}
c.push(this.container.toIndex);
},
finish: function() {},
canDragEvent: function(a) {
return a[this.canDragProp];
},
calcDragDirection: function(a) {
return a[this.dragDirectionProp];
},
calcDrag: function(a) {
return a[this.dragProp];
},
drag: function(a, b, c, d, e) {
var f = this.measureArrangementDelta(-a, b, c, d, e);
return f;
},
measureArrangementDelta: function(a, b, c, d, e) {
var f = this.calcArrangementDifference(b, c, d, e), g = f ? a / Math.abs(f) : 0;
return g *= this.container.fromIndex > this.container.toIndex ? -1 : 1, g;
},
calcArrangementDifference: function(a, b, c, d) {},
_arrange: function(a) {
var b = this.getOrderedControls(a);
this.arrange(b, a);
},
arrangeControl: function(a, b) {
a._arranger = enyo.mixin(a._arranger || {}, b);
},
flow: function() {
this.c$ = [].concat(this.container.children), this.controlsIndex = 0;
for (var a = 0, b = this.container.children, c; c = b[a]; a++) enyo.dom.accelerate(c, this.accelerated);
},
reflow: function() {
var a = this.container.hasNode();
this.containerBounds = a ? {
width: a.clientWidth,
height: a.clientHeight
} : {}, this.size();
},
flowArrangement: function() {
var a = this.container.arrangement;
if (a) for (var b = 0, c = this.container.children, d; d = c[b]; b++) this.flowControl(d, a[b]);
},
flowControl: function(a, b) {
enyo.Arranger.positionControl(a, b);
var c = b.opacity;
c != null && enyo.Arranger.opacifyControl(a, c);
},
getOrderedControls: function(a) {
var b = Math.floor(a), c = b - this.controlsIndex, d = c > 0, e = this.c$ || [];
for (var f = 0; f < Math.abs(c); f++) d ? e.push(e.shift()) : e.unshift(e.pop());
return this.controlsIndex = b, e;
},
statics: {
positionControl: function(a, b, c) {
var d = c || "px";
if (!this.updating) if (enyo.dom.canTransform()) {
var e = b.left, f = b.top, e = enyo.isString(e) ? e : e && e + d, f = enyo.isString(f) ? f : f && f + d;
enyo.dom.transform(a, {
translateX: e || null,
translateY: f || null
});
} else a.setBounds(b, c);
},
opacifyControl: function(a, b) {
var c = b;
c = c > .99 ? 1 : c < .01 ? 0 : c, enyo.platform.ie < 9 ? a.applyStyle("filter", "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + c * 100 + ")") : a.applyStyle("opacity", c);
}
}
});

// CardArranger.js

enyo.kind({
name: "enyo.CardArranger",
kind: "Arranger",
layoutClass: "enyo-arranger enyo-arranger-fit",
calcArrangementDifference: function(a, b, c, d) {
return this.containerBounds.width;
},
destroy: function() {
var a = this.container.children;
for (var b = 0, c; c = a[b]; b++) enyo.Arranger.opacifyControl(c, 1), c.setShowing(!0), c.resized();
this.inherited(arguments);
},
arrange: function(a, b) {
for (var c = 0, d, e, f; d = a[c]; c++) f = c == 0 ? 1 : 0, this.arrangeControl(d, {
opacity: f
});
},
start: function() {
this.inherited(arguments);
var a = this.container.children;
for (var b = 0, c; c = a[b]; b++) c.setShowing(b == this.container.fromIndex || b == this.container.toIndex), c.showing && c.resized();
},
finish: function() {
this.inherited(arguments);
var a = this.container.children;
for (var b = 0, c; c = a[b]; b++) c.setShowing(b == this.container.toIndex);
}
});

// CardSlideInArranger.js

enyo.kind({
name: "enyo.CardSlideInArranger",
kind: "CardArranger",
start: function() {
var a = this.container.children;
for (var b = 0, c; c = a[b]; b++) c.setShowing(b == this.container.fromIndex || b == this.container.toIndex), c.showing && c.resized();
var d = this.container.fromIndex, b = this.container.toIndex;
this.container.transitionPoints = [ b + "." + d + ".s", b + "." + d + ".f" ];
},
finish: function() {
this.inherited(arguments);
var a = this.container.children;
for (var b = 0, c; c = a[b]; b++) c.setShowing(b == this.container.toIndex);
},
arrange: function(a, b) {
var c = b.split("."), d = c[0], e = c[1], f = c[2] == "s", g = this.containerBounds.width;
for (var h = 0, i = this.container.children, j, g, k; j = i[h]; h++) k = g, e == h && (k = f ? 0 : -g), d == h && (k = f ? g : 0), e == h && e == d && (k = 0), this.arrangeControl(j, {
left: k
});
}
});

// CarouselArranger.js

enyo.kind({
name: "enyo.CarouselArranger",
kind: "Arranger",
size: function() {
var a = this.container.children, b = this.containerPadding = this.container.hasNode() ? enyo.FittableLayout.calcPaddingExtents(this.container.node) : {}, c = this.containerBounds;
c.height -= b.top + b.bottom, c.width -= b.left + b.right;
var d;
for (var e = 0, f = 0, g, h; h = a[e]; e++) g = enyo.FittableLayout.calcMarginExtents(h.hasNode()), h.width = h.getBounds().width, h.marginWidth = g.right + g.left, f += (h.fit ? 0 : h.width) + h.marginWidth, h.fit && (d = h);
if (d) {
var i = c.width - f;
d.width = i >= 0 ? i : d.width;
}
for (var e = 0, j = b.left, g, h; h = a[e]; e++) h.setBounds({
top: b.top,
bottom: b.bottom,
width: h.fit ? h.width : null
});
},
arrange: function(a, b) {
this.container.wrap ? this.arrangeWrap(a, b) : this.arrangeNoWrap(a, b);
},
arrangeNoWrap: function(a, b) {
var c = this.container.children, d = this.container.clamp(b), e = this.containerBounds.width;
for (var f = d, g = 0, h; h = c[f]; f++) {
g += h.width + h.marginWidth;
if (g > e) break;
}
var i = e - g, j = 0;
if (i > 0) {
var k = d;
for (var f = d - 1, l = 0, h; h = c[f]; f--) {
l += h.width + h.marginWidth;
if (i - l <= 0) {
j = i - l, d = f;
break;
}
}
}
for (var f = 0, m = this.containerPadding.left + j, n, h; h = c[f]; f++) n = h.width + h.marginWidth, f < d ? this.arrangeControl(h, {
left: -n
}) : (this.arrangeControl(h, {
left: Math.floor(m)
}), m += n);
},
arrangeWrap: function(a, b) {
for (var c = 0, d = this.containerPadding.left, e, f; f = a[c]; c++) this.arrangeControl(f, {
left: d
}), d += f.width + f.marginWidth;
},
calcArrangementDifference: function(a, b, c, d) {
var e = Math.abs(a % this.c$.length);
return b[e].left - d[e].left;
}
});

// CollapsingArranger.js

enyo.kind({
name: "enyo.CollapsingArranger",
kind: "CarouselArranger",
size: function() {
this.clearLastSize(), this.inherited(arguments);
},
clearLastSize: function() {
for (var a = 0, b = this.container.children, c; c = b[a]; a++) c._fit && a != b.length - 1 && (c.applyStyle("width", null), c._fit = null);
},
arrange: function(a, b) {
var c = this.container.children;
for (var d = 0, e = this.containerPadding.left, f, g; g = c[d]; d++) this.arrangeControl(g, {
left: e
}), d >= b && (e += g.width + g.marginWidth), d == c.length - 1 && b < 0 && this.arrangeControl(g, {
left: e - b
});
},
calcArrangementDifference: function(a, b, c, d) {
var e = this.container.children.length - 1;
return Math.abs(d[e].left - b[e].left);
},
flowControl: function(a, b) {
this.inherited(arguments);
if (this.container.realtimeFit) {
var c = this.container.children, d = c.length - 1, e = c[d];
a == e && this.fitControl(a, b.left);
}
},
finish: function() {
this.inherited(arguments);
if (!this.container.realtimeFit && this.containerBounds) {
var a = this.container.children, b = this.container.arrangement, c = a.length - 1, d = a[c];
this.fitControl(d, b[c].left);
}
},
fitControl: function(a, b) {
a._fit = !0, a.applyStyle("width", this.containerBounds.width - b + "px"), a.resized();
}
});

// OtherArrangers.js

enyo.kind({
name: "enyo.LeftRightArranger",
kind: "Arranger",
margin: 40,
axisSize: "width",
offAxisSize: "height",
axisPosition: "left",
constructor: function() {
this.inherited(arguments), this.margin = this.container.margin != null ? this.container.margin : this.margin;
},
size: function() {
var a = this.container.children, b = this.containerBounds[this.axisSize], c = b - this.margin - this.margin;
for (var d = 0, e, f; f = a[d]; d++) e = {}, e[this.axisSize] = c, e[this.offAxisSize] = "100%", f.setBounds(e);
},
arrange: function(a, b) {
var c = Math.floor(this.container.children.length / 2), d = this.getOrderedControls(Math.floor(b) - c), e = this.containerBounds[this.axisSize] - this.margin - this.margin, f = this.margin - e * c, g = (d.length - 1) / 2;
for (var h = 0, i, j, k; i = d[h]; h++) j = {}, j[this.axisPosition] = f, j.opacity = h == 0 || h == d.length - 1 ? 0 : 1, this.arrangeControl(i, j), f += e;
},
calcArrangementDifference: function(a, b, c, d) {
var e = Math.abs(a % this.c$.length);
return b[e][this.axisPosition] - d[e][this.axisPosition];
}
}), enyo.kind({
name: "enyo.TopBottomArranger",
kind: "LeftRightArranger",
dragProp: "ddy",
dragDirectionProp: "yDirection",
canDragProp: "vertical",
axisSize: "height",
offAxisSize: "width",
axisPosition: "top"
}), enyo.kind({
name: "enyo.SpiralArranger",
kind: "Arranger",
incrementalPoints: !0,
inc: 20,
size: function() {
var a = this.container.children, b = this.containerBounds, c = this.controlWidth = b.width / 3, d = this.controlHeight = b.height / 3;
for (var e = 0, f; f = a[e]; e++) f.setBounds({
width: c,
height: d
});
},
arrange: function(a, b) {
var c = this.inc;
for (var d = 0, e = a.length, f; f = a[d]; d++) {
var g = Math.cos(d / e * 2 * Math.PI) * d * c + this.controlWidth, h = Math.sin(d / e * 2 * Math.PI) * d * c + this.controlHeight;
this.arrangeControl(f, {
left: g,
top: h
});
}
},
start: function() {
this.inherited(arguments);
var a = this.getOrderedControls(this.container.toIndex);
for (var b = 0, c; c = a[b]; b++) c.applyStyle("z-index", a.length - b);
},
calcArrangementDifference: function(a, b, c, d) {
return this.controlWidth;
}
}), enyo.kind({
name: "enyo.GridArranger",
kind: "Arranger",
incrementalPoints: !0,
colWidth: 100,
colHeight: 100,
size: function() {
var a = this.container.children, b = this.colWidth, c = this.colHeight;
for (var d = 0, e; e = a[d]; d++) e.setBounds({
width: b,
height: c
});
},
arrange: function(a, b) {
var d = this.colWidth, e = this.colHeight, f = Math.floor(this.containerBounds.width / d);
for (var g = 0, h = 0; h < a.length; g++) for (var i = 0; i < f && (c = a[h]); i++, h++) this.arrangeControl(c, {
left: d * i,
top: e * g
});
},
flowControl: function(a, b) {
this.inherited(arguments), enyo.Arranger.opacifyControl(a, b.top % this.colHeight != 0 ? .25 : 1);
},
calcArrangementDifference: function(a, b, c, d) {
return this.colWidth;
}
});

// Panels.js

enyo.kind({
name: "enyo.Panels",
classes: "enyo-panels",
published: {
index: 0,
draggable: !0,
animate: !0,
wrap: !1,
arrangerKind: "CardArranger",
narrowFit: !0
},
events: {
onTransitionStart: "",
onTransitionFinish: ""
},
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish"
},
tools: [ {
kind: "Animator",
onStep: "step",
onEnd: "completed"
} ],
fraction: 0,
create: function() {
this.transitionPoints = [], this.inherited(arguments), this.arrangerKindChanged(), this.avoidFitChanged(), this.indexChanged();
},
initComponents: function() {
this.createChrome(this.tools), this.inherited(arguments);
},
arrangerKindChanged: function() {
this.setLayoutKind(this.arrangerKind);
},
avoidFitChanged: function() {
this.addRemoveClass("enyo-panels-fit-narrow", this.narrowFit);
},
removeControl: function(a) {
this.inherited(arguments), this.isPanel(a) && (this.flow(), this.reflow(), this.setIndex(0));
},
isPanel: function() {
return !0;
},
flow: function() {
this.arrangements = [], this.inherited(arguments);
},
reflow: function() {
this.arrangements = [], this.inherited(arguments), this.refresh();
},
getPanels: function() {
var a = this.controlParent || this;
return a.children;
},
getActive: function() {
var a = this.getPanels();
return a[this.index];
},
getAnimator: function() {
return this.$.animator;
},
setIndex: function(a) {
this.setPropertyValue("index", a, "indexChanged");
},
setIndexDirect: function(a) {
this.setIndex(a), this.completed();
},
previous: function() {
this.setIndex(this.index - 1);
},
next: function() {
this.setIndex(this.index + 1);
},
clamp: function(a) {
var b = this.getPanels().length - 1;
return this.wrap ? a : Math.max(0, Math.min(a, b));
},
indexChanged: function(a) {
this.lastIndex = a, this.index = this.clamp(this.index), this.dragging || (this.$.animator.isAnimating() && this.completed(), this.$.animator.stop(), this.hasNode() && (this.animate ? (this.startTransition(), this.$.animator.play({
startValue: this.fraction
})) : this.refresh()));
},
step: function(a) {
this.fraction = a.value, this.stepTransition();
},
completed: function() {
this.$.animator.isAnimating() && this.$.animator.stop(), this.fraction = 1, this.stepTransition(), this.finishTransition();
},
dragstart: function(a, b) {
if (this.draggable && this.layout && this.layout.canDragEvent(b)) return b.preventDefault(), this.dragstartTransition(b), this.dragging = !0, this.$.animator.stop(), !0;
},
drag: function(a, b) {
this.dragging && (b.preventDefault(), this.dragTransition(b));
},
dragfinish: function(a, b) {
this.dragging && (this.dragging = !1, b.preventTap(), this.dragfinishTransition(b));
},
dragstartTransition: function(a) {
if (!this.$.animator.isAnimating()) {
var b = this.fromIndex = this.index;
this.toIndex = b - (this.layout ? this.layout.calcDragDirection(a) : 0);
} else this.verifyDragTransition(a);
this.fromIndex = this.clamp(this.fromIndex), this.toIndex = this.clamp(this.toIndex), this.fireTransitionStart(), this.layout && this.layout.start();
},
dragTransition: function(a) {
var b = this.layout ? this.layout.calcDrag(a) : 0, c = this.transitionPoints, d = c[0], e = c[c.length - 1], f = this.fetchArrangement(d), g = this.fetchArrangement(e), h = this.layout ? this.layout.drag(b, d, f, e, g) : 0, i = b && !h;
!i, this.fraction += h;
var e = this.fraction;
if (e > 1 || e < 0 || i) (e > 0 || i) && this.dragfinishTransition(a), this.dragstartTransition(a), this.fraction = 0;
this.stepTransition();
},
dragfinishTransition: function(a) {
this.verifyDragTransition(a), this.setIndex(this.toIndex), this.dragging && this.fireTransitionFinish();
},
verifyDragTransition: function(a) {
var b = this.layout ? this.layout.calcDragDirection(a) : 0, c = Math.min(this.fromIndex, this.toIndex), d = Math.max(this.fromIndex, this.toIndex);
if (b > 0) {
var e = c;
c = d, d = e;
}
c != this.fromIndex && (this.fraction = 1 - this.fraction), this.fromIndex = c, this.toIndex = d;
},
refresh: function() {
this.$.animator.isAnimating() && this.$.animator.stop(), this.startTransition(), this.fraction = 1, this.stepTransition(), this.finishTransition();
},
startTransition: function() {
this.fromIndex = this.fromIndex != null ? this.fromIndex : this.lastIndex || 0, this.toIndex = this.toIndex != null ? this.toIndex : this.index, this.layout && this.layout.start(), this.fireTransitionStart();
},
finishTransition: function() {
this.layout && this.layout.finish(), this.transitionPoints = [], this.fraction = 0, this.fromIndex = this.toIndex = null, this.fireTransitionFinish();
},
fireTransitionStart: function() {
var a = this.startTransitionInfo;
this.hasNode() && (!a || a.fromIndex != this.fromIndex || a.toIndex != this.toIndex) && (this.startTransitionInfo = {
fromIndex: this.fromIndex,
toIndex: this.toIndex
}, this.doTransitionStart(enyo.clone(this.startTransitionInfo)));
},
fireTransitionFinish: function() {
var a = this.finishTransitionInfo;
this.hasNode() && (!a || a.fromIndex != this.lastIndex || a.toIndex != this.index) && (this.finishTransitionInfo = {
fromIndex: this.lastIndex,
toIndex: this.index
}, this.doTransitionFinish(enyo.clone(this.finishTransitionInfo)));
},
stepTransition: function() {
if (this.hasNode()) {
var a = this.transitionPoints, b = (this.fraction || 0) * (a.length - 1), c = Math.floor(b);
b -= c;
var d = a[c], e = a[c + 1], f = this.fetchArrangement(d), g = this.fetchArrangement(e);
this.arrangement = f && g ? enyo.Panels.lerp(f, g, b) : f || g, this.arrangement && this.layout && this.layout.flowArrangement();
}
},
fetchArrangement: function(a) {
return a != null && !this.arrangements[a] && this.layout && (this.layout._arrange(a), this.arrangements[a] = this.readArrangement(this.children)), this.arrangements[a];
},
readArrangement: function(a) {
var b = [];
for (var c = 0, d = a, e; e = d[c]; c++) b.push(enyo.clone(e._arranger));
return b;
},
statics: {
isScreenNarrow: function() {
return enyo.dom.getWindowWidth() <= 800;
},
lerp: function(a, b, c) {
var d = [];
for (var e = 0, f = enyo.keys(a), g; g = f[e]; e++) d.push(this.lerpObject(a[g], b[g], c));
return d;
},
lerpObject: function(a, b, c) {
var d = enyo.clone(a), e, f;
for (var g in a) e = a[g], f = b[g], e != f && (d[g] = e - (e - f) * c);
return d;
}
}
});

// Tooltip.js

enyo.kind({
name: "onyx.Tooltip",
kind: "onyx.Popup",
classes: "onyx-tooltip",
autoDismiss: !1,
showDelay: 500,
handlers: {
onRequestShowTooltip: "requestShow",
onRequestHideTooltip: "requestHide"
},
requestShow: function() {
return this.showJob = setTimeout(enyo.bind(this, "show"), this.showDelay), !0;
},
cancelShow: function() {
clearTimeout(this.showJob);
},
requestHide: function() {
return this.cancelShow(), this.inherited(arguments);
},
showingChanged: function() {
this.cancelShow(), this.inherited(arguments);
}
});

// TooltipDecorator.js

enyo.kind({
name: "onyx.TooltipDecorator",
defaultKind: "onyx.Button",
classes: "onyx-popup-decorator",
handlers: {
onenter: "enter",
onleave: "leave"
},
enter: function() {
this.requestShowTooltip();
},
leave: function() {
this.requestHideTooltip();
},
tap: function() {
this.requestHideTooltip();
},
requestShowTooltip: function() {
this.waterfallDown("onRequestShowTooltip");
},
requestHideTooltip: function() {
this.waterfallDown("onRequestHideTooltip");
}
});

// Menu.js

enyo.kind({
name: "onyx.Menu",
kind: "onyx.Popup",
modal: !0,
defaultKind: "onyx.MenuItem",
classes: "onyx-menu",
showOnTop: !1,
handlers: {
onActivate: "itemActivated",
onRequestShowMenu: "requestMenuShow",
onRequestHideMenu: "requestHide"
},
itemActivated: function(a, b) {
return b.originator.setActive(!1), !0;
},
showingChanged: function() {
this.inherited(arguments);
if (this.showing && this.hasNode()) {
this.removeClass("onyx-menu-up");
var a = this.node.getBoundingClientRect();
this.menuUp = a.top + a.height > window.innerHeight, this.addRemoveClass("onyx-menu-up", this.menuUp);
if (this.floating && this.menuUp) {
var b = this.activatorOffset;
this.applyPosition({
top: b.top - a.height + b.height,
bottom: "auto"
});
}
}
},
requestMenuShow: function(a, b) {
if (this.floating) {
var c = b.activator.hasNode();
if (c) {
var d = this.activatorOffset = this.getPageOffset(c);
this.applyPosition({
top: d.top + (this.showOnTop ? 0 : d.height),
left: d.left,
width: d.width
});
}
}
return this.show(), !0;
},
applyPosition: function(a) {
var b = "";
for (n in a) b += n + ":" + a[n] + (isNaN(a[n]) ? "; " : "px; ");
this.addStyles(b);
},
getPageOffset: function(a) {
var b = a.getBoundingClientRect();
return {
top: b.top + window.pageYOffset,
left: b.left + window.pageXOffset,
height: b.height,
width: b.width
};
}
});

// MenuItem.js

enyo.kind({
name: "onyx.MenuItem",
kind: "enyo.Button",
tag: "div",
classes: "onyx-menu-item"
});

// MenuDecorator.js

enyo.kind({
name: "onyx.MenuDecorator",
kind: "onyx.TooltipDecorator",
defaultKind: "onyx.Button",
classes: "onyx-popup-decorator enyo-unselectable",
handlers: {
onActivate: "activated",
onHide: "menuHidden"
},
activated: function(a, b) {
this.requestHideTooltip(), b.originator.active ? (this.menuActive = !0, this.activator = b.originator, this.activator.addClass("active"), this.requestShowMenu()) : this.requestHideMenu();
},
requestShowMenu: function() {
this.waterfallDown("onRequestShowMenu", {
activator: this.activator
});
},
requestHideMenu: function() {
this.waterfallDown("onRequestHideMenu");
},
menuHidden: function() {
this.menuActive = !1, this.activator && (this.activator.setActive(!1), this.activator.removeClass("active"));
},
enter: function(a) {
this.menuActive || this.inherited(arguments);
},
leave: function(a, b) {
this.menuActive || this.inherited(arguments);
}
});

// MoreToolbar.js

enyo.kind({
name: "onyx.MoreToolbar",
layoutKind: "FittableColumnsLayout",
noStretch: !0,
classes: "onyx-toolbar onyx-more-toolbar",
tools: [ {
name: "client",
fit: !0,
classes: "onyx-toolbar-inline"
}, {
name: "nard",
kind: "onyx.MenuDecorator",
showing: !1,
components: [ {
kind: "onyx.IconButton",
classes: "onyx-more-button"
}, {
name: "menu",
kind: "onyx.Menu",
classes: "onyx-more-menu",
prepend: !0
} ]
} ],
initComponents: function() {
this.createChrome(this.tools), this.inherited(arguments);
},
reflow: function() {
this.inherited(arguments), this.isContentOverflowing() ? (this.$.nard.show(), this.popItem() && this.reflow()) : this.tryPushItem() ? this.reflow() : this.$.menu.children.length || (this.$.nard.hide(), this.$.menu.hide());
},
popItem: function() {
var a = this.findCollapsibleItem();
if (a) {
this.$.menu.addChild(a);
var b = this.$.menu.hasNode();
return b && a.hasNode() && a.insertNodeInParent(b), !0;
}
},
pushItem: function() {
var a = this.$.menu.children, b = a[0];
if (b) {
this.$.client.addChild(b);
var c = this.$.client.hasNode();
return c && b.hasNode() && b.appendNodeToParent(c), !0;
}
},
tryPushItem: function() {
if (this.pushItem()) {
if (!this.isContentOverflowing()) return !0;
this.popItem();
}
},
isContentOverflowing: function() {
if (this.$.client.hasNode()) return this.$.client.node.scrollWidth > this.$.client.node.clientWidth;
},
findCollapsibleItem: function() {
var a = this.$.client.children;
for (var b = a.length - 1; c = a[b]; b--) if (!c.unmoveable) return c;
}
});

// Drawer.js

enyo.kind({
name: "onyx.Drawer",
published: {
open: !0,
orient: "v"
},
style: "overflow: hidden; position: relative;",
tools: [ {
kind: "Animator",
onStep: "animatorStep",
onEnd: "animatorEnd"
}, {
name: "client",
style: "position: relative;",
classes: "enyo-border-box"
} ],
create: function() {
this.inherited(arguments), this.openChanged();
},
initComponents: function() {
this.createChrome(this.tools), this.inherited(arguments);
},
openChanged: function() {
this.$.client.show();
if (this.hasNode()) {
var a = this.orient == "v", b = a ? "height" : "width", c = a ? "top" : "left";
this.applyStyle(b, null);
var d = this.hasNode()[a ? "scrollHeight" : "scrollWidth"];
this.$.animator.play({
startValue: this.open ? 0 : d,
endValue: this.open ? d : 0,
dimension: b,
position: c
});
} else this.$.client.setShowing(this.open);
},
animatorStep: function(a) {
if (this.hasNode()) {
var b = a.dimension;
this.node.style[b] = this.domStyles[b] = a.value + "px";
}
var c = this.$.client.hasNode();
if (c) {
var d = a.position, e = this.open ? a.endValue : a.startValue;
c.style[d] = this.$.client.domStyles[d] = a.value - e + "px";
}
this.container && this.container.resized();
},
animatorEnd: function() {
this.open || this.$.client.hide(), this.container && this.container.resized();
}
});

// PickerDecorator.js

enyo.kind({
name: "onyx.PickerDecorator",
kind: "onyx.MenuDecorator",
classes: "onyx-picker-decorator",
defaultKind: "onyx.PickerButton",
handlers: {
onSelect: "selected"
},
selected: function(a, b) {
this.waterfallDown("onSelect", b);
}
});

// PickerButton.js

enyo.kind({
name: "onyx.PickerButton",
kind: "onyx.Button",
handlers: {
onSelect: "selected"
},
selected: function(a, b) {
this.setContent(b.content);
}
});

// Picker.js

enyo.kind({
name: "onyx.Picker",
kind: "onyx.Menu",
classes: "onyx-picker enyo-unselectable",
published: {
selected: null,
maxHeight: "200px"
},
events: {
onSelect: ""
},
components: [ {
name: "client",
kind: "enyo.Scroller",
strategyKind: "TouchScrollStrategy"
} ],
floating: !0,
showOnTop: !0,
scrollerName: "client",
create: function() {
this.inherited(arguments), this.maxHeightChanged();
},
getScroller: function() {
return this.$[this.scrollerName];
},
maxHeightChanged: function() {
this.getScroller().setMaxHeight(this.maxHeight);
},
showingChanged: function() {
this.getScroller().setShowing(this.showing), this.inherited(arguments), this.showing && this.selected && this.scrollToSelected();
},
scrollToSelected: function() {
this.getScroller().scrollToControl(this.selected, !this.menuUp);
},
itemActivated: function(a, b) {
return this.processActivatedItem(b.originator), this.inherited(arguments);
},
processActivatedItem: function(a) {
a.active && this.setSelected(a);
},
selectedChanged: function(a) {
a && a.removeClass("selected"), this.selected && (this.selected.addClass("selected"), this.doSelect({
selected: this.selected,
content: this.selected.content
}));
}
});

// FlyweightPicker.js

enyo.kind({
name: "onyx.FlyweightPicker",
kind: "onyx.Picker",
classes: "onyx-flyweight-picker",
published: {
count: 0
},
events: {
onSetupItem: ""
},
components: [ {
name: "scroller",
kind: "enyo.Scroller",
strategyKind: "TouchScrollStrategy",
components: [ {
name: "client",
kind: "FlyweightRepeater",
ontap: "itemTap"
} ]
} ],
scrollerName: "scroller",
create: function() {
this.inherited(arguments), this.countChanged();
},
rendered: function() {
this.inherited(arguments), this.selectedChanged();
},
scrollToSelected: function() {
var a = this.$.client.fetchRowNode(this.selected);
this.getScroller().scrollToNode(a, !this.menuUp);
},
countChanged: function() {
this.$.client.count = this.count;
},
processActivatedItem: function(a) {
this.item = a;
},
selectedChanged: function(a) {
if (!this.item) return;
a !== undefined && (this.item.removeClass("selected"), this.$.client.renderRow(a)), this.item.addClass("selected"), this.$.client.renderRow(this.selected), this.item.removeClass("selected");
var b = this.$.client.fetchRowNode(this.selected);
this.doSelect({
selected: this.selected,
content: b && b.textContent || this.item.content
});
},
itemTap: function(a, b) {
this.setSelected(b.rowIndex);
}
});

// Item.js

enyo.kind({
name: "onyx.Item",
classes: "onyx-item",
tapHighlight: !0,
handlers: {
onhold: "hold",
onrelease: "release"
},
hold: function(a, b) {
this.tapHighlight && onyx.Item.addFlyweightClass(this.controlParent || this, "onyx-highlight", b);
},
release: function(a, b) {
this.tapHighlight && onyx.Item.removeFlyweightClass(this.controlParent || this, "onyx-highlight", b);
},
statics: {
addFlyweightClass: function(a, b, c, d) {
var e = c.flyweight;
if (e) {
var f = d != undefined ? d : c.index;
e.performOnRow(f, function() {
a.hasClass(b) ? a.setClassAttribute(a.getClassAttribute()) : a.addClass(b);
}), enyo.log(a.generated), a.removeClass(b);
}
},
removeFlyweightClass: function(a, b, c, d) {
var e = c.flyweight;
if (e) {
var f = d != undefined ? d : c.index;
e.performOnRow(f, function() {
a.hasClass(b) ? a.removeClass(b) : a.setClassAttribute(a.getClassAttribute());
});
}
}
}
});

// SwipeableItem.js

enyo.kind({
name: "onyx.SwipeableItem",
kind: "onyx.Item",
classes: "onyx-swipeable-item",
published: {
contentClasses: ""
},
defaultContentClasses: "onyx-swipeable-item-content",
handlers: {
ondown: "down"
},
events: {
onDelete: "",
onCancel: ""
},
components: [ {
name: "client",
kind: "Slideable",
min: -100,
unit: "%",
ondragstart: "clientDragStart"
}, {
name: "confirm",
kind: "onyx.Toolbar",
canGenerate: !1,
classes: "onyx-swipeable-item-confirm enyo-fit",
style: "text-align: center;",
ontap: "confirmTap",
components: [ {
kind: "onyx.Button",
content: "Delete",
ontap: "deleteTap"
}, {
kind: "onyx.Button",
content: "Cancel",
ontap: "cancelTap"
} ]
} ],
swiping: -1,
create: function() {
this.inherited(arguments), this.contentClassesChanged();
},
reset: function() {
this.applyStyle("position", null), this.$.confirm.setShowing(!1), this.$.client.getAnimator().stop(), this.$.client.setValue(0);
},
contentClassesChanged: function() {
this.$.client.setClasses(this.defaultContentClasses + " " + this.contentClasses);
},
applyContentStyle: function(a, b) {
this.$.client.applyStyle(a, b);
},
addContentClass: function(a) {
this.$.client.addClass(a);
},
removeContentClass: function(a) {
this.$.client.removeClass(a);
},
hasContentClass: function(a) {
return this.$.client.hasClass(a);
},
addRemoveContentClass: function(a, b) {
this.$.client.addRemoveClass(a, b);
},
generateHtml: function() {
return this.reset(), this.inherited(arguments);
},
contentChanged: function() {
this.$.client.setContent(this.content);
},
confirmTap: function() {
return !0;
},
deleteTap: function(a, b) {
return this.reset(), this.doDelete(), !0;
},
cancelTap: function(a, b) {
return this.$.client.animateToMax(), this.doCancel(), !0;
},
down: function(a, b) {
var c = this.swiping;
this.swiping = b.index;
var d = b.flyweight;
this.swiping != c && c >= 0 && d && d.performOnRow(c, enyo.bind(this, function() {
this.reset();
}));
},
clientDragStart: function(a, b) {
if (a.dragging) {
var c = b.flyweight;
c && (c.prepareRow(b.index), this.applyStyle("position", "relative"), this.$.confirm.setShowing(!0), this.$.confirm.hasNode() || (this.$.confirm.prepend = !0, this.$.confirm.render(), this.$.confirm.prepend = !1));
}
}
});

// Spinner.js

enyo.kind({
name: "onyx.Spinner",
classes: "onyx-spinner"
});

// Scrim.js

enyo.kind({
name: "onyx.Scrim",
showing: !1,
classes: "onyx-scrim enyo-fit",
floating: !1,
create: function() {
this.inherited(arguments), this.floating && this.setParent(enyo.floatingLayer);
},
showingChanged: function() {
this.floating && this.showing && !this.hasNode() && this.render(), this.inherited(arguments);
},
make: function() {
return this;
}
}), enyo.kind({
name: "onyx.scrimSingleton",
kind: null,
constructor: function(a, b) {
this.instanceName = a, enyo.setObject(this.instanceName, this), this.props = b || {};
},
make: function() {
var a = new onyx.Scrim(this.props);
return enyo.setObject(this.instanceName, a), a;
},
show: function() {
var a = this.make();
a.show();
}
}), new onyx.scrimSingleton("onyx.scrim", {
floating: !0,
classes: "onyx-scrim-translucent"
}), new onyx.scrimSingleton("onyx.scrimTransparent", {
floating: !0,
classes: "onyx-scrim-transparent"
});

// TabPanels.js

enyo.kind({
name: "enyo.TabPanels",
kind: "Panels",
draggable: !1,
tabTools: [ {
name: "scroller",
kind: "Scroller",
maxHeight: "100px",
strategyKind: "TranslateScrollStrategy",
thumb: !1,
vertical: "hidden",
horizontal: "auto",
components: [ {
name: "tabs",
kind: "onyx.RadioGroup",
style: "text-align: left; white-space: nowrap",
controlClasses: "onyx-tabbutton",
onActivate: "tabActivate"
} ]
}, {
name: "client",
fit: !0,
kind: "Panels",
classes: "enyo-tab-panels",
onTransitionStart: "clientTransitionStart"
} ],
create: function() {
this.inherited(arguments), this.$.client.getPanels = enyo.bind(this, "getClientPanels"), this.draggableChanged(), this.animateChanged(), this.wrapChanged();
},
initComponents: function() {
this.createChrome(this.tabTools), this.inherited(arguments);
},
getClientPanels: function() {
return this.getPanels();
},
flow: function() {
this.inherited(arguments), this.$.client.flow();
},
reflow: function() {
this.inherited(arguments), this.$.client.reflow();
},
draggableChanged: function() {
this.$.client.setDraggable(this.draggable), this.draggable = !1;
},
animateChanged: function() {
this.$.client.setAnimate(this.animate), this.animate = !1;
},
wrapChanged: function() {
this.$.client.setWrap(this.wrap), this.wrap = !1;
},
isPanel: function(a) {
var b = a.name;
return b != "tabs" && b != "client" && b != "scroller";
},
addControl: function(a) {
this.inherited(arguments);
if (this.isPanel(a)) {
var b = a.caption || "Tab " + this.$.tabs.controls.length, c = a._tab = this.$.tabs.createComponent({
content: b
});
this.hasNode() && c.render();
}
},
removeControl: function(a) {
this.isPanel(a) && a._tab && a._tab.destroy(), this.inherited(arguments);
},
layoutKindChanged: function() {
this.layout || (this.layout = enyo.createFromKind("FittableRowsLayout", this)), this.$.client.setLayoutKind(this.layoutKind);
},
indexChanged: function() {
this.$.client.layout && this.$.client.setIndex(this.index), this.index = this.$.client.getIndex();
},
tabActivate: function(a, b) {
if (this.hasNode() && b.originator.active) {
var c = b.originator.indexInContainer();
this.getIndex() != c && this.setIndex(c);
}
},
clientTransitionStart: function(a, b) {
var c = b.toIndex, d = this.$.tabs.getClientControls()[c];
if (d && d.hasNode()) {
this.$.tabs.setActive(d);
var e = d.node, f = e.offsetLeft, g = f + e.offsetWidth, h = this.$.scroller.getScrollBounds();
(g < h.left || g > h.left + h.clientWidth) && this.$.scroller.scrollToControl(d);
}
return !0;
},
startTransition: enyo.nop,
finishTransition: enyo.nop,
stepTransition: enyo.nop,
refresh: enyo.nop
});

// vendors/humane.min.js

!function(a) {
var b = document, c = {
on: function(b, c, d) {
"addEventListener" in a ? b.addEventListener(c, d, !1) : b.attachEvent("on" + c, d);
},
off: function(b, c, d) {
"removeEventListener" in a ? b.removeEventListener(c, d, !1) : b.detachEvent("on" + c, d);
},
bind: function(a, b) {
return function() {
a.apply(b, arguments);
};
},
isArray: Array.isArray || function(a) {
return Object.prototype.toString.call(a) === "[object Array]";
},
domLoaded: !1,
config: function(a, b) {
return a != null ? a : b;
},
transSupport: !1,
useFilter: /msie [678]/i.test(navigator.userAgent),
_checkTransition: function() {
var a = b.createElement("div"), c = {
webkit: "webkit",
Moz: "",
O: "o",
ms: "MS"
};
for (var d in c) d + "Transition" in a.style && (this.vendorPrefix = c[d], this.transSupport = !0);
}
};
c._checkTransition();
var d = function(b) {
b || (b = {}), this.queue = [], this.baseCls = b.baseCls || "humane", this.addnCls = b.addnCls || "", this.timeout = b.timeout || 2500, this.waitForMove = b.waitForMove || !1, this.clickToClose = b.clickToClose || !1, this.forceNew = b.forceNew || !1, c.domLoaded ? this._setupEl() : c.on(a, "load", c.bind(this._setupEl, this));
};
d.prototype = {
constructor: d,
_setupEl: function() {
var a = b.createElement("div");
a.style.display = "none", b.body.appendChild(a), this.el = a, this.removeEvent = c.bind(this.remove, this), this.transEvent = c.bind(this._afterAnimation, this), c.domLoaded = !0;
},
_afterTimeout: function() {
c.config(this.currentMsg.waitForMove, this.waitForMove) ? this.removeEventsSet || (c.on(b.body, "mousemove", this.removeEvent), c.on(b.body, "click", this.removeEvent), c.on(b.body, "keypress", this.removeEvent), c.on(b.body, "touchstart", this.removeEvent), this.removeEventsSet = !0) : this.remove();
},
_run: function() {
if (this._animating || !this.queue.length || !this.el) return;
this._animating = !0, this.currentTimer && (clearTimeout(this.currentTimer), this.currentTimer = null);
var a = this.queue.shift(), b = c.config(a.clickToClose, this.clickToClose);
b && (c.on(this.el, "click", this.removeEvent), c.on(this.el, "touchstart", this.removeEvent));
var d = c.config(a.timeout, this.timeout);
d > 0 && (this.currentTimer = setTimeout(c.bind(this._afterTimeout, this), d)), c.isArray(a.html) && (a.html = "<ul><li>" + a.html.join("<li>") + "</ul>"), this.el.innerHTML = a.html, this.currentMsg = a, this.el.className = this.baseCls, c.transSupport ? (this.el.style.display = "block", setTimeout(c.bind(this._showMsg, this), 50)) : this._showMsg();
},
_setOpacity: function(a) {
c.useFilter ? this.el.filters.item("DXImageTransform.Microsoft.Alpha").Opacity = a * 100 : this.el.style.opacity = String(a);
},
_showMsg: function() {
var a = c.config(this.currentMsg.addnCls, this.addnCls);
if (c.transSupport) this.el.className = this.baseCls + " " + a + " " + this.baseCls + "-animate"; else {
var b = 0;
this.el.className = this.baseCls + " " + a + " " + this.baseCls + "-js-animate", this._setOpacity(0), this.el.style.display = "block";
var d = this, e = setInterval(function() {
b < 1 ? (b += .1, b > 1 && (b = 1), d._setOpacity(b)) : clearInterval(e);
}, 30);
}
},
_hideMsg: function() {
var a = c.config(this.currentMsg.addnCls, this.addnCls);
if (c.transSupport) this.el.className = this.baseCls + " " + a, c.on(this.el, c.vendorPrefix ? c.vendorPrefix + "TransitionEnd" : "transitionend", this.transEvent); else var b = 1, d = this, e = setInterval(function() {
b > 0 ? (b -= .1, b < 0 && (b = 0), d._setOpacity(b)) : (d.el.className = d.baseCls + " " + a, clearInterval(e), d._afterAnimation());
}, 30);
},
_afterAnimation: function() {
c.transSupport && c.off(this.el, c.vendorPrefix ? c.vendorPrefix + "TransitionEnd" : "transitionend", this.transEvent), this.currentMsg.cb && this.currentMsg.cb(), this.el.style.display = "none", this._animating = !1, this._run();
},
remove: function(a) {
var d = typeof a == "function" ? a : null;
c.off(b.body, "mousemove", this.removeEvent), c.off(b.body, "click", this.removeEvent), c.off(b.body, "keypress", this.removeEvent), c.off(b.body, "touchstart", this.removeEvent), c.off(this.el, "click", this.removeEvent), c.off(this.el, "touchstart", this.removeEvent), this.removeEventsSet = !1, d && (this.currentMsg.cb = d), this._animating ? this._hideMsg() : d && d();
},
log: function(a, b, c, d) {
var e = d || {};
if (typeof b == "function") c = b; else if (b) for (var f in b) e[f] = b[f];
return e.html = a, c && (e.cb = c), this.queue.push(e), this._run(), this;
},
spawn: function(a) {
var b = this;
return function(c, d, e) {
b.log.call(b, c, d, e, a);
};
},
create: function(a) {
return new d(a);
}
}, a.humane = new d;
}(this);

// vendors/underscore-min.js

(function() {
function a(b, c, d) {
if (b === c) return 0 !== b || 1 / b == 1 / c;
if (null == b || null == c) return b === c;
b._chain && (b = b._wrapped), c._chain && (c = c._wrapped);
if (b.isEqual && v.isFunction(b.isEqual)) return b.isEqual(c);
if (c.isEqual && v.isFunction(c.isEqual)) return c.isEqual(b);
var e = i.call(b);
if (e != i.call(c)) return !1;
switch (e) {
case "[object String]":
return b == "" + c;
case "[object Number]":
return b != +b ? c != +c : 0 == b ? 1 / b == 1 / c : b == +c;
case "[object Date]":
case "[object Boolean]":
return +b == +c;
case "[object RegExp]":
return b.source == c.source && b.global == c.global && b.multiline == c.multiline && b.ignoreCase == c.ignoreCase;
}
if ("object" != typeof b || "object" != typeof c) return !1;
for (var f = d.length; f--; ) if (d[f] == b) return !0;
d.push(b);
var f = 0, g = !0;
if ("[object Array]" == e) {
if (f = b.length, g = f == c.length) for (; f-- && (g = f in b == f in c && a(b[f], c[f], d)); ) ;
} else {
if ("constructor" in b != "constructor" in c || b.constructor != c.constructor) return !1;
for (var h in b) if (v.has(b, h) && (f++, !(g = v.has(c, h) && a(b[h], c[h], d)))) break;
if (g) {
for (h in c) if (v.has(c, h) && !(f--)) break;
g = !f;
}
}
return d.pop(), g;
}
var b = this, c = b._, d = {}, e = Array.prototype, f = Object.prototype, g = e.slice, h = e.unshift, i = f.toString, j = f.hasOwnProperty, k = e.forEach, l = e.map, m = e.reduce, n = e.reduceRight, o = e.filter, p = e.every, q = e.some, r = e.indexOf, s = e.lastIndexOf, f = Array.isArray, t = Object.keys, u = Function.prototype.bind, v = function(a) {
return new G(a);
};
"undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = v), exports._ = v) : b._ = v, v.VERSION = "1.3.3";
var w = v.each = v.forEach = function(a, b, c) {
if (a != null) if (k && a.forEach === k) a.forEach(b, c); else if (a.length === +a.length) {
for (var e = 0, f = a.length; e < f; e++) if (e in a && b.call(c, a[e], e, a) === d) break;
} else for (e in a) if (v.has(a, e) && b.call(c, a[e], e, a) === d) break;
};
v.map = v.collect = function(a, b, c) {
var d = [];
return a == null ? d : l && a.map === l ? a.map(b, c) : (w(a, function(a, e, f) {
d[d.length] = b.call(c, a, e, f);
}), a.length === +a.length && (d.length = a.length), d);
}, v.reduce = v.foldl = v.inject = function(a, b, c, d) {
var e = arguments.length > 2;
a == null && (a = []);
if (m && a.reduce === m) return d && (b = v.bind(b, d)), e ? a.reduce(b, c) : a.reduce(b);
w(a, function(a, f, g) {
e ? c = b.call(d, c, a, f, g) : (c = a, e = !0);
});
if (!e) throw new TypeError("Reduce of empty array with no initial value");
return c;
}, v.reduceRight = v.foldr = function(a, b, c, d) {
var e = arguments.length > 2;
a == null && (a = []);
if (n && a.reduceRight === n) return d && (b = v.bind(b, d)), e ? a.reduceRight(b, c) : a.reduceRight(b);
var f = v.toArray(a).reverse();
return d && !e && (b = v.bind(b, d)), e ? v.reduce(f, b, c, d) : v.reduce(f, b);
}, v.find = v.detect = function(a, b, c) {
var d;
return x(a, function(a, e, f) {
if (b.call(c, a, e, f)) return d = a, !0;
}), d;
}, v.filter = v.select = function(a, b, c) {
var d = [];
return a == null ? d : o && a.filter === o ? a.filter(b, c) : (w(a, function(a, e, f) {
b.call(c, a, e, f) && (d[d.length] = a);
}), d);
}, v.reject = function(a, b, c) {
var d = [];
return a == null ? d : (w(a, function(a, e, f) {
b.call(c, a, e, f) || (d[d.length] = a);
}), d);
}, v.every = v.all = function(a, b, c) {
var e = !0;
return a == null ? e : p && a.every === p ? a.every(b, c) : (w(a, function(a, f, g) {
if (!(e = e && b.call(c, a, f, g))) return d;
}), !!e);
};
var x = v.some = v.any = function(a, b, c) {
b || (b = v.identity);
var e = !1;
return a == null ? e : q && a.some === q ? a.some(b, c) : (w(a, function(a, f, g) {
if (e || (e = b.call(c, a, f, g))) return d;
}), !!e);
};
v.include = v.contains = function(a, b) {
var c = !1;
return a == null ? c : r && a.indexOf === r ? a.indexOf(b) != -1 : c = x(a, function(a) {
return a === b;
});
}, v.invoke = function(a, b) {
var c = g.call(arguments, 2);
return v.map(a, function(a) {
return (v.isFunction(b) ? b || a : a[b]).apply(a, c);
});
}, v.pluck = function(a, b) {
return v.map(a, function(a) {
return a[b];
});
}, v.max = function(a, b, c) {
if (!b && v.isArray(a) && a[0] === +a[0]) return Math.max.apply(Math, a);
if (!b && v.isEmpty(a)) return -Infinity;
var d = {
computed: -Infinity
};
return w(a, function(a, e, f) {
e = b ? b.call(c, a, e, f) : a, e >= d.computed && (d = {
value: a,
computed: e
});
}), d.value;
}, v.min = function(a, b, c) {
if (!b && v.isArray(a) && a[0] === +a[0]) return Math.min.apply(Math, a);
if (!b && v.isEmpty(a)) return Infinity;
var d = {
computed: Infinity
};
return w(a, function(a, e, f) {
e = b ? b.call(c, a, e, f) : a, e < d.computed && (d = {
value: a,
computed: e
});
}), d.value;
}, v.shuffle = function(a) {
var b = [], c;
return w(a, function(a, d) {
c = Math.floor(Math.random() * (d + 1)), b[d] = b[c], b[c] = a;
}), b;
}, v.sortBy = function(a, b, c) {
var d = v.isFunction(b) ? b : function(a) {
return a[b];
};
return v.pluck(v.map(a, function(a, b, e) {
return {
value: a,
criteria: d.call(c, a, b, e)
};
}).sort(function(a, b) {
var c = a.criteria, d = b.criteria;
return c === void 0 ? 1 : d === void 0 ? -1 : c < d ? -1 : c > d ? 1 : 0;
}), "value");
}, v.groupBy = function(a, b) {
var c = {}, d = v.isFunction(b) ? b : function(a) {
return a[b];
};
return w(a, function(a, b) {
var e = d(a, b);
(c[e] || (c[e] = [])).push(a);
}), c;
}, v.sortedIndex = function(a, b, c) {
c || (c = v.identity);
for (var d = 0, e = a.length; d < e; ) {
var f = d + e >> 1;
c(a[f]) < c(b) ? d = f + 1 : e = f;
}
return d;
}, v.toArray = function(a) {
return a ? v.isArray(a) || v.isArguments(a) ? g.call(a) : a.toArray && v.isFunction(a.toArray) ? a.toArray() : v.values(a) : [];
}, v.size = function(a) {
return v.isArray(a) ? a.length : v.keys(a).length;
}, v.first = v.head = v.take = function(a, b, c) {
return b != null && !c ? g.call(a, 0, b) : a[0];
}, v.initial = function(a, b, c) {
return g.call(a, 0, a.length - (b == null || c ? 1 : b));
}, v.last = function(a, b, c) {
return b != null && !c ? g.call(a, Math.max(a.length - b, 0)) : a[a.length - 1];
}, v.rest = v.tail = function(a, b, c) {
return g.call(a, b == null || c ? 1 : b);
}, v.compact = function(a) {
return v.filter(a, function(a) {
return !!a;
});
}, v.flatten = function(a, b) {
return v.reduce(a, function(a, c) {
return v.isArray(c) ? a.concat(b ? c : v.flatten(c)) : (a[a.length] = c, a);
}, []);
}, v.without = function(a) {
return v.difference(a, g.call(arguments, 1));
}, v.uniq = v.unique = function(a, b, c) {
var c = c ? v.map(a, c) : a, d = [];
return a.length < 3 && (b = !0), v.reduce(c, function(c, e, f) {
if (b ? v.last(c) !== e || !c.length : !v.include(c, e)) c.push(e), d.push(a[f]);
return c;
}, []), d;
}, v.union = function() {
return v.uniq(v.flatten(arguments, !0));
}, v.intersection = v.intersect = function(a) {
var b = g.call(arguments, 1);
return v.filter(v.uniq(a), function(a) {
return v.every(b, function(b) {
return v.indexOf(b, a) >= 0;
});
});
}, v.difference = function(a) {
var b = v.flatten(g.call(arguments, 1), !0);
return v.filter(a, function(a) {
return !v.include(b, a);
});
}, v.zip = function() {
for (var a = g.call(arguments), b = v.max(v.pluck(a, "length")), c = Array(b), d = 0; d < b; d++) c[d] = v.pluck(a, "" + d);
return c;
}, v.indexOf = function(a, b, c) {
if (a == null) return -1;
var d;
if (c) return c = v.sortedIndex(a, b), a[c] === b ? c : -1;
if (r && a.indexOf === r) return a.indexOf(b);
c = 0;
for (d = a.length; c < d; c++) if (c in a && a[c] === b) return c;
return -1;
}, v.lastIndexOf = function(a, b) {
if (a == null) return -1;
if (s && a.lastIndexOf === s) return a.lastIndexOf(b);
for (var c = a.length; c--; ) if (c in a && a[c] === b) return c;
return -1;
}, v.range = function(a, b, c) {
arguments.length <= 1 && (b = a || 0, a = 0);
for (var c = arguments[2] || 1, d = Math.max(Math.ceil((b - a) / c), 0), e = 0, f = Array(d); e < d; ) f[e++] = a, a += c;
return f;
};
var y = function() {};
v.bind = function(a, b) {
var c, d;
if (a.bind === u && u) return u.apply(a, g.call(arguments, 1));
if (!v.isFunction(a)) throw new TypeError;
return d = g.call(arguments, 2), c = function() {
if (this instanceof c) {
y.prototype = a.prototype;
var e = new y, f = a.apply(e, d.concat(g.call(arguments)));
return Object(f) === f ? f : e;
}
return a.apply(b, d.concat(g.call(arguments)));
};
}, v.bindAll = function(a) {
var b = g.call(arguments, 1);
return b.length == 0 && (b = v.functions(a)), w(b, function(b) {
a[b] = v.bind(a[b], a);
}), a;
}, v.memoize = function(a, b) {
var c = {};
return b || (b = v.identity), function() {
var d = b.apply(this, arguments);
return v.has(c, d) ? c[d] : c[d] = a.apply(this, arguments);
};
}, v.delay = function(a, b) {
var c = g.call(arguments, 2);
return setTimeout(function() {
return a.apply(null, c);
}, b);
}, v.defer = function(a) {
return v.delay.apply(v, [ a, 1 ].concat(g.call(arguments, 1)));
}, v.throttle = function(a, b) {
var c, d, e, f, g, h, i = v.debounce(function() {
g = f = !1;
}, b);
return function() {
return c = this, d = arguments, e || (e = setTimeout(function() {
e = null, g && a.apply(c, d), i();
}, b)), f ? g = !0 : h = a.apply(c, d), i(), f = !0, h;
};
}, v.debounce = function(a, b, c) {
var d;
return function() {
var e = this, f = arguments;
c && !d && a.apply(e, f), clearTimeout(d), d = setTimeout(function() {
d = null, c || a.apply(e, f);
}, b);
};
}, v.once = function(a) {
var b = !1, c;
return function() {
return b ? c : (b = !0, c = a.apply(this, arguments));
};
}, v.wrap = function(a, b) {
return function() {
var c = [ a ].concat(g.call(arguments, 0));
return b.apply(this, c);
};
}, v.compose = function() {
var a = arguments;
return function() {
for (var b = arguments, c = a.length - 1; c >= 0; c--) b = [ a[c].apply(this, b) ];
return b[0];
};
}, v.after = function(a, b) {
return a <= 0 ? b() : function() {
if (--a < 1) return b.apply(this, arguments);
};
}, v.keys = t || function(a) {
if (a !== Object(a)) throw new TypeError("Invalid object");
var b = [], c;
for (c in a) v.has(a, c) && (b[b.length] = c);
return b;
}, v.values = function(a) {
return v.map(a, v.identity);
}, v.functions = v.methods = function(a) {
var b = [], c;
for (c in a) v.isFunction(a[c]) && b.push(c);
return b.sort();
}, v.extend = function(a) {
return w(g.call(arguments, 1), function(b) {
for (var c in b) a[c] = b[c];
}), a;
}, v.pick = function(a) {
var b = {};
return w(v.flatten(g.call(arguments, 1)), function(c) {
c in a && (b[c] = a[c]);
}), b;
}, v.defaults = function(a) {
return w(g.call(arguments, 1), function(b) {
for (var c in b) a[c] == null && (a[c] = b[c]);
}), a;
}, v.clone = function(a) {
return v.isObject(a) ? v.isArray(a) ? a.slice() : v.extend({}, a) : a;
}, v.tap = function(a, b) {
return b(a), a;
}, v.isEqual = function(b, c) {
return a(b, c, []);
}, v.isEmpty = function(a) {
if (a == null) return !0;
if (v.isArray(a) || v.isString(a)) return a.length === 0;
for (var b in a) if (v.has(a, b)) return !1;
return !0;
}, v.isElement = function(a) {
return !!a && a.nodeType == 1;
}, v.isArray = f || function(a) {
return i.call(a) == "[object Array]";
}, v.isObject = function(a) {
return a === Object(a);
}, v.isArguments = function(a) {
return i.call(a) == "[object Arguments]";
}, v.isArguments(arguments) || (v.isArguments = function(a) {
return !!a && !!v.has(a, "callee");
}), v.isFunction = function(a) {
return i.call(a) == "[object Function]";
}, v.isString = function(a) {
return i.call(a) == "[object String]";
}, v.isNumber = function(a) {
return i.call(a) == "[object Number]";
}, v.isFinite = function(a) {
return v.isNumber(a) && isFinite(a);
}, v.isNaN = function(a) {
return a !== a;
}, v.isBoolean = function(a) {
return a === !0 || a === !1 || i.call(a) == "[object Boolean]";
}, v.isDate = function(a) {
return i.call(a) == "[object Date]";
}, v.isRegExp = function(a) {
return i.call(a) == "[object RegExp]";
}, v.isNull = function(a) {
return a === null;
}, v.isUndefined = function(a) {
return a === void 0;
}, v.has = function(a, b) {
return j.call(a, b);
}, v.noConflict = function() {
return b._ = c, this;
}, v.identity = function(a) {
return a;
}, v.times = function(a, b, c) {
for (var d = 0; d < a; d++) b.call(c, d);
}, v.escape = function(a) {
return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;").replace(/\//g, "&#x2F;");
}, v.result = function(a, b) {
if (a == null) return null;
var c = a[b];
return v.isFunction(c) ? c.call(a) : c;
}, v.mixin = function(a) {
w(v.functions(a), function(b) {
I(b, v[b] = a[b]);
});
};
var z = 0;
v.uniqueId = function(a) {
var b = z++;
return a ? a + b : b;
}, v.templateSettings = {
evaluate: /<%([\s\S]+?)%>/g,
interpolate: /<%=([\s\S]+?)%>/g,
escape: /<%-([\s\S]+?)%>/g
};
var A = /.^/, B = {
"\\": "\\",
"'": "'",
r: "\r",
n: "\n",
t: "	",
u2028: "\u2028",
u2029: "\u2029"
}, C;
for (C in B) B[B[C]] = C;
var D = /\\|'|\r|\n|\t|\u2028|\u2029/g, E = /\\(\\|'|r|n|t|u2028|u2029)/g, F = function(a) {
return a.replace(E, function(a, b) {
return B[b];
});
};
v.template = function(a, b, c) {
c = v.defaults(c || {}, v.templateSettings), a = "__p+='" + a.replace(D, function(a) {
return "\\" + B[a];
}).replace(c.escape || A, function(a, b) {
return "'+\n_.escape(" + F(b) + ")+\n'";
}).replace(c.interpolate || A, function(a, b) {
return "'+\n(" + F(b) + ")+\n'";
}).replace(c.evaluate || A, function(a, b) {
return "';\n" + F(b) + "\n;__p+='";
}) + "';\n", c.variable || (a = "with(obj||{}){\n" + a + "}\n");
var a = "var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};\n" + a + "return __p;\n", d = new Function(c.variable || "obj", "_", a);
return b ? d(b, v) : (b = function(a) {
return d.call(this, a, v);
}, b.source = "function(" + (c.variable || "obj") + "){\n" + a + "}", b);
}, v.chain = function(a) {
return v(a).chain();
};
var G = function(a) {
this._wrapped = a;
};
v.prototype = G.prototype;
var H = function(a, b) {
return b ? v(a).chain() : a;
}, I = function(a, b) {
G.prototype[a] = function() {
var a = g.call(arguments);
return h.call(a, this._wrapped), H(b.apply(v, a), this._chain);
};
};
v.mixin(v), w("pop,push,reverse,shift,sort,splice,unshift".split(","), function(a) {
var b = e[a];
G.prototype[a] = function() {
var c = this._wrapped;
b.apply(c, arguments);
var d = c.length;
return (a == "shift" || a == "splice") && d === 0 && delete c[0], H(c, this._chain);
};
}), w([ "concat", "join", "slice" ], function(a) {
var b = e[a];
G.prototype[a] = function() {
return H(b.apply(this._wrapped, arguments), this._chain);
};
}), G.prototype.chain = function() {
return this._chain = !0, this;
}, G.prototype.value = function() {
return this._wrapped;
};
}).call(this);

// vendors/underscore.string.min.js

(function(a) {
var b = String.prototype.trim, c = function(a, b) {
for (var c = []; b > 0; c[--b] = a) ;
return c.join("");
}, d = function(a) {
return function() {
for (var b = Array.prototype.slice.call(arguments), c = 0; c < b.length; c++) b[c] = b[c] == null ? "" : "" + b[c];
return a.apply(null, b);
};
}, e = function() {
function a(a) {
return Object.prototype.toString.call(a).slice(8, -1).toLowerCase();
}
var b = function() {
return b.cache.hasOwnProperty(arguments[0]) || (b.cache[arguments[0]] = b.parse(arguments[0])), b.format.call(null, b.cache[arguments[0]], arguments);
};
return b.format = function(b, d) {
var f = 1, g = b.length, h = "", i = [], j, k, n, o;
for (j = 0; j < g; j++) if (h = a(b[j]), h === "string") i.push(b[j]); else if (h === "array") {
n = b[j];
if (n[2]) {
h = d[f];
for (k = 0; k < n[2].length; k++) {
if (!h.hasOwnProperty(n[2][k])) throw e('[_.sprintf] property "%s" does not exist', n[2][k]);
h = h[n[2][k]];
}
} else h = n[1] ? d[n[1]] : d[f++];
if (/[^s]/.test(n[8]) && a(h) != "number") throw e("[_.sprintf] expecting number but found %s", a(h));
switch (n[8]) {
case "b":
h = h.toString(2);
break;
case "c":
h = String.fromCharCode(h);
break;
case "d":
h = parseInt(h, 10);
break;
case "e":
h = n[7] ? h.toExponential(n[7]) : h.toExponential();
break;
case "f":
h = n[7] ? parseFloat(h).toFixed(n[7]) : parseFloat(h);
break;
case "o":
h = h.toString(8);
break;
case "s":
h = (h = String(h)) && n[7] ? h.substring(0, n[7]) : h;
break;
case "u":
h = Math.abs(h);
break;
case "x":
h = h.toString(16);
break;
case "X":
h = h.toString(16).toUpperCase();
}
h = /[def]/.test(n[8]) && n[3] && h >= 0 ? "+" + h : h, k = n[4] ? n[4] == "0" ? "0" : n[4].charAt(1) : " ", o = n[6] - String(h).length, k = n[6] ? c(k, o) : "", i.push(n[5] ? h + k : k + h);
}
return i.join("");
}, b.cache = {}, b.parse = function(a) {
for (var b = [], c = [], d = 0; a; ) {
if ((b = /^[^\x25]+/.exec(a)) !== null) c.push(b[0]); else if ((b = /^\x25{2}/.exec(a)) !== null) c.push("%"); else {
if ((b = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(a)) === null) throw "[_.sprintf] huh?";
if (b[2]) {
d |= 1;
var e = [], f = b[2], g = [];
if ((g = /^([a-z_][a-z_\d]*)/i.exec(f)) === null) throw "[_.sprintf] huh?";
for (e.push(g[1]); (f = f.substring(g[0].length)) !== ""; ) if ((g = /^\.([a-z_][a-z_\d]*)/i.exec(f)) !== null) e.push(g[1]); else {
if ((g = /^\[(\d+)\]/.exec(f)) === null) throw "[_.sprintf] huh?";
e.push(g[1]);
}
b[2] = e;
} else d |= 2;
if (d === 3) throw "[_.sprintf] mixing positional and named placeholders is not (yet) supported";
c.push(b);
}
a = a.substring(b[0].length);
}
return c;
}, b;
}(), f = {
VERSION: "1.2.0",
isBlank: d(function(a) {
return /^\s*$/.test(a);
}),
stripTags: d(function(a) {
return a.replace(/<\/?[^>]+>/ig, "");
}),
capitalize: d(function(a) {
return a.charAt(0).toUpperCase() + a.substring(1).toLowerCase();
}),
chop: d(function(a, b) {
for (var b = b * 1 || 0 || a.length, c = [], d = 0; d < a.length; ) c.push(a.slice(d, d + b)), d += b;
return c;
}),
clean: d(function(a) {
return f.strip(a.replace(/\s+/g, " "));
}),
count: d(function(a, b) {
for (var c = 0, d, e = 0; e < a.length; ) d = a.indexOf(b, e), d >= 0 && c++, e = e + (d >= 0 ? d : 0) + b.length;
return c;
}),
chars: d(function(a) {
return a.split("");
}),
escapeHTML: d(function(a) {
return a.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}),
unescapeHTML: d(function(a) {
return a.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&");
}),
escapeRegExp: d(function(a) {
return a.replace(/([-.*+?^${}()|[\]\/\\])/g, "\\$1");
}),
insert: d(function(a, b, c) {
return a = a.split(""), a.splice(b * 1 || 0, 0, c), a.join("");
}),
include: d(function(a, b) {
return a.indexOf(b) !== -1;
}),
join: d(function(a) {
var b = Array.prototype.slice.call(arguments);
return b.join(b.shift());
}),
lines: d(function(a) {
return a.split("\n");
}),
reverse: d(function(a) {
return Array.prototype.reverse.apply(String(a).split("")).join("");
}),
splice: d(function(a, b, c, d) {
return a = a.split(""), a.splice(b * 1 || 0, c * 1 || 0, d), a.join("");
}),
startsWith: d(function(a, b) {
return a.length >= b.length && a.substring(0, b.length) === b;
}),
endsWith: d(function(a, b) {
return a.length >= b.length && a.substring(a.length - b.length) === b;
}),
succ: d(function(a) {
var b = a.split("");
return b.splice(a.length - 1, 1, String.fromCharCode(a.charCodeAt(a.length - 1) + 1)), b.join("");
}),
titleize: d(function(a) {
for (var a = a.split(" "), b, c = 0; c < a.length; c++) b = a[c].split(""), typeof b[0] != "undefined" && (b[0] = b[0].toUpperCase()), c + 1 === a.length ? a[c] = b.join("") : a[c] = b.join("") + " ";
return a.join("");
}),
camelize: d(function(a) {
return f.trim(a).replace(/(\-|_|\s)+(.)?/g, function(a, b, c) {
return c ? c.toUpperCase() : "";
});
}),
underscored: function(a) {
return f.trim(a).replace(/([a-z\d])([A-Z]+)/g, "$1_$2").replace(/\-|\s+/g, "_").toLowerCase();
},
dasherize: function(a) {
return f.trim(a).replace(/([a-z\d])([A-Z]+)/g, "$1-$2").replace(/^([A-Z]+)/, "-$1").replace(/\_|\s+/g, "-").toLowerCase();
},
humanize: function(a) {
return f.capitalize(this.underscored(a).replace(/_id$/, "").replace(/_/g, " "));
},
trim: d(function(a, c) {
return !c && b ? b.call(a) : (c = c ? f.escapeRegExp(c) : "\\s", a.replace(RegExp("^[" + c + "]+|[" + c + "]+$", "g"), ""));
}),
ltrim: d(function(a, b) {
return b = b ? f.escapeRegExp(b) : "\\s", a.replace(RegExp("^[" + b + "]+", "g"), "");
}),
rtrim: d(function(a, b) {
return b = b ? f.escapeRegExp(b) : "\\s", a.replace(RegExp("[" + b + "]+$", "g"), "");
}),
truncate: d(function(a, b, c) {
return b = b * 1 || 0, a.length > b ? a.slice(0, b) + (c || "...") : a;
}),
prune: d(function(a, b, c) {
var c = c || "...", b = b * 1 || 0, d = "", d = a.substring(b - 1, b + 1).search(/^\w\w$/) === 0 ? f.rtrim(a.slice(0, b).replace(/([\W][\w]*)$/, "")) : f.rtrim(a.slice(0, b)), d = d.replace(/\W+$/, "");
return d.length + c.length > a.length ? a : d + c;
}),
words: function(a, b) {
return String(a).split(b || " ");
},
pad: d(function(a, b, d, e) {
var f = "", f = 0, b = b * 1 || 0;
d ? d.length > 1 && (d = d.charAt(0)) : d = " ";
switch (e) {
case "right":
f = b - a.length, f = c(d, f), a += f;
break;
case "both":
f = b - a.length, f = {
left: c(d, Math.ceil(f / 2)),
right: c(d, Math.floor(f / 2))
}, a = f.left + a + f.right;
break;
default:
f = b - a.length, f = c(d, f), a = f + a;
}
return a;
}),
lpad: function(a, b, c) {
return f.pad(a, b, c);
},
rpad: function(a, b, c) {
return f.pad(a, b, c, "right");
},
lrpad: function(a, b, c) {
return f.pad(a, b, c, "both");
},
sprintf: e,
vsprintf: function(a, b) {
return b.unshift(a), e.apply(null, b);
},
toNumber: function(a, b) {
var c;
return c = (a * 1 || 0).toFixed(b * 1 || 0) * 1 || 0, c !== 0 || a === "0" || a === 0 ? c : Number.NaN;
},
strRight: d(function(a, b) {
var c = b ? a.indexOf(b) : -1;
return c != -1 ? a.slice(c + b.length, a.length) : a;
}),
strRightBack: d(function(a, b) {
var c = b ? a.lastIndexOf(b) : -1;
return c != -1 ? a.slice(c + b.length, a.length) : a;
}),
strLeft: d(function(a, b) {
var c = b ? a.indexOf(b) : -1;
return c != -1 ? a.slice(0, c) : a;
}),
strLeftBack: d(function(a, b) {
var c = a.lastIndexOf(b);
return c != -1 ? a.slice(0, c) : a;
}),
exports: function() {
var a = {}, b;
for (b in this) this.hasOwnProperty(b) && b != "include" && b != "contains" && b != "reverse" && (a[b] = this[b]);
return a;
}
};
f.strip = f.trim, f.lstrip = f.ltrim, f.rstrip = f.rtrim, f.center = f.lrpad, f.ljust = f.lpad, f.rjust = f.rpad, f.contains = f.include, typeof exports != "undefined" ? (typeof module != "undefined" && module.exports && (module.exports = f), exports._s = f) : typeof a._ != "undefined" ? (a._.string = f, a._.str = a._.string) : a._ = {
string: f,
str: f
};
})(this || window);

// vendors/moment.min.js

(function(a, b) {
function c(a, b) {
this._d = a, this._isUTC = !!b;
}
function d(a) {
return a < 0 ? Math.ceil(a) : Math.floor(a);
}
function e(a) {
var b = this._data = {}, c = a.years || a.y || 0, e = a.months || a.M || 0, f = a.weeks || a.w || 0, g = a.days || a.d || 0, h = a.hours || a.h || 0, i = a.minutes || a.m || 0, j = a.seconds || a.s || 0, k = a.milliseconds || a.ms || 0;
this._milliseconds = k + j * 1e3 + i * 6e4 + h * 36e5, this._days = g + f * 7, this._months = e + c * 12, b.milliseconds = k % 1e3, j += d(k / 1e3), b.seconds = j % 60, i += d(j / 60), b.minutes = i % 60, h += d(i / 60), b.hours = h % 24, g += d(h / 24), g += f * 7, b.days = g % 30, e += d(g / 30), b.months = e % 12, c += d(e / 12), b.years = c;
}
function f(a, b) {
var c = a + "";
while (c.length < b) c = "0" + c;
return c;
}
function g(a, b, c) {
var d = b._milliseconds, e = b._days, f = b._months, g;
d && a._d.setTime(+a + d * c), e && a.date(a.date() + e * c), f && (g = a.date(), a.date(1).month(a.month() + f * c).date(Math.min(g, a.daysInMonth())));
}
function h(a) {
return Object.prototype.toString.call(a) === "[object Array]";
}
function i(b) {
return new a(b[0], b[1] || 0, b[2] || 1, b[3] || 0, b[4] || 0, b[5] || 0, b[6] || 0);
}
function j(b, c) {
function d(c) {
var r, s;
switch (c) {
case "M":
return e + 1;
case "Mo":
return e + 1 + p(e + 1);
case "MM":
return f(e + 1, 2);
case "MMM":
return v.monthsShort[e];
case "MMMM":
return v.months[e];
case "D":
return g;
case "Do":
return g + p(g);
case "DD":
return f(g, 2);
case "DDD":
return r = new a(h, e, g), s = new a(h, 0, 1), ~~((r - s) / 864e5 + 1.5);
case "DDDo":
return r = d("DDD"), r + p(r);
case "DDDD":
return f(d("DDD"), 3);
case "d":
return i;
case "do":
return i + p(i);
case "ddd":
return v.weekdaysShort[i];
case "dddd":
return v.weekdays[i];
case "w":
return r = new a(h, e, g - i + 5), s = new a(r.getFullYear(), 0, 4), ~~((r - s) / 864e5 / 7 + 1.5);
case "wo":
return r = d("w"), r + p(r);
case "ww":
return f(d("w"), 2);
case "YY":
return f(h % 100, 2);
case "YYYY":
return h;
case "a":
return q ? q(k, l, !1) : k > 11 ? "pm" : "am";
case "A":
return q ? q(k, l, !0) : k > 11 ? "PM" : "AM";
case "H":
return k;
case "HH":
return f(k, 2);
case "h":
return k % 12 || 12;
case "hh":
return f(k % 12 || 12, 2);
case "m":
return l;
case "mm":
return f(l, 2);
case "s":
return m;
case "ss":
return f(m, 2);
case "S":
return ~~(n / 100);
case "SS":
return f(~~(n / 10), 2);
case "SSS":
return f(n, 3);
case "Z":
return (o < 0 ? "-" : "+") + f(~~(Math.abs(o) / 60), 2) + ":" + f(~~(Math.abs(o) % 60), 2);
case "ZZ":
return (o < 0 ? "-" : "+") + f(~~(10 * Math.abs(o) / 6), 4);
case "L":
case "LL":
case "LLL":
case "LLLL":
case "LT":
return j(b, v.longDateFormat[c]);
default:
return c.replace(/(^\[)|(\\)|\]$/g, "");
}
}
var e = b.month(), g = b.date(), h = b.year(), i = b.day(), k = b.hours(), l = b.minutes(), m = b.seconds(), n = b.milliseconds(), o = -b.zone(), p = v.ordinal, q = v.meridiem;
return c.replace(E, d);
}
function k(a) {
switch (a) {
case "DDDD":
return I;
case "YYYY":
return J;
case "S":
case "SS":
case "SSS":
case "DDD":
return H;
case "MMM":
case "MMMM":
case "ddd":
case "dddd":
case "a":
case "A":
return K;
case "Z":
case "ZZ":
return L;
case "T":
return M;
case "MM":
case "DD":
case "dd":
case "YY":
case "HH":
case "hh":
case "mm":
case "ss":
case "M":
case "D":
case "d":
case "H":
case "h":
case "m":
case "s":
return G;
default:
return new RegExp(a.replace("\\", ""));
}
}
function l(a, b, c, d) {
var e;
switch (a) {
case "M":
case "MM":
c[1] = b == null ? 0 : ~~b - 1;
break;
case "MMM":
case "MMMM":
for (e = 0; e < 12; e++) if (v.monthsParse[e].test(b)) {
c[1] = e;
break;
}
break;
case "D":
case "DD":
case "DDD":
case "DDDD":
c[2] = ~~b;
break;
case "YY":
b = ~~b, c[0] = b + (b > 70 ? 1900 : 2e3);
break;
case "YYYY":
c[0] = ~~Math.abs(b);
break;
case "a":
case "A":
d.isPm = (b + "").toLowerCase() === "pm";
break;
case "H":
case "HH":
case "h":
case "hh":
c[3] = ~~b;
break;
case "m":
case "mm":
c[4] = ~~b;
break;
case "s":
case "ss":
c[5] = ~~b;
break;
case "S":
case "SS":
case "SSS":
c[6] = ~~(("0." + b) * 1e3);
break;
case "Z":
case "ZZ":
d.isUTC = !0, e = (b + "").match(Q), e && e[1] && (d.tzh = ~~e[1]), e && e[2] && (d.tzm = ~~e[2]), e && e[0] === "+" && (d.tzh = -d.tzh, d.tzm = -d.tzm);
}
}
function m(b, c) {
var d = [ 0, 0, 1, 0, 0, 0, 0 ], e = {
tzh: 0,
tzm: 0
}, f = c.match(E), g, h;
for (g = 0; g < f.length; g++) h = (k(f[g]).exec(b) || [])[0], b = b.replace(k(f[g]), ""), l(f[g], h, d, e);
return e.isPm && d[3] < 12 && (d[3] += 12), e.isPm === !1 && d[3] === 12 && (d[3] = 0), d[3] += e.tzh, d[4] += e.tzm, e.isUTC ? new a(a.UTC.apply({}, d)) : i(d);
}
function n(a, b) {
var c = Math.min(a.length, b.length), d = Math.abs(a.length - b.length), e = 0, f;
for (f = 0; f < c; f++) ~~a[f] !== ~~b[f] && e++;
return e + d;
}
function o(a, b) {
var d, e = a.match(F) || [], f, g = 99, h, i, k;
for (h = 0; h < b.length; h++) i = m(a, b[h]), f = j(new c(i), b[h]).match(F) || [], k = n(e, f), k < g && (g = k, d = i);
return d;
}
function p(b) {
var c = "YYYY-MM-DDT", d;
if (N.exec(b)) {
for (d = 0; d < 4; d++) if (P[d][1].exec(b)) {
c += P[d][0];
break;
}
return L.exec(b) ? m(b, c + " Z") : m(b, c);
}
return new a(b);
}
function q(a, b, c, d) {
var e = v.relativeTime[a];
return typeof e == "function" ? e(b || 1, !!c, a, d) : e.replace(/%d/i, b || 1);
}
function r(a, b) {
var c = x(Math.abs(a) / 1e3), d = x(c / 60), e = x(d / 60), f = x(e / 24), g = x(f / 365), h = c < 45 && [ "s", c ] || d === 1 && [ "m" ] || d < 45 && [ "mm", d ] || e === 1 && [ "h" ] || e < 22 && [ "hh", e ] || f === 1 && [ "d" ] || f <= 25 && [ "dd", f ] || f <= 45 && [ "M" ] || f < 345 && [ "MM", x(f / 30) ] || g === 1 && [ "y" ] || [ "yy", g ];
return h[2] = b, h[3] = a > 0, q.apply({}, h);
}
function s(a, b) {
v.fn[a] = function(a) {
var c = this._isUTC ? "UTC" : "";
return a != null ? (this._d["set" + c + b](a), this) : this._d["get" + c + b]();
};
}
function t(a) {
v.duration.fn[a] = function() {
return this._data[a];
};
}
function u(a, b) {
v.duration.fn["as" + a] = function() {
return +this / b;
};
}
var v, w = "1.6.2", x = Math.round, y, z = {}, A = "en", B = typeof module != "undefined", C = "months|monthsShort|monthsParse|weekdays|weekdaysShort|longDateFormat|calendar|relativeTime|ordinal|meridiem".split("|"), D = /^\/?Date\((\-?\d+)/i, E = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|dddd?|do?|w[o|w]?|YYYY|YY|a|A|hh?|HH?|mm?|ss?|SS?S?|zz?|ZZ?|LT|LL?L?L?)/g, F = /([0-9a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)/gi, G = /\d\d?/, H = /\d{1,3}/, I = /\d{3}/, J = /\d{4}/, K = /[0-9a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+/i, L = /Z|[\+\-]\d\d:?\d\d/i, M = /T/i, N = /^\s*\d{4}-\d\d-\d\d(T(\d\d(:\d\d(:\d\d(\.\d\d?\d?)?)?)?)?([\+\-]\d\d:?\d\d)?)?/, O = "YYYY-MM-DDTHH:mm:ssZ", P = [ [ "HH:mm:ss.S", /T\d\d:\d\d:\d\d\.\d{1,3}/ ], [ "HH:mm:ss", /T\d\d:\d\d:\d\d/ ], [ "HH:mm", /T\d\d:\d\d/ ], [ "HH", /T\d\d/ ] ], Q = /([\+\-]|\d\d)/gi, R = "Month|Date|Hours|Minutes|Seconds|Milliseconds".split("|"), S = {
Milliseconds: 1,
Seconds: 1e3,
Minutes: 6e4,
Hours: 36e5,
Days: 864e5,
Months: 2592e6,
Years: 31536e6
};
v = function(d, e) {
if (d === null || d === "") return null;
var f, g, j;
return v.isMoment(d) ? (f = new a(+d._d), j = d._isUTC) : e ? h(e) ? f = o(d, e) : f = m(d, e) : (g = D.exec(d), f = d === b ? new a : g ? new a(+g[1]) : d instanceof a ? d : h(d) ? i(d) : typeof d == "string" ? p(d) : new a(d)), new c(f, j);
}, v.utc = function(b, d) {
return h(b) ? new c(new a(a.UTC.apply({}, b)), !0) : d && b ? v(b + " +0000", d + " Z").utc() : v(b && !L.exec(b) ? b + "+0000" : b).utc();
}, v.unix = function(a) {
return v(a * 1e3);
}, v.duration = function(a, b) {
var c = v.isDuration(a), d = typeof a == "number", f = c ? a._data : d ? {} : a;
return d && (b ? f[b] = a : f.milliseconds = a), new e(f);
}, v.humanizeDuration = function(a, b, c) {
return v.duration(a, b === !0 ? null : b).humanize(b === !0 ? !0 : c);
}, v.version = w, v.defaultFormat = O, v.lang = function(a, b) {
var c, d, e = [];
if (!a) return A;
if (b) {
for (c = 0; c < 12; c++) e[c] = new RegExp("^" + b.months[c] + "|^" + b.monthsShort[c].replace(".", ""), "i");
b.monthsParse = b.monthsParse || e, z[a] = b;
}
if (z[a]) {
for (c = 0; c < C.length; c++) v[C[c]] = z[a][C[c]] || z.en[C[c]];
A = a;
} else B && (d = require("./lang/" + a), v.lang(a, d));
}, v.lang("en", {
months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
longDateFormat: {
LT: "h:mm A",
L: "MM/DD/YYYY",
LL: "MMMM D YYYY",
LLL: "MMMM D YYYY LT",
LLLL: "dddd, MMMM D YYYY LT"
},
meridiem: !1,
calendar: {
sameDay: "[Today at] LT",
nextDay: "[Tomorrow at] LT",
nextWeek: "dddd [at] LT",
lastDay: "[Yesterday at] LT",
lastWeek: "[last] dddd [at] LT",
sameElse: "L"
},
relativeTime: {
future: "in %s",
past: "%s ago",
s: "a few seconds",
m: "a minute",
mm: "%d minutes",
h: "an hour",
hh: "%d hours",
d: "a day",
dd: "%d days",
M: "a month",
MM: "%d months",
y: "a year",
yy: "%d years"
},
ordinal: function(a) {
var b = a % 10;
return ~~(a % 100 / 10) === 1 ? "th" : b === 1 ? "st" : b === 2 ? "nd" : b === 3 ? "rd" : "th";
}
}), v.isMoment = function(a) {
return a instanceof c;
}, v.isDuration = function(a) {
return a instanceof e;
}, v.fn = c.prototype = {
clone: function() {
return v(this);
},
valueOf: function() {
return +this._d;
},
unix: function() {
return Math.floor(+this._d / 1e3);
},
toString: function() {
return this._d.toString();
},
toDate: function() {
return this._d;
},
utc: function() {
return this._isUTC = !0, this;
},
local: function() {
return this._isUTC = !1, this;
},
format: function(a) {
return j(this, a ? a : v.defaultFormat);
},
add: function(a, b) {
var c = b ? v.duration(+b, a) : v.duration(a);
return g(this, c, 1), this;
},
subtract: function(a, b) {
var c = b ? v.duration(+b, a) : v.duration(a);
return g(this, c, -1), this;
},
diff: function(a, b, c) {
var d = this._isUTC ? v(a).utc() : v(a).local(), e = (this.zone() - d.zone()) * 6e4, f = this._d - d._d - e, g = this.year() - d.year(), h = this.month() - d.month(), i = this.date() - d.date(), j;
return b === "months" ? j = g * 12 + h + i / 30 : b === "years" ? j = g + (h + i / 30) / 12 : j = b === "seconds" ? f / 1e3 : b === "minutes" ? f / 6e4 : b === "hours" ? f / 36e5 : b === "days" ? f / 864e5 : b === "weeks" ? f / 6048e5 : f, c ? j : x(j);
},
from: function(a, b) {
return v.duration(this.diff(a)).humanize(!b);
},
fromNow: function(a) {
return this.from(v(), a);
},
calendar: function() {
var a = this.diff(v().sod(), "days", !0), b = v.calendar, c = b.sameElse, d = a < -6 ? c : a < -1 ? b.lastWeek : a < 0 ? b.lastDay : a < 1 ? b.sameDay : a < 2 ? b.nextDay : a < 7 ? b.nextWeek : c;
return this.format(typeof d == "function" ? d.apply(this) : d);
},
isLeapYear: function() {
var a = this.year();
return a % 4 === 0 && a % 100 !== 0 || a % 400 === 0;
},
isDST: function() {
return this.zone() < v([ this.year() ]).zone() || this.zone() < v([ this.year(), 5 ]).zone();
},
day: function(a) {
var b = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
return a == null ? b : this.add({
d: a - b
});
},
sod: function() {
return v(this).hours(0).minutes(0).seconds(0).milliseconds(0);
},
eod: function() {
return this.sod().add({
d: 1,
ms: -1
});
},
zone: function() {
return this._isUTC ? 0 : this._d.getTimezoneOffset();
},
daysInMonth: function() {
return v(this).month(this.month() + 1).date(0).date();
}
};
for (y = 0; y < R.length; y++) s(R[y].toLowerCase(), R[y]);
s("year", "FullYear"), v.duration.fn = e.prototype = {
weeks: function() {
return d(this.days() / 7);
},
valueOf: function() {
return this._milliseconds + this._days * 864e5 + this._months * 2592e6;
},
humanize: function(a) {
var b = +this, c = v.relativeTime, d = r(b, !a);
return a && (d = (b <= 0 ? c.past : c.future).replace(/%s/i, d)), d;
}
};
for (y in S) S.hasOwnProperty(y) && (u(y, S[y]), t(y.toLowerCase()));
u("Weeks", 6048e5), B && (module.exports = v), typeof window != "undefined" && typeof ender == "undefined" && (window.moment = v), typeof define == "function" && define.amd && define("moment", [], function() {
return v;
});
})(Date);

// vendors/Base64.js

var Base64 = {
_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
encode: function(a) {
var b = "", c, d, e, f, g, h, i, j = 0;
a = Base64._utf8_encode(a);
while (j < a.length) c = a.charCodeAt(j++), d = a.charCodeAt(j++), e = a.charCodeAt(j++), f = c >> 2, g = (c & 3) << 4 | d >> 4, h = (d & 15) << 2 | e >> 6, i = e & 63, isNaN(d) ? h = i = 64 : isNaN(e) && (i = 64), b = b + this._keyStr.charAt(f) + this._keyStr.charAt(g) + this._keyStr.charAt(h) + this._keyStr.charAt(i);
return b;
},
decode: function(a) {
var b = "", c, d, e, f, g, h, i, j = 0;
a = a.replace(/[^A-Za-z0-9\+\/\=]/g, "");
while (j < a.length) f = this._keyStr.indexOf(a.charAt(j++)), g = this._keyStr.indexOf(a.charAt(j++)), h = this._keyStr.indexOf(a.charAt(j++)), i = this._keyStr.indexOf(a.charAt(j++)), c = f << 2 | g >> 4, d = (g & 15) << 4 | h >> 2, e = (h & 3) << 6 | i, b += String.fromCharCode(c), h != 64 && (b += String.fromCharCode(d)), i != 64 && (b += String.fromCharCode(e));
return b = Base64._utf8_decode(b), b;
},
_utf8_encode: function(a) {
a = a.replace(/\r\n/g, "\n");
var b = "";
for (var c = 0; c < a.length; c++) {
var d = a.charCodeAt(c);
d < 128 ? b += String.fromCharCode(d) : d > 127 && d < 2048 ? (b += String.fromCharCode(d >> 6 | 192), b += String.fromCharCode(d & 63 | 128)) : (b += String.fromCharCode(d >> 12 | 224), b += String.fromCharCode(d >> 6 & 63 | 128), b += String.fromCharCode(d & 63 | 128));
}
return b;
},
_utf8_decode: function(a) {
var b = "", c = 0, d = c1 = c2 = 0;
while (c < a.length) d = a.charCodeAt(c), d < 128 ? (b += String.fromCharCode(d), c++) : d > 191 && d < 224 ? (c2 = a.charCodeAt(c + 1), b += String.fromCharCode((d & 31) << 6 | c2 & 63), c += 2) : (c2 = a.charCodeAt(c + 1), c3 = a.charCodeAt(c + 2), b += String.fromCharCode((d & 15) << 12 | (c2 & 63) << 6 | c3 & 63), c += 3);
return b;
}
};

// vendors/minpubsub.js

(function(a) {
var b = a.c_ || {};
a.publish = function(c, f) {
for (var g = b[c], h = g ? g.length : 0; h--; ) g[h].apply(a, f || []);
}, a.subscribe = function(a, c) {
return b[a] || (b[a] = []), b[a].push(c), [ a, c ];
}, a.unsubscribe = function(a) {
for (var c = b[a[0]], a = a[1], d = c ? c.length : 0; d--; ) c[d] === a && c.splice(d, 1);
};
})(this);

// vendors/google-reader/localStorageWrapper.js

function localStorageWrapper(a) {
this.key = a;
}

localStorageWrapper.prototype.get = function() {
if (!localStorage[this.key]) return;
try {
return JSON.parse(localStorage[this.key]);
} catch (a) {
return localStorage[this.key];
}
}, localStorageWrapper.prototype.set = function(a) {
try {
localStorage[this.key] = typeof a == "string" ? a : JSON.stringify(a);
} catch (b) {
console.error("Error Saving to localStorage");
}
}, localStorageWrapper.prototype.del = function() {
delete localStorage[this.key];
};

// vendors/google-reader/google-reader.js

(function() {
"use strict", _.mixin(_.string.exports()), window.reader = {}, reader.TAGS = {
like: "user/-/state/com.google/like",
label: "user/-/label/",
star: "user/-/state/com.google/starred",
read: "user/-/state/com.google/read",
fresh: "user/-/state/com.google/fresh",
share: "user/-/state/com.google/broadcast",
"kept-unread": "user/-/state/com.google/kept-unread",
"reading-list": "user/-/state/com.google/reading-list"
}, reader.has_loaded_prefs = !1;
var a = "Tibfib", b = "https://www.google.com/accounts/ClientLogin", c = "http://www.google.com/reader/api/0/", d = "preference/stream/list", e = "stream/contents/", f = "subscription/", g = "tag/", h = "list", i = "edit", j = "mark-all-as-read", k = "token", l = "user-info", m = "unread-count", n = "rename-tag", o = "edit-tag", p = [], q = new localStorageWrapper("Auth"), r = new localStorageWrapper("User");
reader.setFeeds = function(a) {
p = a;
}, reader.getFeeds = function() {
return p;
}, reader.getLabels = function() {
return _(reader.getFeeds()).select(function(a) {
return a.isLabel;
});
}, reader.getUser = function() {
return r;
};
var s = "", t = [], u = function(b, c) {
function g(a) {
for (e in a) a.hasOwnProperty(e) && (e === "set" ? _.each(a[e], function(a) {
g(a);
}) : d.push(encodeURIComponent(e) + "=" + encodeURIComponent(a[e])));
}
b.method = b.method || "GET", b.parameters = b.parameters || {}, b.method === "GET" && (b.parameters.ck = Date.now() || (new Date).getTime(), b.parameters.accountType = "GOOGLE", b.parameters.service = "reader", b.parameters.output = "json", b.parameters.client = a), s && b.method === "POST" && (b.parameters.T = s);
var d = [], e, f;
g(b.parameters), f = d.join("&");
var h = b.method === "GET" ? b.url + "?" + f : b.url + "?" + encodeURIComponent("client") + "=" + encodeURIComponent(a), i = new XMLHttpRequest;
i.open(b.method, h, !0), i.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), i.setRequestHeader("Cookie", ""), q.get() && !c && i.setRequestHeader("Authorization", "GoogleLogin auth=" + q.get());
var j = t.length;
i.onreadystatechange = function() {
if (i.readyState === 4 && i.status === 200) b.onSuccess && (b.onSuccess(i), t[j] && delete t[j]); else if (i.readyState === 4) {
b.method === "POST" ? b.tried || reader.getToken(function() {
b.tried = !0, u(b), t[j] && delete t[j];
}, b.onFailure) : b.onFailure && (b.onFailure(i), t[j] && delete t[j]);
if (i.status === 401 && i.statusText === "Unauthorized") if (humane) {
var a = humane.create();
a.log(i.statusText + ". " + "Try logging in again.", {
timeout: 2e3,
clickToClose: !1
});
} else console.error("AUTH EXPIRED? TRY LOGGING IN AGAIN");
console.error("Request Failed: " + i);
}
}, i.send(b.method === "POST" ? f : ""), t.push(i);
};
reader.hasAuth = function() {
if (q.get()) return !0;
}, reader.login = function(a, c, d, e) {
if (a.length === 0 || c.length === 0) {
e("Blank Info...");
return;
}
u({
method: "GET",
url: b,
parameters: {
Email: a,
Passwd: c
},
onSuccess: function(a) {
q.set(_.lines(a.responseText)[2].replace("Auth=", "")), v(d, e);
},
onFailure: function(a) {
console.error(a), e(reader.normalizeError(a.responseText));
}
});
}, reader.getToken = function(a, b) {
u({
method: "GET",
url: c + k,
parameters: {},
onSuccess: function(b) {
s = b.responseText, a();
},
onFailure: function(a) {
console.error("failed", a), b && b(reader.normalizeError(a.responseText));
}
});
}, reader.logout = function() {
q.del(), r.del(), reader.setFeeds([]);
};
var v = function(a, b) {
u({
method: "GET",
url: c + l,
parameters: {},
onSuccess: function(b) {
r.set(JSON.parse(b.responseText)), a();
},
onFailure: function(a) {
console.error(a), b && b(reader.normalizeError(a.responseText));
}
});
}, w = function(a, b) {
u({
method: "GET",
url: c + d,
parameters: {},
onSuccess: function(b) {
reader.has_loaded_prefs = !0, reader.userPrefs = JSON.parse(b.responseText).streamprefs, a && a();
},
onFailure: function(a) {
console.error(a), b && b(reader.normalizeError(a.responseText));
}
});
};
reader.loadFeeds = function(a) {
function b() {
u({
method: "GET",
url: c + f + h,
onSuccess: function(b) {
x(function(c) {
z(function(d) {
reader.setFeeds(y(JSON.parse(b.responseText).subscriptions, c, d, reader.userPrefs)), a(reader.getFeeds());
});
});
},
onFailure: function(a) {
console.error(a);
}
});
}
reader.has_loaded_prefs ? b() : w(b);
};
var x = function(a) {
u({
method: "GET",
url: c + g + h,
onSuccess: function(b) {
a(JSON.parse(b.responseText).tags);
},
onFailure: function(a) {
console.error(a);
}
});
}, y = function(a, b, c, d) {
var e = [], f = _(b).reject(function(a) {
return reader.correctId(a.id) === "user/-/state/com.google/broadcast" || reader.correctId(a.id) === "user/-/state/com.blogger/blogger-following";
});
f.unshift({
title: "All",
id: reader.TAGS["reading-list"],
feeds: a,
isAll: !0,
isSpecial: !0
});
var g = /[^\/]+$/i;
_(f).each(function(a) {
a.title = a.title || g.exec(a.id)[0], a.title === "starred" ? (a.title = _(a.title).capitalize(), a.isSpecial = !0) : a.isSpecial || (a.isLabel = !0), a.feeds = [], a.id = reader.correctId(a.id), _(c).each(function(b) {
b.id = reader.correctId(b.id), a.id === b.id && (a.count = b.count, a.newestItemTimestamp = b.newestItemTimestampUsec);
});
}), _(a).each(function(a) {
a.isFeed = !0, a.id = reader.correctId(a.id), _(c).each(function(b) {
a.id === b.id && (a.count = b.count, a.newestItemTimestamp = b.newestItemTimestampUsec);
}), a.categories.length === 0 ? e.push(a) : _(a.categories).each(function(b) {
b.id = reader.correctId(b.id), _(f).each(function(c) {
if (b.id === c.id) {
var d = _(a).clone();
d.inside = c.id, c.feeds.push(d);
}
});
});
}), _(d).each(function(a, b) {
/user\/\d*\//.test(b) && (d[reader.correctId(b)] = a);
});
var h = _(f).reject(function(a) {
return a.feeds.length === 0 && !a.isSpecial;
});
_(h).each(function(a) {
var b = _(d[a.id]).detect(function(a) {
return a.id === "subscription-ordering";
});
b && (a.feeds = _(a.feeds).sortBy(function(a) {
return b.value.indexOf(a.sortid) === -1 ? 1e3 : b.value.indexOf(a.sortid) / 8;
}));
});
var i = _(d["user/-/state/com.google/root"]).detect(function(a) {
return a.id === "subscription-ordering";
}) || {
value: ""
}, j = [].concat(h, e);
return j = _(j).sortBy(function(a) {
return i.value.indexOf(a.sortid) === -1 && !a.isSpecial ? 1e3 : i.value.indexOf(a.sortid) / 8;
}), j;
}, z = function(a, b) {
u({
url: c + m,
onSuccess: function(c) {
var d = JSON.parse(c.responseText).unreadcounts, e = {};
_(d).each(function(a) {
e[reader.correctId(a.id)] = a.count;
}), reader.unreadCountsObj = e, b ? a(e) : a(d);
},
onFailure: function(a) {
console.error(a);
}
});
};
reader.decrementUnreadCount = function(a, b, c) {
_.each(reader.getFeeds(), function(c) {
c.id === a || c.isAll ? c.count -= b || 1 : c.feeds && c.feeds.length > 0 && _.each(c.feeds, function(d) {
d.id === a && (c.count -= b || 1);
});
}), c && c();
};
var A = function(a, b, d) {
if (!a) {
console.error("No params for feed edit");
return;
}
u({
method: "POST",
url: c + f + i,
parameters: a,
onSuccess: function(a) {
b(a.responseText);
},
onFailure: function(a) {
console.error(a), d && d(a);
}
});
};
reader.editFeedTitle = function(a, b, c, d) {
A({
ac: "edit",
t: b,
s: a
}, c, d);
}, reader.editFeedLabel = function(a, b, c, d, e) {
var f = {
ac: "edit",
s: a
};
c ? f.a = b : f.r = b, A(f, d, e);
}, reader.editLabelTitle = function(a, b, d, e) {
u({
method: "POST",
url: c + n,
parameters: {
s: a,
t: a,
dest: reader.TAGS.label + b
},
onSuccess: function(a) {
d(a.responseText);
},
onFailure: function(a) {
console.error(a), e && e();
}
});
}, reader.markAllAsRead = function(a, b) {
u({
method: "POST",
url: c + j,
parameters: {
s: a
},
onSuccess: function(a) {
b(a.responseText);
},
onFailure: function(a) {
console.error(a);
}
});
}, reader.unsubscribeFeed = function(a, b) {
A({
ac: "unsubscribe",
s: a
}, b);
}, reader.subscribeFeed = function(a, b, c) {
A({
ac: "subscribe",
s: "feed/" + a,
t: c || undefined
}, b);
};
var B = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?\^=%&amp;:\/~\+#]*[\w\-\@?\^=%&amp;\/~\+#])?/;
reader.processFeedInput = function(a, b, c, d) {
var e = "https://ajax.googleapis.com/ajax/services/feed/";
!B.test(a) && b !== "url" || b === "keyword" ? (e += "find", a = a.replace(/\.\w{1,3}\.*\w{0,2}$/ig, "")) : e += "load", u({
url: e,
parameters: {
q: encodeURI(a),
v: "1.0"
},
onSuccess: function(a) {
var b = JSON.parse(a.responseText);
b.responseStatus === 200 ? b.responseData.entries ? c(b.responseData.entries, "keyword") : c(b.responseData.feed, "url") : d(b.responseDetails);
},
onFailure: function(a) {
console.error(a);
}
}, !0);
}, reader.getItems = function(a, b, d) {
var f = d || {
n: 50
};
f.r = f.r || "d", u({
method: "GET",
url: c + e + encodeURIComponent(a),
parameters: f,
onSuccess: function(a) {
b(JSON.parse(a.responseText).items);
},
onFailure: function(a) {
console.error(a);
}
});
}, reader.setItemTag = function(a, b, d, e, f, g) {
var h = {
async: "true",
ac: "edit-tags"
};
e === !0 ? h.a = reader.TAGS[d] : h.r = reader.TAGS[d], _.isArray(b) && _.isArray(a) ? (h.set = [], _.each(b, function(b, c) {
h.set.push({
i: b,
s: a[c]
});
})) : (h.s = a, h.i = b), u({
method: "POST",
url: c + o,
parameters: h,
onSuccess: function(a) {
a.responseText === "OK" && f(a.responseText);
},
onFailure: function(a) {
console.error("FAILED", a), g && g();
}
});
};
var C = /user\/\d*\//;
reader.correctId = function(a) {
return a.replace(C, "user/-/");
};
var D = /^true$/i;
reader.isRead = function(a) {
if (a.read !== undefined) return D.test(a.read);
for (var b = 0; b < a.categories.length; b++) if (reader.correctId(a.categories[b]) === reader.TAGS.read) return !0;
return !1;
}, reader.isStarred = function(a) {
if (a.starred !== undefined) return D.test(a.starred);
for (var b = 0; b < a.categories.length; b++) if (reader.correctId(a.categories[b]) === reader.TAGS.star) return !0;
return !1;
}, reader.getIconForFeed = function(a) {
return "http://www.google.com/s2/favicons?domain_url=" + encodeURIComponent(a);
}, reader.normalizeError = function(a) {
var b = _(a).lines()[0].replace("Error=", "").replace(/(\w)([A-Z])/g, "$1 $2");
return b = b === "Bad Authentication" ? "Incorrect Email/Password" : b, b;
};
})();

// js/helpers/utils.js

function logArg(a, b, c) {
console.log("Args", a, b, c);
}

function htmlToText(a) {
return a.replace(/(?:\n|\r\n|\r)/ig, "").replace(/<\s*br[^>]*>/ig, "\n").replace(/<\s*\/li[^>]*>/ig, "\n").replace(/<\s*p[^>]*>/ig, "\n\n").replace(/<\s*script[^>]*>[\s\S]*?<\/script>/mig, "").replace(/<\s*style[^>]*>[\s\S]*?<\/style>/mig, "").replace(/<!--.*?-->/mig, "").replace(/<\s*a[^>]*href=['"](.*?)['"][^>]*>([\s\S]*?)<\/\s*a\s*>/ig, "$2").replace(/(<([^>]+)>)/ig, "").replace(/\n/g, "").replace(/(?:<br\s*\/?>\s*){2,}/gi, "<br/><br/>").replace(/\t/g, "").replace(/^\s*(?:<br\s*\/?>\s*)+/m, "").replace(/ {2,}/g, " ");
}

(function() {
window.AppUtils = {};
var a = 1;
window.devicePixelRatio !== undefined && (a = window.devicePixelRatio), AppUtils.getPixelRatio = function() {
return a;
}, AppUtils.getImagePath = function(a) {
return "assets/" + a;
}, AppUtils.getPlatform = function() {
var a = navigator.appVersion;
return navigator.appVersion.indexOf("iPhone") !== -1 ? "iPhone" : navigator.appVersion.indexOf("iPad") !== -1 ? "iPad" : navigator.appVersion.indexOf("Chrome") !== -1 ? "Chrome" : navigator.appVersion.indexOf("Safari") !== -1 ? "Safari" : "Browser";
};
var b;
AppUtils.testInternetConnection = function(a) {
if (navigator.onLine && navigator.onLine === !0) {
var c = new Image;
c.onload = function() {
b || publish("online"), b = !0, a(!0);
}, c.onerror = function() {
b = !1, a(!1);
}, c.src = "http://www.google.com/s2/favicons?domain_url=" + escape("http://www.google.com") + "&d=" + escape(Date());
} else b = !1, a(!1);
};
var c = humane.create();
AppUtils.wrapWithInternetTest = function(a) {
AppUtils.testInternetConnection(function(b) {
b ? a() : c.log("No Internet Connection...");
});
}, AppUtils.getPos = function(a) {
for (var b = 0, c = 0; a != null; b += a.offsetLeft, c += a.offsetTop, a = a.offsetParent) ;
return {
x: b,
y: c
};
}, AppUtils.stringToBool = function(a) {
return /^true$/i.test(a);
}, AppUtils.buildArticlesArray = function(a) {
var b = [];
return _.each(a, function(a) {
var c = JSON.parse(Base64.decode(a.data));
c.read = a.read, c.starred = a.starred, b.push(c);
}), b;
};
})(), function() {
window.AppPrefs = {}, localStorage.preferences || (localStorage.preferences = "{}");
var a = enyo.mixin({
includeRead: !0,
articleContrast: "Normal",
articleFontSize: "Small",
articleSort: "Recent First",
hideRead: !1,
folderTap: "Shows Feeds"
}, JSON.parse(localStorage.preferences));
AppPrefs.get = function(b) {
return a[b];
}, AppPrefs.set = function(b, c) {
a[b] = c, localStorage.preferences = JSON.stringify(a);
};
}();

// js/helpers/databaseHelper.js

(function() {
function b(a) {
var b = {
id: a.id,
title: a.title,
author: a.author,
url: a.alternate && a.alternate[0] ? a.alternate[0].href : a.origin.htmlUrl || a.origin.streamId,
feed: {
title: a.origin.title,
id: a.origin.streamId
},
updated: a.updated,
content: a.summary ? a.summary.content || "" : a.content ? a.content.content || "" : "",
enclosure: a.enclosure
};
return b.preview = _(htmlToText(b.content)).prune(50), b;
}
function c(c, d) {
if (c.length === 0) {
d();
return;
}
a.transaction(function(a) {
a.executeSql("CREATE TABLE IF NOT EXISTS ARTICLES (id unique, feed, read, starred, data, imgs)");
if (c.length > 1) {
var d = "INSERT INTO ARTICLES SELECT '" + c[0].id + "' AS id, '" + c[0].origin.streamId + "' AS feed, '" + reader.isRead(c[0]) + "' AS read, '" + reader.isStarred(c[0]) + "' AS starred,  '" + Base64.encode(JSON.stringify(b(c[0]))) + "' AS data, '' AS imgs";
for (var e = 1; e < c.length; e++) d += " UNION SELECT '" + c[e].id + "', '" + c[e].origin.streamId + "', '" + reader.isRead(c[e]) + "','" + reader.isStarred(c[e]) + "', '" + Base64.encode(JSON.stringify(b(c[e]))) + "', ''";
} else var d = 'INSERT INTO ARTICLES (id, feed, read, starred, data, imgs) VALUES ("' + c[0].id + '", "' + c[0].origin.streamId + '", "' + reader.isRead(c[0]) + '","' + reader.isStarred(c[0]) + '", "' + Base64.encode(JSON.stringify(b(c[0]))) + '", "")';
a.executeSql(d);
}, function(a) {
console.log("ADD ARTICLES FAILED", a);
}, d);
}
function d(b, c) {
if (b.length === 0) {
c();
return;
}
a.transaction(function(a) {
var c = "DELETE FROM ARTICLES WHERE id IN (";
for (var d = b.length - 1; d >= 0; d--) d !== b.length - 1 && (c += ","), c += "'" + b[d].id + "'";
c += ")", a.executeSql(c);
}, databaseHelper.error, c);
}
function e(a, b) {
var c = [];
return _.each(a, function(a) {
_.find(b, function(b) {
return b.id === a.id;
}) || c.push(a);
}), c;
}
function f(a, b) {
var c = [];
return _.each(a, function(a) {
_.find(b, function(b) {
return b.id === a.id;
}) && c.push(a);
}), c;
}
function g(a, b) {
var c = " (";
for (var d = 0; d < b.length; d++) d > 0 && (c += " OR"), c += " " + a + " = '" + b[d] + "'";
return c + ")";
}
window.databaseHelper = {};
var a;
databaseHelper.loadDb = function() {
a = window.openDatabase("nomnomnomXP_db", "1.0", "NomNomNomXP Database", 2e6), a.transaction(function(a) {
a.executeSql("CREATE TABLE IF NOT EXISTS ARTICLES (id unique, feed, read, starred, data, imgs)"), a.executeSql("CREATE TABLE IF NOT EXISTS SUBS (data)"), a.executeSql("CREATE TABLE IF NOT EXISTS QUEUE (id INTEGER PRIMARY KEY, data)");
}, databaseHelper.error, databaseHelper.success);
}, databaseHelper.dumpData = function() {
a.transaction(function(a) {
a.executeSql("DROP TABLE IF EXISTS ARTICLES"), a.executeSql("CREATE TABLE IF NOT EXISTS ARTICLES (id unique, feed, read, starred, data, imgs)"), a.executeSql("DROP TABLE IF EXISTS SUBS"), a.executeSql("CREATE TABLE IF NOT EXISTS SUBS (data)"), a.executeSql("DROP TABLE IF EXISTS QUEUE"), a.executeSql("CREATE TABLE IF NOT EXISTS QUEUE (id INTEGER PRIMARY KEY, data)");
}, databaseHelper.error, databaseHelper.success);
}, databaseHelper.saveSubs = function(b) {
var c = Base64.encode(JSON.stringify(b));
a.transaction(function(a) {
a.executeSql("CREATE TABLE IF NOT EXISTS SUBS (data)"), a.executeSql("DELETE FROM SUBS"), a.executeSql("INSERT INTO SUBS (data) VALUES ('" + c + "')");
}, databaseHelper.error, databaseHelper.success);
}, databaseHelper.loadSubs = function(b) {
function c(a, c) {
if (c.rows.length > 0) var d = JSON.parse(Base64.decode(c.rows.item(0).data));
b(d || []);
}
a.transaction(function(a) {
a.executeSql("SELECT * FROM SUBS", [], c, databaseHelper.error);
}, databaseHelper.error);
}, databaseHelper.saveArticles = function(a, b) {
databaseHelper.loadArticles(null, function(g) {
var h = [], i = [], j = [], k = a.unread, l = a.read, m = a.starred;
_.each(g, function(a) {
reader.isStarred(a) ? j.push(a) : reader.isRead(a) ? i.push(a) : h.push(a);
});
var n = [].concat(e(m, j)), o = [].concat(e(j, m), f(m, h), f(m, i), f(m, l), f(m, k));
console.log("starredToRemove", o);
var p, q;
p = [].concat(e(k, h), e(l, i), n), q = [].concat(e(h, k), e(i, l), o), console.log("removing these from the db", q.length), d(q, function() {
console.log("adding these to the db", p.length), c(p, b);
});
});
}, databaseHelper.loadArticles = function(b, c) {
function d(a, b) {
var d = [];
for (var e = 0; e < b.rows.length; e++) d.push(b.rows.item(e));
c(d);
}
a.transaction(function(a) {
var c = "SELECT * FROM ARTICLES";
if (b && !_.isEmpty(b)) {
c += " WHERE";
var e = _.keys(b), f = _.values(b);
for (var h = e.length - 1; h >= 0; h--) h !== e.length - 1 && (c += " AND"), _.isArray(f[h]) ? c += g(e[h], f[h]) : c += " " + e[h] + " = '" + f[h] + "'";
}
a.executeSql(c, [], d, databaseHelper.error);
}, databaseHelper.error);
}, databaseHelper.markArticlesRead = function(b, c) {
a.transaction(function(a) {
var c = "UPDATE ARTICLES SET read = 'true' WHERE", d = [];
_(b).each(function(a) {
d.push(a.id);
}), c += g("id", d), console.log(c), a.executeSql(c);
}, databaseHelper.error, c);
}, databaseHelper.markArticleStarred = function(b, c) {
a.transaction(function(a) {
var c = "UPDATE ARTICLES SET starred = '" + b.starred + "' WHERE id = '" + b.id + "'";
console.log(c), a.executeSql(c);
}, databaseHelper.error, c);
}, databaseHelper.queue = function(b) {
var c = Base64.encode(JSON.stringify(b));
a.transaction(function(a) {
a.executeSql("CREATE TABLE IF NOT EXISTS QUEUE (id INTEGER PRIMARY KEY, data)"), a.executeSql('INSERT INTO QUEUE (id, data) VALUES (null, "' + c + '")');
}, databaseHelper.error, databaseHelper.success);
}, databaseHelper.getQueue = function(b) {
function c(a, c) {
var d = [];
for (var e = 0; e < c.rows.length; e++) d.push(c.rows.item(e));
b(d);
}
a.transaction(function(a) {
var b = "SELECT * FROM QUEUE";
a.executeSql(b, [], c, databaseHelper.error);
}, databaseHelper.error);
}, databaseHelper.clearFromQueue = function(b, c) {
a.transaction(function(a) {
var d = "DELETE FROM QUEUE WHERE id = " + b;
a.executeSql(d, [], c, databaseHelper.error);
}, databaseHelper.error);
}, databaseHelper.test = function() {
var b = [];
b.push({
id: "asbasbsdbasb0",
feed: Math.random() * 2 > 1 ? "dog" : "cat",
read: !1
}), b.push({
id: "asbasbsdbasb1",
feed: Math.random() * 2 > 1 ? "dog" : "cat",
read: !1
}), a.transaction(function(a) {
a.executeSql("CREATE TABLE IF NOT EXISTS ARTICLES (id unique, feed, read, data, imgs)");
var c = "DELETE FROM ARTICLES WHERE id IN (";
for (var d = b.length - 1; d >= 0; d--) d !== b.length - 1 && (c += ","), c += "'" + b[d].id + "'";
c += ")", console.log(c), a.executeSql(c);
}, databaseHelper.error, function() {
console.log("successfully deleted some articles."), databaseHelper.loadArticles({
id: [ "asbasbsdbasb0", "asbasbsdbasb1" ]
}, function(a) {
console.log("ARTICLES LOADED", a);
});
});
}, databaseHelper.error = function(a, b) {
console.error("ERROR", b, a);
}, databaseHelper.success = function() {
console.log("SQL Success");
};
})();

// js/helpers/background.js

reader.background = {}, reader.background.markRead = function(a, b) {
function c() {
databaseHelper.markArticlesRead([ a ], function() {
reader.decrementUnreadCount(a.feed.id, 1), databaseHelper.saveSubs(reader.getFeeds()), b && b();
});
}
AppUtils.testInternetConnection(function(b) {
b ? reader.setItemTag(a.feed.id, a.id, "read", a.read, function() {
c();
}) : (console.log("QUEUED"), databaseHelper.queue({
action: "markRead",
data: a
}), c());
});
}, reader.background.markStarred = function(a, b) {
function c() {
databaseHelper.markArticleStarred(a, function() {
b && b();
});
}
AppUtils.testInternetConnection(function(b) {
b ? reader.setItemTag(a.feed.id, a.id, "star", a.starred, function() {
c();
}) : (console.log("QUEUED"), databaseHelper.queue({
action: "markStarred",
data: a
}), c());
});
}, reader.background.markAllRead = function(a, b, c) {
function d() {
databaseHelper.markArticlesRead(b, enyo.bind(this, function() {
console.log("read articles saved methinks"), _.each(b, function(a) {
reader.decrementUnreadCount(a.feed.id, 1);
}), databaseHelper.saveSubs(reader.getFeeds()), c && c();
}));
}
AppUtils.testInternetConnection(function(c) {
c ? reader.markAllAsRead(a.id, enyo.bind(this, function() {
d();
})) : (console.log("QUEUED"), databaseHelper.queue({
action: "markAllRead",
data: b
}), d());
});
}, reader.background.editFeedLabel = function(a, b, c, d) {
function e() {
if (c) {
var e, f, g = reader.getFeeds();
_.each(g, function(a, c) {
a.id === b && (f = c);
});
if (!f) {
var h = {
id: b,
count: 0,
feeds: [],
isLabel: !0,
title: b.replace(reader.TAGS.label, "")
};
for (var i = 0; i < g.length; i++) if (g[i].isLabel && b < g[i].id) {
g.splice(i, 0, h), f = i;
break;
}
f || (g.splice(2, 0, h), f = 2);
}
var j = _(g[f]).clone();
delete j.feeds;
for (var i = g.length - 1; i >= 0; i--) {
if (g[i].id === a) {
e = g.splice(i, 1)[0], e.categories.push(j);
break;
}
g[i].isLabel && _.each(g[i].feeds, function(b) {
b.id === a && (e = b, e.categories.push(j));
});
}
console.log(g[f]), g[f].feeds.push(e), g[f].count = (parseInt(g[f].count) || 0) + e.count;
} else {
var e, g = reader.getFeeds(), f;
_.each(g, function(a, c) {
a.id === b && (f = c);
});
if (g[f].feeds.length === 1) e = g[f].feeds.splice(0, 1)[0], g.splice(f, 1); else for (var i = g[f].feeds.length - 1; i >= 0; i--) if (g[f].feeds[i].id === a) {
e = g[f].feeds.splice(i, 1)[0], g[f].count = (parseInt(g[f].count) || 0) - e.count;
break;
}
for (var i = e.categories.length - 1; i >= 0; i--) if (e.categories[i].id === b) {
e.categories.splice(i, 1);
break;
}
var k = !1;
_.each(g, function(a) {
a.isLabel && _.each(a.feeds, function(a) {
a.id === e.id && (k = !0);
});
}), k || g.push(e);
}
console.log("feeds", g), databaseHelper.saveSubs(g), d();
}
AppUtils.testInternetConnection(function(d) {
d ? (e(), reader.editFeedLabel(a, b, c, function() {
console.log("EDITED FEED LABEL");
})) : (console.log("QUEUED"), e(), databaseHelper.queue({
action: "editFeedLabel",
data: {
feedId: a,
labelId: b,
opt: c
}
}));
});
}, reader.background.editFeedTitle = function(a, b, c) {
function d() {
var d, e = reader.getFeeds();
for (var f = e.length - 1; f >= 0; f--) {
if (e[f].id === a) {
d = e[f];
break;
}
e[f].isLabel && _.each(e[f].feeds, function(b) {
b.id === a && (d = b);
});
}
d.title = b, databaseHelper.saveSubs(e), c && c();
}
d(), AppUtils.testInternetConnection(function(c) {
c ? reader.editFeedTitle(a, b, function() {}) : (console.log("QUEUED"), databaseHelper.queue({
action: "editFeedTitle",
data: {
feedId: a,
newTitle: b
}
}));
});
}, reader.background.editLabelTitle = function(a, b, c) {
function d() {
var d, e = reader.getFeeds();
for (var f = e.length - 1; f >= 0; f--) e[f].isLabel && (e[f].id === a && (d = e[f]), _.each(e[f].feeds, function(c) {
_.each(c.categories, function(c) {
c.id === a && (c.label = b, c.id = reader.TAGS.label + b);
});
}));
d.title = b, d.id = reader.TAGS.label + b, databaseHelper.saveSubs(e), c && c();
}
d(), AppUtils.testInternetConnection(function(c) {
c ? reader.editLabelTitle(a, b, function() {}) : (console.log("QUEUED"), databaseHelper.queue({
action: "editLabelTitle",
data: {
labelId: a,
newTitle: b
}
}));
});
}, reader.background.unsubscribeFeed = function(a, b) {
function c() {
var c, d = reader.getFeeds();
for (var e = d.length - 1; e >= 0; e--) {
if (d[e].id === a) {
c = d.splice(e, 1)[0];
break;
}
if (d[e].isLabel) for (var f = d[e].feeds.length - 1; f >= 0; f--) if (d[e].feeds[f].id === a) {
d[e].count && (d[e].count -= d[e].feeds[f].count), c = d[e].feeds.splice(f, 1)[0];
break;
}
}
d[0].count && (d[0].count -= c.count), databaseHelper.saveSubs(d), b && b();
}
c(), AppUtils.testInternetConnection(function(b) {
b ? reader.unsubscribeFeed(a, function() {}) : (console.log("QUEUED"), databaseHelper.queue({
action: "unsubscribeFeed",
data: a
}));
});
};

// js/loginPage.js

enyo.kind({
name: "loginPage",
fit: !0,
handlers: {
onLogin: ""
},
components: [ {
classes: "fixedWidthList",
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
ontap: "attemptLogin",
classes: "full"
} ]
}, {
name: "popup",
kind: "onyx.Popup",
classes: "loginPopup",
centered: !0,
modal: !0,
floating: !0,
components: [ {
name: "popupText",
classes: "popupText",
content: "Logged in successfully! Would you like to view the tour? We highly recommend it."
}, {
kind: "onyx.Button",
content: "Yes!",
style: "width: 68%; margin-right: 8px;",
ontap: "showFeeds",
name: "showTour"
}, {
kind: "onyx.Button",
classes: "onyx-negative",
style: "width: 30%",
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
this.$.errorMessage.setContent(""), AppUtils.testInternetConnection(enyo.bind(this, function(a) {
a ? reader.login(this.$.username.getValue(), this.$.password.getValue(), enyo.bind(this, function() {
console.log("succes 1"), reader.getToken(enyo.bind(this, function() {
console.log("succes 2"), this.loggedIn();
}), enyo.bind(this, this.errorLogin));
}), enyo.bind(this, this.errorLogin)) : this.$.errorMessage.setContent("No Internet Connection...");
}));
},
loggedIn: function() {
this.$.popup.show(), this.$.popup.resized();
},
errorLogin: function(a) {
console.log("ERROR", a), this.$.errorMessage.setContent(a);
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
horizontal: "hidden",
classes: "grid",
components: [ {
name: "grid",
kind: enyo.Repeater,
fit: !0,
count: 0,
onSetupItem: "setupGridItem",
components: [ {
kind: "gridItem",
ontap: "loadGridItem",
onLoadFeed: "loadFeedItem"
} ]
} ]
}, {
name: "normalToolbar",
kind: "onyx.Toolbar",
classes: "onyx-toolbar-inline",
components: [ {
name: "titleBar",
content: "NomNomNomXP",
classes: "titleBarText truncating-text"
}, {
kind: "onyx.IconButton",
classes: "floatRight",
src: AppUtils.getImagePath("menu-icon-settings.png"),
ontap: "bubbleEvent",
eventToBubble: "onShowSettingsPage"
}, {
kind: "onyx.IconButton",
classes: "floatRight",
src: AppUtils.getImagePath("menu-icon-edit-outline.png"),
ontap: "enterEditMode"
}, {
kind: "onyx.IconButton",
classes: "floatRight",
src: AppUtils.getImagePath("menu-icon-refresh.png"),
ontap: "loadFeedsFromOnline"
}, {
kind: "onyx.IconButton",
classes: "floatRight",
src: AppUtils.getImagePath("menu-icon-new.png"),
ontap: "bubbleEvent",
eventToBubble: "onShowAddFeedPage"
} ]
}, {
name: "editToolbar",
kind: "onyx.Toolbar",
showing: !1,
classes: "onyx-toolbar-inline",
components: [ {
content: "Edit Mode",
classes: "titleBarText truncating-text"
}, {
kind: "onyx.Button",
content: "Exit",
classes: "floatRight",
ontap: "exitEditMode"
}, {
name: "editPopup",
kind: "editPopup"
} ]
} ],
create: function() {
this.inherited(arguments), subscribe("refreshGrid", enyo.bind(this, function(a) {
this.loadGrid();
}));
},
rendered: function() {
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
loadGridFromOnline: function() {
console.log("LOADING GRIDS FROM ONLINE"), AppUtils.wrapWithInternetTest(enyo.bind(this, function() {
reader.loadFeeds(enyo.bind(this, function(a) {
_.isEqual(a, this.gridItems) ? console.log("Subs are the same") : (databaseHelper.saveSubs(a), this.buildGrid(a));
}));
}));
},
loadGrid: function() {
databaseHelper.loadSubs(enyo.bind(this, function(a) {
console.log("SUBS LOADED FROM DB"), this.buildGrid(a);
}));
},
buildGrid: function(a, b) {
this.gridItems = AppPrefs.get("hideRead") && !this.inEditMode ? _.reject(a, function(a) {
return !a.count && !a.isSpecial;
}) : a, reader.getFeeds().length === 0 && reader.setFeeds(a), this.$.grid.setCount(this.gridItems.length), (!b || !b.noWaterfall) && this.$.grid.waterfallDown("onChangeOpacity", {
inEditMode: b && b.waterfallOpposite ? !this.inEditMode : this.inEditMode,
noTransition: !0
});
},
loadFeedsFromOnline: function() {
AppUtils.wrapWithInternetTest(enyo.bind(this, function() {
humane.log("Loading Subscriptions...", {
timeout: 5e4
}), reader.loadFeeds(enyo.bind(this, function(a) {
humane.remove(), humane.log("Loading Articles...", {
timeout: 5e6
}), reader.getItems(a[0].id, enyo.bind(this, function(b) {
reader.getItems(reader.TAGS.read, enyo.bind(this, function(c) {
reader.getItems(reader.TAGS.star, enyo.bind(this, function(d) {
databaseHelper.saveArticles({
unread: b,
read: c,
starred: d
}, enyo.bind(this, function() {
humane.remove(), _.isEqual(a, this.gridItems) ? console.log("Subs are the same") : (databaseHelper.saveSubs(a), this.buildGrid(a));
}));
}), undefined);
}), {
n: 50,
ot: moment().subtract("days", 10).unix(),
xt: reader.TAGS.star
});
}), {
n: a[0].count,
xt: reader.TAGS.read
});
}));
}));
},
setupGridItem: function(a, b) {
if (this.gridItems[b.index]) return b.item.$.gridItem.setItem(this.gridItems[b.index]), !0;
},
loadGridItem: function(a, b) {
console.log("loading this sub", a.getItem());
var c = {};
!a.getItem().isLabel || AppPrefs.get("folderTap") === "Show Articles" && !this.inEditMode || a.getItem().forceArticles ? (a.getItem().isFeed ? c.feed = a.getItem().id : a.getItem().isLabel ? (c.feed = [], _.each(a.getItem().feeds, function(a) {
c.feed.push(a.id);
})) : a.getItem().isAll || a.getItem().isSpecial && !a.getItem().isAll && (c.starred = !0), this.inEditMode === !1 ? databaseHelper.loadArticles(c, enyo.bind(this, function(b) {
if (b.length === 0) {
humane.log("No Articles to Show", {
timeout: 1500
});
return;
}
b.length < a.getItem().count ? (console.log("Uh oh, cache failed", b), AppUtils.wrapWithInternetTest(enyo.bind(this, function() {
reader.getItems(a.getItem().id, enyo.bind(this, function(b) {
this.bubble("onViewArticles", {
articles: b,
sub: a.getItem()
});
}), {
n: a.getItem().count,
xt: reader.TAGS.read
});
}))) : (console.log("Articles loaded from cache", b.length), this.bubble("onViewArticles", {
sub: a.getItem(),
articles: AppUtils.buildArticlesArray(b)
}));
})) : a.getItem().isSpecial || (console.log("EDIT THIS FEEDDDDD"), this.$.editPopup.showEditOptions(a.getItem()))) : a.openFolder();
},
loadFeedItem: function(a, b) {
this.loadGridItem({
getItem: function() {
return b;
}
});
},
inEditMode: !1,
enterEditMode: function() {
this.inEditMode = !0, this.buildGrid(reader.getFeeds(), {
noWaterfall: !0
}), this.$.grid.waterfallDown("onChangeOpacity", {
inEditMode: this.inEditMode
}), this.$.normalToolbar.hide(), this.$.editToolbar.show();
},
exitEditMode: function() {
this.inEditMode = !1, this.buildGrid(reader.getFeeds(), {
waterfallOpposite: !0
}), setTimeout(enyo.bind(this, function() {
this.$.grid.waterfallDown("onChangeOpacity", {
inEditMode: this.inEditMode
});
}), 0), this.$.editToolbar.hide(), this.$.normalToolbar.show();
}
}), enyo.kind({
name: "gridItem",
kind: "Control",
classes: "grid-item",
published: {
item: {},
disabled: !1
},
handlers: {
onLoadFeed: "",
onChangeOpacity: "changeOpacity"
},
components: [ {
kind: "enyo.Image",
src: ""
}, {
kind: "enyo.Control",
classes: "title",
allowHtml: !0
}, {
name: "icon",
kind: "Image",
classes: "icon"
}, {
name: "unread",
classes: "unread",
allowHtml: !0
}, {
kind: "onyx.MenuDecorator",
style: "",
components: [ {
kind: "onyx.Menu",
name: "menu",
modal: !1,
classes: "folderMenu",
style: "",
components: []
} ]
} ],
itemChanged: function(a, b) {
var c;
if (this.getItem().isAll) c = "all"; else if (this.getItem().isSpecial) c = this.getItem().title.toLowerCase(); else if (this.getItem().isLabel) {
c = "folder";
var d = [];
if (this.getItem().feeds.length > 0) {
var e = _(this.getItem()).clone();
e.content = "All Articles", e.ontap = "loadGridItem", e.forceArticles = !0, e.name = "allAtriclesItem", d.push(e);
}
_.each(this.getItem().feeds, function(a) {
var b = _(a).clone();
b.ontap = "loadGridItem", b.components = [ {
kind: enyo.Image,
classes: "folderFeedIcon floatLeft abs",
src: reader.getIconForFeed(a.id.replace(/feed\//, ""))
}, {
content: a.count ? "(" + a.count + ")" : "",
classes: "folderFeedTitle unreadCount floatRight"
}, {
content: a.title,
classes: "folderFeedTitle"
} ], d.push(b);
}), this.$.menu.destroyComponents(), this.$.menu.createComponents(d, {
owner: this
}), this.render();
} else c = "feed", this.$.icon.setSrc(reader.getIconForFeed(this.getItem().id.replace(/feed\//, "")));
this.$.image.setSrc(AppUtils.getImagePath("grid-icon-" + c + ".png")), this.$.control.setContent(this.getItem().title), this.getItem().count ? this.$.unread.setContent(this.getItem().count >= 1e3 ? "1000+" : this.getItem().count) : this.$.unread.setContent("&nbsp;");
},
changeOpacity: function(a, b) {
this.addRemoveClass("opacity-transition", !b.noTransition), this.applyStyle("opacity", b.inEditMode && this.getItem().isSpecial ? .3 : 1), setTimeout(enyo.bind(this, function() {
this.applyStyle("opacity", b.inEditMode && this.getItem().isSpecial ? .3 : 1);
}), 0);
},
openFolder: function() {
this.$.allAtriclesItem && this.$.allAtriclesItem.setContent(this.owner.owner.owner.inEditMode ? "Edit Folder" : "View All Articles"), this.$.menu.requestMenuShow();
if (this.$.menu.hasNode()) {
this.$.menu.applyStyle("left", null), this.$.menu.applyStyle("right", null);
var a = AppUtils.getPos(this.$.menu.node);
a.x < 0 ? this.$.menu.applyStyle("left", "0px") : window.innerWidth - a.x < 200 && this.$.menu.applyStyle("right", "110px");
}
},
loadGridItem: function(a, b) {
return this.$.menu.hide(), this.bubble("onLoadFeed", a), !0;
}
}), enyo.kind({
name: "editPopup",
kind: "onyx.Popup",
classes: "editPopup",
centered: !0,
floating: !0,
components: [ {
content: "Edit",
classes: "popupTitle"
}, {
kind: "onyx.InputDecorator",
layoutKind: "FittableColumnsLayout",
classes: "editPopupInputDecorator",
onblur: "inputBlur",
components: [ {
content: "Name: ",
classes: "floatLeft padRight inputPrompt"
}, {
name: "title",
kind: "onyx.Input",
fit: !0
} ]
}, {
name: "labelsList",
kind: "onyx.Groupbox"
}, {
name: "unsubscribeButton",
kind: "onyx.Button",
classes: "onyx-negative full",
content: "Unsubscribe",
ontap: "unsubscribe"
} ],
showEditOptions: function(a) {
var b = [];
this.$.title.setValue(a.title);
if (a.isLabel) this.$.unsubscribeButton.hide(), this.$.labelsList.hide(); else if (a.isFeed) {
this.$.unsubscribeButton.show(), this.$.labelsList.show();
var c = [ {
kind: "onyx.GroupboxHeader",
content: "Labels"
} ];
_.each(reader.getLabels(), function(b) {
var d = !!_.find(a.categories, function(a) {
return a.id === b.id;
});
console.log("hasLabel", d), c.push({
classes: "groupItem",
components: [ {
name: b.id + "Check",
labelId: b.id,
feedId: a.id,
kind: "onyx.Checkbox",
classes: "floatRight",
checked: d,
onchange: "toggleLabel"
}, {
content: b.title,
id: b.id
} ]
});
}), c.push({
kind: "onyx.InputDecorator",
components: [ {
kind: "onyx.IconButton",
src: AppUtils.getImagePath("menu-icon-new.png"),
ontap: "addLabel",
classes: "floatRight"
}, {
name: "newLabelInput",
placeholder: "New Label...",
kind: "onyx.Input"
} ]
}), this.$.labelsList.destroyClientControls(), this.$.labelsList.createComponents(c, {
owner: this
}), this.$.labelsList.render();
}
this.sub = a, this.unsubscribed = !1, this.show(), onyx.scrim.show();
},
unsubscribed: !1,
hide: function() {
this.inherited(arguments), this.updateTitle(function() {
publish("refreshGrid"), onyx.scrim.hide();
});
},
toggleLabel: function(a, b) {
reader.background.editFeedLabel(a.feedId, a.labelId, a.checked, function() {
console.log("success suckers");
}), console.log("CHECKED", a.checked);
},
inputBlur: function() {
this.$.title.getValue().length === 0 && this.$.title.setValue(this.sub.title);
},
updateTitle: function(a) {
!this.unsubscribed && this.$.title.getValue().length > 0 && this.$.title.getValue() !== this.sub.title ? reader.background[this.sub.isLabel ? "editLabelTitle" : "editFeedTitle"](this.sub.id, this.$.title.getValue(), function() {
console.log("success suckers"), a();
}) : a();
},
addLabel: function(a, b) {
this.$.newLabelInput.getValue().length > 0 && reader.background.editFeedLabel(this.sub.id, reader.TAGS.label + this.$.newLabelInput.getValue(), !0, enyo.bind(this, function() {
console.log("success suckers"), this.showEditOptions(this.sub);
}));
},
unsubscribe: function() {
reader.background.unsubscribeFeed(this.sub.id, enyo.bind(this, function() {
this.unsubscribed = !0, this.hide();
}));
}
});

// js/articlePage.js

enyo.kind({
name: "articlePage",
fit: !0,
handlers: {
onShowGridPage: "",
onViewArticle: ""
},
components: [ {
kind: "onyx.Toolbar",
classes: "onyx-toolbar-inline",
components: [ {
kind: "onyx.IconButton",
src: AppUtils.getImagePath("menu-icon-home.png"),
ontap: "bubbleEvent",
eventToBubble: "onShowGridPage",
opts: {
refresh: !0
},
classes: "abs",
style: "left: 10px; margin: auto;"
}, {
name: "subTitle",
content: "",
classes: "subTitle center",
style: "text-align: center"
} ]
}, {
kind: "ArticlePanel",
classes: "enyo-fit",
onSetupItem: "setupItem"
} ],
create: function() {
this.inherited(arguments);
},
showingChanged: function(a) {
this.inherited(arguments), this.getShowing() && a !== undefined && (this.activate(), this.resized());
},
resized: function() {
this.inherited(arguments), this.$.articlePanel.resized();
},
activate: function() {
this.$.articlePanel.refreshSettings(), this.$.articlePanel.clearCurrentArticle();
},
bubbleEvent: function(a, b) {
this.bubble(a.eventToBubble, a.opts);
},
articles: [],
loadArticles: function(a, b) {
console.log("LOAD DEM ARTICLES"), this.$.subTitle.setContent(a.title), this.$.articlePanel.loadArticles(a, b);
}
}), enyo.kind({
name: "ArticlePanel",
kind: "Panels",
fit: !0,
classes: "articlePanel enyo-unselectable",
arrangerKind: "CarouselArranger",
handlers: {
onSetupItem: ""
},
components: [ {
name: "left",
classes: "articleList",
layoutKind: "FittableRowsLayout",
components: [ {
name: "list",
kind: "List",
count: 0,
multiSelect: !1,
fit: !0,
classes: "list",
onSetupItem: "setupItem",
components: [ {
name: "divider",
classes: "divider"
}, {
name: "item",
classes: "item enyo-border-box",
ontap: "viewArticle",
components: [ {
name: "articleTime",
classes: "articleTime"
}, {
name: "unreadIndicator",
fit: !0,
classes: "unreadIndicator"
}, {
name: "articleTitle",
classes: "articleTitle",
allowHtml: !0
}, {
name: "articleSubtitle",
classes: "articleSubtitle",
allowHtml: !0
} ]
} ]
}, {
kind: "onyx.Toolbar",
classes: "onyx-toolbar-inline",
components: [ {
kind: "onyx.IconButton",
src: AppUtils.getImagePath("menu-icon-mark-read.png"),
ontap: "markAllRead"
}, {
name: "includeReadButton",
kind: "onyx.Button",
content: "Include Read",
ontap: "toggleIncludeUnread",
classes: "abs",
style: "right: 10px;"
} ]
} ]
}, {
name: "body",
Xfit: !0,
style: "Xwidth: 100%;",
layoutKind: "FittableRowsLayout",
classes: "articleView",
components: [ {
kind: "enyo.Scroller",
fit: !0,
components: [ {
name: "articleViewTime",
allowHtml: !0,
classes: "articleTime"
}, {
name: "articleViewTitle",
allowHtml: !0,
classes: "articleTitle"
}, {
name: "articleViewContent",
allowHtml: !0,
fit: !0,
classes: "articleContent"
} ]
}, {
kind: "onyx.Toolbar",
classes: "onyx-toolbar-inline",
components: [ {
kind: "onyx.Grabber",
style: "position: absolute;"
}, {
classes: "center",
style: "margin: inherit",
components: [ {
kind: "onyx.IconButton",
src: AppUtils.getImagePath("menu-icon-mark-read.png"),
ontap: ""
}, {
name: "starredIcon",
kind: "onyx.IconButton",
src: AppUtils.getImagePath("menu-icon-starred-outline.png"),
ontap: "toggleStarred"
}, {
kind: "onyx.IconButton",
src: AppUtils.getImagePath("menu-icon-down.png"),
ontap: "increaseIndex"
}, {
kind: "onyx.IconButton",
src: AppUtils.getImagePath("menu-icon-up.png"),
ontap: "decreaseIndex"
}, {
kind: "onyx.IconButton",
src: AppUtils.getImagePath("menu-icon-share.png"),
ontap: ""
} ]
} ]
} ]
} ],
rendered: function() {
this.size(), this.inherited(arguments);
},
resizeHandler: function() {
this.size();
var a = humane.create();
a.log(window.innerWidth + " " + AppUtils.getPixelRatio()), this.$.grabber.setShowing(parseInt(window.innerWidth) < 800), this.inherited(arguments);
},
size: function() {
var a = this.$.left.getBounds();
this.$.body.applyStyle("width", this.getBounds().width - a.width + "px");
},
refreshSettings: function() {
this.$.list.refresh();
},
loadArticles: function(a, b) {
this.$.includeReadButton.addRemoveClass("active", AppPrefs.get("includeRead"));
var c = _.groupBy(b, function(a) {
return reader.isRead(a);
});
this.unreadArticles = c.false || [], this.readArticles = c.true || [], this.sub = a, this.orderAndShowArticles(), this.previous();
},
orderAndShowArticles: function() {
var a = AppPrefs.get("includeRead") ? this.unreadArticles.concat(this.readArticles) : this.unreadArticles;
this.articles = _(a).sortBy(function(a) {
return AppPrefs.get("articleSort") === "Recent First" ? 1 - a.updated : a.updated;
}), this.$.list.setCount(this.articles.length), this.$.list.reset();
},
setupItem: function(a, b) {
var c = b.index, d = this.articles[c];
if (d) {
this.$.item.addRemoveClass("article-selected", a.isSelected(c)), this.$.item.setClasses("item enyo-border-box " + AppPrefs.get("articleFontSize")), this.$.articleTitle.setContent(d.title), this.$.unreadIndicator.setShowing(!reader.isRead(d)), this.$.articleTime.setContent(moment.unix(d.updated).format("h:mm a")), this.$.articleSubtitle.setContent("<b>" + d.feed.title + "</b>" + (d.preview && d.preview.length > 0 ? " - " + d.preview : ""));
if (!this.hideDivider) {
var e = moment.unix(d.updated).format("MMM Do"), f = this.articles[c - 1];
this.$.divider.setContent(e), this.$.divider.canGenerate = e != (f && moment.unix(f.updated).format("MMM Do"));
}
}
},
viewArticle: function(a, b) {
this.articleIndex = b.index, this.showCurrentArticle(), this.next();
},
showCurrentArticle: function() {
var a = this.articles[this.articleIndex];
this.$.articleViewTitle.setContent(a.title), this.$.articleViewContent.setContent(a.content), this.$.articleViewTime.setContent(moment.unix(a.updated).format("h:mm a")), this.$.starredIcon.setSrc(reader.isStarred(a) ? AppUtils.getImagePath("menu-icon-starred.png") : AppUtils.getImagePath("menu-icon-starred-outline.png")), AppUtils.stringToBool(a.read) === !1 && (a.read = !0, reader.background.markRead(a, function() {
publish("refreshGrid");
})), this.$.list.select(this.articleIndex, a);
},
clearCurrentArticle: function() {
this.$.articleViewTitle.setContent(""), this.$.articleViewContent.setContent(""), this.$.articleViewTime.setContent("");
},
increaseIndex: function() {
this.articles[this.articleIndex + 1] && this.articleIndex++, this.showCurrentArticle();
},
decreaseIndex: function() {
this.articles[this.articleIndex - 1] && this.articleIndex--, this.showCurrentArticle();
},
toggleStarred: function() {
var a = this.articles[this.articleIndex];
console.log("isStarred", reader.isStarred(a)), a.starred = !reader.isStarred(a), reader.background.markStarred(a), this.$.starredIcon.setSrc(reader.isStarred(a) ? AppUtils.getImagePath("menu-icon-starred.png") : AppUtils.getImagePath("menu-icon-starred-outline.png"));
},
markAllRead: function() {
console.log(_.reject(this.articles, function(a) {
return reader.isRead(a);
})), reader.background.markAllRead(this.sub, _.reject(this.articles, function(a) {
return reader.isRead(a);
}), enyo.bind(this, function() {
this.$.list.refresh();
}));
},
toggleIncludeUnread: function(a) {
AppPrefs.set("includeRead", !AppPrefs.get("includeRead")), a.addRemoveClass("active", AppPrefs.get("includeRead")), this.orderAndShowArticles();
}
});

// js/settingsPage.js

enyo.kind({
name: "settingsPage",
fit: !0,
layoutKind: "FittableRowsLayout",
handlers: {
onShowGridPage: "",
onLogOut: ""
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
classes: "center"
} ]
}, {
name: "settingList",
classes: "fixedWidthList",
components: []
} ],
settings: [ {
section: "Subscription Grid",
items: [ {
type: "toggle",
description: "Hide Read Feeds",
preference: "hideRead"
}, {
type: "select",
description: "Tapping on Folders...",
preference: "folderTap",
options: [ "Shows Feeds", "Shows Articles" ]
} ]
}, {
section: "Reading Articles",
items: [ {
type: "select",
description: "Font Size",
preference: "articleFontSize",
options: [ "Small", "Medium", "Large" ]
}, {
type: "select",
description: "Article Sort",
preference: "articleSort",
options: [ "Recent First", "Oldest First" ]
} ]
} ],
create: function() {
this.inherited(arguments), _.each(this.settings, enyo.bind(this, function(a) {
var b = [ {
kind: "onyx.GroupboxHeader",
content: a.section
} ];
_.each(a.items, function(a) {
var c = {
classes: "groupItem",
components: []
};
switch (a.type) {
case "toggle":
c.components.push({
kind: "onyx.ToggleButton",
onContent: "Yes",
offContent: "No",
classes: "floatRight",
value: AppPrefs.get(a.preference),
preference: a.preference,
ontap: "setPreference"
}, {
kind: "enyo.Control",
content: a.description
});
break;
case "select":
var d = [], e = 0;
_.each(a.options, function(b, c) {
d.push({
content: b,
value: b
}), b === AppPrefs.get(a.preference) && (e = c);
}), c.components.push({
kind: "Select",
onchange: "setPreference",
selected: e,
preference: a.preference,
classes: "floatRight",
components: d
}, {
kind: "enyo.Control",
content: a.description
});
}
b.push(c);
}), this.$.settingList.createComponent({
kind: "onyx.Groupbox",
components: b
}, {
owner: this
});
})), this.$.settingList.createComponent({
kind: "onyx.Button",
classes: "onyx-negative full",
content: "Log Out",
ontap: "logOut"
}, {
owner: this
});
},
rendered: function() {
this.inherited(arguments);
},
bubbleEvent: function(a, b) {
this.bubble(a.eventToBubble);
},
setPreference: function(a, b) {
var c = a.type === "select" ? a.components[a.getSelected()].value : a.getValue();
AppPrefs.set(a.preference, c);
},
logOut: function() {
reader.logout(), databaseHelper.dumpData(), this.bubble("onLogOut");
}
});

// js/addFeedPage.js

enyo.kind({
name: "addFeedPage",
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
classes: "center"
} ]
}, {
classes: "fixedWidthList",
components: [ {
kind: "onyx.Groupbox",
components: [ {
kind: "onyx.GroupboxHeader",
content: "Add New Feed"
}, {
kind: "onyx.InputDecorator",
components: [ {
name: "username",
kind: "onyx.Input",
style: "width: 70%",
placeholder: "URL/Search Term"
}, {
kind: "enyo.Select",
classes: "floatRight",
components: [ {
content: "Auto",
active: !0
}, {
content: "Force URL"
}, {
content: "Force Search"
} ]
} ]
} ]
}, {
kind: "onyx.Button",
content: "Go",
ontap: "processInput",
classes: "full"
} ]
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

// js/editSubPage.js

enyo.kind({
name: "editSubPage",
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
content: "Edit",
classes: "center"
} ]
}, {
classes: "fixedWidthList",
components: [ {
kind: "onyx.Groupbox",
components: [ {
kind: "onyx.GroupboxHeader",
content: "Add New Feed"
}, {
kind: "onyx.InputDecorator",
components: [ {
name: "username",
kind: "onyx.Input",
style: "width: 70%",
placeholder: "URL/Search Term"
}, {
kind: "enyo.Select",
classes: "floatRight",
components: [ {
content: "Auto",
active: !0
}, {
content: "Force URL"
}, {
content: "Force Search"
} ]
} ]
} ]
}, {
kind: "onyx.Button",
content: "Go",
ontap: "processInput",
classes: "full"
} ]
} ],
bubbleEvent: function(a, b) {
this.bubble(a.eventToBubble);
},
create: function() {
this.inherited(arguments);
},
showingChanged: function(a) {
this.inherited(arguments), this.getShowing() && a !== undefined && this.activate();
},
activate: function() {
console.log("gridPage activated"), this.resized();
}
});

// js/App.js

enyo.kind({
name: "App",
fit: !0,
components: [ {
kind: "Panels",
classes: "enyo-fit",
components: [ {
name: "loadingPage",
content: "Loading...",
classes: "loading"
}, {
name: "loginPage",
kind: "loginPage",
onLogin: "loggedIn"
}, {
name: "gridPage",
kind: "gridPage",
onViewArticles: "showArticlePage",
onShowSettingsPage: "showSettingsPage",
onShowAddFeedPage: "showAddFeedPage"
}, {
name: "articlePage",
kind: "articlePage",
onShowGridPage: "showGridPage",
onViewArticle: "showArticleViewPage"
}, {
name: "tourPage",
kind: "tourPage",
onShowGridPage: "showGridPage"
}, {
name: "addFeedPage",
kind: "addFeedPage",
onShowGridPage: "showGridPage"
}, {
name: "settingsPage",
kind: "settingsPage",
onShowGridPage: "showGridPage",
onLogOut: "showLoginPage"
} ]
} ],
panelsIndex: {
loadingPage: 0,
loginPage: 1,
gridPage: 2,
articlePage: 3,
tourPage: 4,
addFeedPage: 5,
settignsPage: 6
},
create: function() {
this.inherited(arguments), window.document.getElementsByTagName("body")[0].className += " " + AppUtils.getPlatform(), databaseHelper.loadDb(), subscribe("online", enyo.bind(this, this.nowOnline));
},
rendered: function() {
this.inherited(arguments), this.checkLogin();
},
checkLogin: function() {
reader.hasAuth() ? AppUtils.testInternetConnection(enyo.bind(this, function(a) {
a ? reader.getToken(enyo.bind(this, this.showGridPage), enyo.bind(this, function() {
this.showLoginPage();
})) : this.showGridPage();
})) : this.showLoginPage();
},
loggedIn: function(a, b) {
console.log("Logged in"), b && b.showTour ? this.showTourPage() : this.showGridPage(), this.$.gridPage.loadFeedsFromOnline();
},
changePage: function(a) {
this.$.panels.setIndex(this.panelsIndex[a]);
},
showLoginPage: function() {
this.changePage("loginPage");
},
showGridPage: function(a, b) {
this.changePage("gridPage");
},
showArticlePage: function(a, b) {
if (!b || !b.articles || !b.sub) {
console.error("Error Displaying Articles");
return;
}
this.changePage("articlePage"), this.$.articlePage.loadArticles(b.sub, b.articles);
},
backToArticlePage: function() {
this.changePage("articlePage");
},
showArticleViewPage: function(a, b) {
if (!b || !b.articles || b.index === undefined) {
console.error("Error Viewing Articles");
return;
}
this.changePage("articleViewPage"), this.$.articleViewPage.viewArticles(b.articles, b.index);
},
showTourPage: function() {
this.changePage("tourPage");
},
showSettingsPage: function() {
this.changePage("settingsPage");
},
showAddFeedPage: function() {
this.changePage("addFeedPage");
},
nowOnline: function() {
databaseHelper.getQueue(enyo.bind(this, function(a) {
console.log("OUR QUEUE", a);
var b = 0, c = enyo.bind(this, function() {
b < a.length && (b++, this.processQueuedData(a[b - 1], c));
});
c();
})), console.log("NOW ONLINE. CHECK DAT QUEUE");
},
processQueuedData: function(a, b) {
var c = JSON.parse(Base64.decode(a.data));
console.log("PROCESSING", c);
switch (c.action) {
case "markRead":
var d = c.data;
console.log("FROM QUEUE, isREAD?", d.read), reader.setItemTag(d.feed.id, d.id, "read", d.read, function() {
console.log("marked read", d), databaseHelper.clearFromQueue(a.id, b);
}, function() {
console.log("Mark read from Queued Failed"), b();
});
break;
case "markAllRead":
var e = _(c.data).chain().groupBy(function(a, b) {
return "set" + Math.floor(b / 100);
}).toArray().value(), f = 0, g = function() {
if (f < e.length) {
var c = [], d = [];
_.each(e[f], function(a, b) {
c.push(a.feed.id), d.push(a.id);
}), reader.setItemTag(c, d, "read", !0, function() {
console.log("WORKED?"), f++, g();
}, function() {
console.log("Mark all read from Queued Failed"), b();
});
} else console.log("DONE! clearing from queue"), databaseHelper.clearFromQueue(a.id, b);
};
g();
break;
case "markStarred":
var d = c.data;
console.log("FROM QUEUE, isStarred?", d.starred), reader.setItemTag(d.feed.id, d.id, "star", d.starred, function() {
console.log("marked read", d), databaseHelper.clearFromQueue(a.id, b);
}, function() {
console.log("Mark starred from Queued Failed"), b();
});
break;
case "editFeedLabel":
var h = c.data.feedId, i = c.data.labelId, j = c.data.opt;
reader.editFeedLabel(h, i, j, function() {
console.log("Edited feed label"), databaseHelper.clearFromQueue(a.id, b);
}, function() {
console.log("EDIT FEED LABEL FAILED"), b();
});
break;
case "editFeedTitle":
var h = c.data.feedId, k = c.data.newTitle;
reader.editFeedTitle(h, k, function() {
console.log("EDITED FEED TITLE"), databaseHelper.clearFromQueue(a.id, b);
}, function() {
console.log("EDIT FEED TITLE FAILED"), b();
});
break;
case "editLabelTitle":
var i = c.data.labelId, k = c.data.newTitle;
reader.editLabelTitle(i, k, function() {
console.log("EDITED LABEL TITLE"), databaseHelper.clearFromQueue(a.id, b);
}, function() {
console.log("EDIT LABEL TITLE FAILED"), b();
});
break;
case "unsubscribeFeed":
var h = c.data;
reader.unsubscribeFeed(h, function() {
console.log("UNSUBSCRIBED FEED"), databaseHelper.clearFromQueue(a.id, b);
}, function() {
console.log("UNSUBSCRIBE FEED FAILED"), b();
});
}
}
});
